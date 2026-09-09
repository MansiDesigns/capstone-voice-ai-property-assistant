import json
import re

def evaluate_edit_correctness(response_text: str, expected_filter: dict) -> bool:
    """
    Evaluates if a voice edit (e.g. 'remove unfurnished properties') successfully 
    filtered the list without hallucinating changes.
    """
    passed = True
    errors = []

    try:
        match = re.search(r"```json\n([\s\S]*?)\n```", response_text)
        if not match:
            print("[Edit Correctness] No JSON block found in response.")
            return False
            
        properties = json.loads(match.group(1))

        # Check if properties respect the filter
        # e.g., expected_filter = {"furnished": True}
        for prop in properties:
            for k, v in expected_filter.items():
                if k in prop and prop[k] != v:
                    errors.append(f"Property {prop.get('id')} failed filter {k}=={v} (got {prop[k]})")
                    passed = False

        if passed:
            print("[Edit Correctness] PASS - Properties respect the applied voice edit.")
        else:
            print("[Edit Correctness] FAIL - " + " | ".join(errors))
            
        return passed

    except Exception as e:
        print(f"[Edit Correctness] Error during evaluation: {e}")
        return False
