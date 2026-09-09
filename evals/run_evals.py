import json
import asyncio
import requests
import uuid
from dotenv import load_dotenv

load_dotenv()

from eval_feasibility import evaluate_feasibility
from eval_edit_correctness import evaluate_edit_correctness
from eval_grounding import evaluate_grounding

API_URL = "http://127.0.0.1:8000/chat"

async def simulate_flow(messages, session_id):
    last_response = ""
    for msg in messages:
        if msg["role"] == "user":
            print(f"User: {msg['content']}")
            res = requests.post(API_URL, json={
                "session_id": session_id,
                "message": msg["content"]
            })
            if res.status_code == 200:
                last_response = res.json()["response"]
                print(f"Assistant: {last_response.encode('ascii', 'ignore').decode('ascii')}\n")
            else:
                print(f"Error calling API: {res.status_code}")
    return last_response

async def main():
    print("=== Running Evaluation Suite ===\n")
    
    with open("evals/test_data.json", "r") as f:
        data = json.load(f)

    results = {}

    # 1. Flow A: Feasibility
    print("--- Running Flow A: Feasibility ---")
    session_id_a = str(uuid.uuid4())
    flow_a = data["flows"]["flow_a_feasibility"]
    res_a = await simulate_flow(flow_a["messages"], session_id_a)
    pass_a = evaluate_feasibility(res_a, flow_a["expected_constraints"])
    results["Feasibility"] = pass_a
    print("\n")

    # 2. Flow B: Edit Correctness
    print("--- Running Flow B: Edit Correctness ---")
    session_id_b = str(uuid.uuid4())
    flow_b = data["flows"]["flow_b_voice_edit"]
    # We inject the assistant's response in the mock session manually by directly pinging the agent
    # Or just simulate through the API if the LLM supports natural editing
    res_b = await simulate_flow(flow_b["messages"], session_id_b)
    pass_b = evaluate_edit_correctness(res_b, flow_b["expected_filter"])
    results["Edit Correctness"] = pass_b
    print("\n")

    # 3. Flow C: Grounding
    print("--- Running Flow C: Grounding ---")
    session_id_c = str(uuid.uuid4())
    flow_c = data["flows"]["flow_c_grounding"]
    res_c = await simulate_flow(flow_c["messages"], session_id_c)
    pass_c = await evaluate_grounding(res_c, flow_c["expected_rag_topic"])
    results["Grounding"] = pass_c
    print("\n")

    print("=== Final Evaluation Report ===")
    all_passed = True
    for test, passed in results.items():
        status = "[PASS]" if passed else "[FAIL]"
        if not passed: all_passed = False
        print(f"{test}: {status}")

    if all_passed:
        print("\nAll evaluations passed successfully!")
    else:
        print("\nSome evaluations failed. Check logs above.")

if __name__ == "__main__":
    asyncio.run(main())
