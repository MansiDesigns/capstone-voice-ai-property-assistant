import os
import asyncio
from groq import AsyncGroq

# Setup Groq Client for LLM-as-a-judge
# We use a fast model for evaluation
EVAL_MODEL = "openai/gpt-oss-120b"
client = AsyncGroq(api_key=os.getenv("GROQ_API_KEY", "mock_key"))

async def evaluate_grounding(response_text: str, expected_topic: str) -> bool:
    """
    Uses LLM-as-a-judge to verify that the assistant's response is factually grounded 
    and discusses the expected RAG topic without hallucinating.
    """
    prompt = f"""
    You are an evaluation judge.
    Evaluate the following response from a real estate assistant.
    Does this response accurately discuss the topic: '{expected_topic}'?
    Respond with exactly 'PASS' if it does, or 'FAIL' and a reason if it hallucinates or misses the topic.
    
    Response to evaluate:
    {response_text}
    """
    
    try:
        res = await client.chat.completions.create(
            model=EVAL_MODEL,
            messages=[{"role": "user", "content": prompt}]
        )
        judge_output = res.choices[0].message.content.strip()
        
        if judge_output.startswith("PASS"):
            print(f"[Grounding] PASS - Response is grounded in {expected_topic}.")
            return True
        else:
            print(f"[Grounding] FAIL - {judge_output}")
            return False
            
    except Exception as e:
        print(f"[Grounding] Error during LLM evaluation: {e}")
        return False
