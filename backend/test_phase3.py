import sys
import os
from dotenv import load_dotenv

# Load .env variables before importing app modules
load_dotenv()

# Add the backend directory to sys.path so we can import 'app'
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.services.llm_client import extract_features
from app.services.embedding_client import get_embedding

def test_pipeline():
    test_text = "I spent 20 minutes scrolling through my phone trying to find a picture of my dog at the beach from last summer, but Google Photos just gave me a bunch of random sand pictures. It's so frustrating that I can't just search 'Max at the beach 2022' and get it instantly."
    
    print("--- Testing Phase 3: Data Processing & Vectorization ---")
    print(f"\nRaw Input Text:\n{test_text}\n")
    
    print("1. Testing LLM Extraction (Groq)...")
    try:
        features = extract_features(test_text)
        print(f"Extraction Successful!")
        print(f"Target Intent: {features.get('target_intent')}")
        print(f"Search Strategy: {features.get('search_strategy')}")
        print(f"Emotion: {features.get('emotion')}")
    except Exception as e:
        print(f"Extraction Failed: {e}")
        return
        
    print("\n2. Testing Embedding Generation (SentenceTransformers)...")
    try:
        embedding = get_embedding(test_text)
        print(f"Embedding Successful!")
        print(f"Embedding Vector Length: {len(embedding)}")
        print(f"First 5 dimensions: {embedding[:5]}")
    except Exception as e:
        print(f"Embedding Failed: {e}")
        return
        
    print("\nPipeline tests completed successfully!")

if __name__ == "__main__":
    test_pipeline()
