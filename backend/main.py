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
import os
import requests

@app.post("/transcribe")
async def transcribe_audio(audio: UploadFile = File(...)):
    stt_key = os.getenv("STT_API_KEY")
    if not stt_key:
        raise HTTPException(status_code=500, detail="STT_API_KEY not configured")
        
    # Read the audio file
    audio_data = await audio.read()
    
    # We will try Deepgram as the primary 40-hex key provider
    # If it fails, fallback to HuggingFace
    headers = {
        "Authorization": f"Token {stt_key}",
        "Content-Type": audio.content_type or "audio/webm"
    }
    
    try:
        # Deepgram API
        response = requests.post(
            "https://api.deepgram.com/v1/listen?model=nova-2&smart_format=true",
            headers=headers,
            data=audio_data,
            timeout=10
        )
        if response.status_code == 200:
            result = response.json()
            transcript = result.get("results", {}).get("channels", [{}])[0].get("alternatives", [{}])[0].get("transcript", "")
            return {"transcript": transcript}
            
        # Fallback to HuggingFace if not Deepgram
        hf_headers = {"Authorization": f"Bearer {stt_key}"}
        hf_response = requests.post(
            "https://api-inference.huggingface.co/models/openai/whisper-large-v3-turbo",
            headers=hf_headers,
            data=audio_data,
            timeout=15
        )
        if hf_response.status_code == 200:
            return {"transcript": hf_response.json().get("text", "")}
            
        raise HTTPException(status_code=500, detail=f"STT Error: {response.text}")
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

from fastapi.responses import StreamingResponse

class TTSRequest(BaseModel):
    text: str

@app.post("/tts")
async def text_to_speech(req: TTSRequest):
    stt_key = os.getenv("STT_API_KEY")
    if not stt_key:
        raise HTTPException(status_code=500, detail="STT_API_KEY not configured")
        
    headers = {
        "Authorization": f"Token {stt_key}",
        "Content-Type": "application/json"
    }
    
    payload = {"text": req.text}
    
    try:
        response = requests.post(
            "https://api.deepgram.com/v1/speak?model=aura-asteria-en",
            headers=headers,
            json=payload,
            timeout=10,
            stream=True
        )
        if response.status_code == 200:
            return StreamingResponse(response.iter_content(chunk_size=1024), media_type="audio/mpeg")
        else:
            raise HTTPException(status_code=500, detail=f"TTS Error: {response.text}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
def health_check():
    return {"status": "ok"}

# triggered reload
# triggered reload again


