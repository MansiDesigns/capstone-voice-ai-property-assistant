import json
import re

def evaluate_feasibility(response_text: str, expected_constraints: dict) -> bool:
    """
    Evaluates if the properties embedded in the LLM's response strictly match
    the expected constraints (budget, bhk).
    Returns True if passed, False otherwise.
    """
    passed = True
    errors = []

    try:
        # Extract json block
        match = re.search(r"```json\n([\s\S]*?)\n```", response_text)
        if not match:
            print("[Feasibility] No JSON block found in response.")
            return False
            
        properties = json.loads(match.group(1))
        if not properties:
            print("[Feasibility] JSON block is empty.")
            return False

        for prop in properties:
            if 'rent_amount' in prop and prop['rent_amount'] > expected_constraints['budget']:
                errors.append(f"Property {prop.get('id')} exceeds budget: {prop['rent_amount']} > {expected_constraints['budget']}")
                passed = False
            
            if 'bhk' in prop and str(prop['bhk']) != expected_constraints['bhk']:
                errors.append(f"Property {prop.get('id')} mismatched BHK: {prop['bhk']} != {expected_constraints['bhk']}")
                passed = False
                
            for acc_key in ['step_free', 'elevator', 'wide_doors', 'reserved_parking']:
                if acc_key in expected_constraints:
                    if prop.get(acc_key) != expected_constraints[acc_key]:
                        errors.append(f"Property {prop.get('id')} missing accessibility requirement: {acc_key}")
                        passed = False
                
        if passed:
            print("[Feasibility] PASS - All properties match the constraints.")
        else:
            print("[Feasibility] FAIL - " + " | ".join(errors))
            
        return passed

    except Exception as e:
        print(f"[Feasibility] Error during evaluation: {e}")
        return False
