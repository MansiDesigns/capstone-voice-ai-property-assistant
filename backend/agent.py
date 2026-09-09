import os
import json
import asyncio
from groq import AsyncGroq
from backend.tools import search_properties, get_neighborhood_info, search_amenities, book_visit, send_shortlist_email

# Initialize Groq client
client = AsyncGroq(api_key=os.getenv("GROQ_API_KEY", "mock_key"))

SYSTEM_PROMPT = """You are a Voice-Based AI Property Assistant helping users find rental properties in Bengaluru.
You collect user preferences, shortlist real properties, ground claims in public sources (RAG), allow voice refinements, explain choices, and book site visits.

Rules:
1. Ask a maximum of 5 clarifying questions total.
2. Confirm constraints before generating a shortlist.
3. Use the `search_properties` tool to find available listings.
4. Use the `get_neighborhood_info` tool to ground your neighborhood explanations with citations.
5. Use `search_amenities` (MCP) to find nearby transit and amenities.
6. When the user is ready, use `book_visit` to confirm a slot, or `send_shortlist_email` to finalize.
7. Be conversational and concise, as your output will be spoken.
8. When presenting matching properties to the user, you MUST output a raw JSON array wrapped in ```json containing the property dicts. 
9. Include 'amenities' inside each property dict using information you fetch from `search_amenities` MCP tool. Provide 2-3 string items describing pedestrian/transit proximity.
10. Ensure each property dict has 'id', 'society', 'rent_amount', 'sqft', 'bhk', 'lat', 'lng', 'step_free', 'elevator', 'wide_doors', 'reserved_parking', 'score', and 'explanation'. Infer the accessibility values (true/false) logically if missing from DB.
"""

TOOLS = [
    {
        "type": "function",
        "function": {
            "name": "search_properties",
            "description": "Query the relational database for properties matching budget and bhk criteria.",
            "parameters": {
                "type": "object",
                "properties": {
                    "budget": {"type": "integer", "description": "Maximum rent budget"},
                    "bhk": {"type": "string", "description": "Number of bedrooms (e.g., '1', '2', '3')"},
                    "area": {"type": "string", "description": "Target neighborhood area"}
                }
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "get_neighborhood_info",
            "description": "Query the RAG Vector DB for practical neighborhood guidance (safety, character, transit).",
            "parameters": {
                "type": "object",
                "properties": {
                    "query": {"type": "string", "description": "Query describing what you want to know about the neighborhood"}
                },
                "required": ["query"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "search_amenities",
            "description": "Fetch nearby amenities and transit points using OpenStreetMap.",
            "parameters": {
                "type": "object",
                "properties": {
                    "lat": {"type": "number", "description": "Latitude of the property"},
                    "lng": {"type": "number", "description": "Longitude of the property"},
                    "radius": {"type": "integer", "description": "Search radius in meters"}
                },
                "required": ["lat", "lng"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "book_visit",
            "description": "Book a site-visit slot for a liked property.",
            "parameters": {
                "type": "object",
                "properties": {
                    "property_id": {"type": "string", "description": "ID of the property to visit"},
                    "time_slot": {"type": "string", "description": "Preferred time slot (e.g., 'Tomorrow 10 AM')"}
                },
                "required": ["property_id", "time_slot"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "send_shortlist_email",
            "description": "Send the finalized shortlist to the user via email (triggers n8n).",
            "parameters": {
                "type": "object",
                "properties": {
                    "shortlist": {"type": "array", "items": {"type": "string"}, "description": "List of property IDs in the finalized shortlist"}
                },
                "required": ["shortlist"]
            }
        }
    }
]

async def execute_tool(name: str, args: dict):
    if name == "search_properties":
        return search_properties(args.get("budget"), args.get("bhk"), args.get("area"))
    elif name == "get_neighborhood_info":
        return get_neighborhood_info(args.get("query"))
    elif name == "search_amenities":
        return await search_amenities(args.get("lat"), args.get("lng"), args.get("radius", 1000))
    elif name == "book_visit":
        return book_visit(args.get("property_id"), args.get("time_slot"))
    elif name == "send_shortlist_email":
        return send_shortlist_email(args.get("shortlist"))
    else:
        return {"error": f"Unknown tool {name}"}

async def process_user_message(messages: list, state: dict):
    # messages is expected to be a list of dicts: {"role": "user"/"assistant"/"system", "content": ...}
    if not any(m["role"] == "system" for m in messages):
        messages.insert(0, {"role": "system", "content": SYSTEM_PROMPT})
        
    try:
        response = await client.chat.completions.create(
            model="openai/gpt-oss-120b",
            messages=messages,
            tools=TOOLS,
            tool_choice="auto",
            max_tokens=4096
        )
        
        response_message = response.choices[0].message
        
        if response_message.tool_calls:
            messages.append({
                "role": "assistant",
                "content": response_message.content,
                "tool_calls": [t.model_dump() for t in response_message.tool_calls]
            })
            
            for tool_call in response_message.tool_calls:
                function_name = tool_call.function.name
                function_args = json.loads(tool_call.function.arguments)
                
                print(f"[Tool Call] {function_name}({function_args})")
                tool_result = await execute_tool(function_name, function_args)
                
                messages.append({
                    "role": "tool",
                    "tool_call_id": tool_call.id,
                    "name": function_name,
                    "content": json.dumps(tool_result)
                })
                
            # Second pass to get the final answer
            second_response = await client.chat.completions.create(
                model="openai/gpt-oss-120b",
                messages=messages
            )
            return second_response.choices[0].message.content, messages
        else:
            messages.append({"role": "assistant", "content": response_message.content})
            return response_message.content, messages
            
    except Exception as e:
        print(f"Error calling Groq API: {e}")
        return f"I encountered an error connecting to my AI backend: {e}", messages
