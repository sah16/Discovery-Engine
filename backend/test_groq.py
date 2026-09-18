from app.services.llm_client import extract_features
import json

def test_groq():
    test_text = "I've been scrolling for 20 minutes trying to find that picture of the sunset from my trip to Hawaii last year, but I can't remember the exact month. It's so frustrating!"
    
    print("Testing Groq API with Llama 3.3...")
    print(f"Input text: '{test_text}'")
    print("-" * 40)
    
    result = extract_features(test_text)
    
    print("Result:")
    print(json.dumps(result, indent=2))

if __name__ == "__main__":
    test_groq()
