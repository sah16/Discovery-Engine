import json
import logging
from typing import Dict, Any
import groq
from app.config import settings

logger = logging.getLogger(__name__)

# Initialize Groq client
# Fallback to a valid default model if openai/gpt-oss-120b doesn't exist. Usually llama-3.3-70b-versatile is very reliable.
try:
    client = groq.Groq(api_key=settings.GROQ_API_KEY)
except Exception as e:
    logger.error(f"Failed to initialize Groq client: {e}")
    client = None

def extract_metadata(text: str) -> Dict[str, Any]:
    """
    Uses the Groq LLM to extract structured metadata from raw user feedback.
    Returns a dictionary with keys: target_of_search, search_strategy, emotion.
    Returns a dictionary with keys: remembered_attributes, forgotten_attributes.
    """
    if not client:
        return {"remembered_attributes": [], "forgotten_attributes": []}

    prompt = f"""
    You are an expert user researcher analyzing feedback about a photo retrieval system.
    Read the following user feedback and extract specific pieces of information.
    
    1. remembered_attributes: A list of strings identifying what the user recalled. Choose from: ["Event", "People", "Approx time", "Location", "Object"]. (Can be empty).
    2. forgotten_attributes: A list of strings identifying what the user explicitly forgot. Choose from: ["Exact date", "Exact location", "Person name", "Event name"]. (Can be empty).
    
    Format the output strictly as a JSON object:
    {{
        "remembered_attributes": ["..."],
        "forgotten_attributes": ["..."]
    }}
    
    Do not include any explanation or markdown formatting outside the JSON block.
    
    Feedback:
    "{text}"
    """
    
    try:
        response = client.chat.completions.create(
            messages=[
                {"role": "user", "content": prompt}
            ],
            # Use openai/gpt-oss-120b as specified in the plan
            model="openai/gpt-oss-120b",
            temperature=0.1,
            max_tokens=150,
            response_format={"type": "json_object"}
        )
        
        content = response.choices[0].message.content
        return json.loads(content)
        
    except Exception as e:
        logger.error(f"Error during LLM extraction: {e}")
        return {"target_of_search": None, "search_strategy": None, "emotion": None}
