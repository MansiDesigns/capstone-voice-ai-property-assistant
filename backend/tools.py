import sqlite3
import os
import os
import chromadb
from sentence_transformers import SentenceTransformer
import requests
import asyncio
from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client
from dotenv import load_dotenv

load_dotenv()

# Lazy load Chroma & Model
_chroma_client = None
_bge_model = None

def get_db_connection():
    conn = sqlite3.connect('property_db.sqlite')
    conn.row_factory = sqlite3.Row
    return conn

def get_chroma_client():
    global _chroma_client
    if _chroma_client is None:
        chroma_host = os.getenv("CHROMA_DB_HOST", "localhost")
        chroma_port = os.getenv("CHROMA_DB_PORT", "8000")
        _chroma_client = chromadb.HttpClient(host=chroma_host, port=chroma_port)
    return _chroma_client

def get_bge_model():
    global _bge_model
    if _bge_model is None:
        _bge_model = SentenceTransformer('BAAI/bge-small-en-v1.5')
    return _bge_model

# --- Tools ---

def search_properties(budget: int = None, bhk: str = None, area: str = None):
    """
    Query the PostgreSQL database for properties matching user criteria.
    Returns a list of matching properties.
    """
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        query = "SELECT * FROM properties WHERE 1=1"
        params = []
        
        if budget:
            query += " AND rent_amount <= ?"
            params.append(budget)
        if bhk:
            query += " AND bhk = ?"
            params.append(str(bhk))
            
        query += " LIMIT 5"
        
        cursor.execute(query, tuple(params))
        rows = cursor.fetchall()
        conn.close()
        
        if not rows:
            return {"message": "No properties found matching your criteria."}
            
        return [dict(r) for r in rows]
    except Exception as e:
        return {"error": f"Database error: {str(e)}"}

def get_neighborhood_info(query: str):
    """
    Query the ChromaDB for unstructured neighborhood guidance (safety, character, transit).
    Returns factual context + citations for the RAG prompt.
    """
    try:
        client = get_chroma_client()
        collection = client.get_collection(name="neighborhoods")
    except ValueError:
        return {"error": "Collection 'neighborhoods' not found."}
    except Exception as e:
        return {"error": f"ChromaDB connection error: {str(e)}"}
        
    model = get_bge_model()
    query_embedding = model.encode(query).tolist()
    
    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=3
    )
    
    if not results['documents'] or not results['documents'][0]:
        return {"message": "No neighborhood data found for that query."}
        
    return {
        "context": results['documents'][0],
        "citations": results['metadatas'][0]
    }

async def search_amenities(lat: float, lng: float, radius: int = 1000):
    """
    Integrate the OpenStreetMap MCP to fetch nearby amenities around a location.
    """
    server_params = StdioServerParameters(
        command="npx",
        args=["-y", "@jagan-shanmugam/open-streetmap-mcp"],
    )
    
    try:
        async with stdio_client(server_params) as (read, write):
            async with ClientSession(read, write) as session:
                await session.initialize()
                
                tools = await session.list_tools()
                tool_name = tools.tools[0].name # Fallback to first tool
                
                for t in tools.tools:
                    if 'amenities' in t.name or 'poi' in t.name:
                        tool_name = t.name
                        break
                        
                result = await session.call_tool(tool_name, arguments={
                    "lat": lat,
                    "lon": lng,
                    "radius": radius
                })
                return {"result": result.content}
    except Exception as e:
        return {"error": f"MCP execution failed: {str(e)}"}

def book_visit(property_id: str, time_slot: str):
    """
    Voice command to book a site-visit slot. Returns a confirmation code.
    """
    import uuid
    confirmation_code = str(uuid.uuid4())[:8].upper()
    return {
        "status": "success",
        "property_id": property_id,
        "time_slot": time_slot,
        "confirmation_code": confirmation_code,
        "message": f"Successfully booked visit for {time_slot}."
    }

def send_shortlist_email(shortlist: list):
    """
    Trigger the n8n webhook to compile the shortlist into a PDF and email it.
    """
    webhook_url = os.getenv("N8N_WEBHOOK_URL", "http://localhost:5678/webhook/shortlist")
    try:
        response = requests.post(webhook_url, json={"shortlist": shortlist})
        return {"status": "success", "message": "Email dispatched via n8n."}
    except Exception as e:
        return {"status": "error", "message": f"Failed to trigger n8n: {e}"}
