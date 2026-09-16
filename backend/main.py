from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Optional
from dotenv import load_dotenv
load_dotenv()

from backend.agent import process_user_message
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Voice-Based AI Property Assistant")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage for session state
# A real application would use Redis or a database
sessions: Dict[str, dict] = {}

class ChatRequest(BaseModel):
    session_id: str
    message: str

class ChatResponse(BaseModel):
    response: str
    session_id: str

@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(req: ChatRequest):
    session_id = req.session_id
    
    if session_id not in sessions:
        sessions[session_id] = {
            "messages": [],
            "question_count": 0
        }
        
    session = sessions[session_id]
    
    # Check max clarifying questions rule
    if session["question_count"] >= 5 and "?" in req.message:
        # Note: In a real implementation we'd let the LLM know it hit the limit, 
        # or we'd just track the LLM's questions. We are doing simple tracking here.
        pass
        
    session["messages"].append({"role": "user", "content": req.message})
    
    reply, new_messages = await process_user_message(session["messages"], session)
    
    session["messages"] = new_messages
    
    # Very basic heuristic for tracking LLM questions
    if "?" in reply:
        session["question_count"] += 1
        
    return ChatResponse(response=reply, session_id=session_id)

from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.responses import Response
import os
import requests
from groq import AsyncGroq

@app.post("/transcribe")
async def transcribe_audio(audio: UploadFile = File(...)):
    stt_key = os.getenv("GROQ_API_KEY")
    if not stt_key:
        raise HTTPException(status_code=500, detail="GROQ_API_KEY not configured")
        
    try:
        audio_data = await audio.read()
        client = AsyncGroq(api_key=stt_key)
        transcription = await client.audio.transcriptions.create(
            file=(audio.filename, audio_data),
            model="whisper-large-v3-turbo",
        )
        return {"transcript": transcription.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class TTSRequest(BaseModel):
    text: str

@app.post("/tts")
async def text_to_speech(req: TTSRequest):
    tts_key = os.getenv("TTS_API_KEY")
    if not tts_key:
        raise HTTPException(status_code=500, detail="TTS_API_KEY not configured")
        
    headers = {
        "Authorization": f"Token {tts_key}",
        "Content-Type": "application/json"
    }
    
    payload = {"text": req.text}
    
    try:
        response = requests.post(
            "https://api.deepgram.com/v1/speak?model=aura-asteria-en",
            headers=headers,
            json=payload,
            timeout=10
        )
        if response.status_code == 200:
            return Response(content=response.content, media_type="audio/mpeg")
        else:
            raise HTTPException(status_code=500, detail=f"TTS Error: {response.text}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
def health_check():
    return {"status": "ok"}

# triggered reload
# triggered reload again


