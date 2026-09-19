import os
from groq import Groq
from typing import List, Dict
from app.config import settings

def get_groq_client() -> Groq:
    """
    Initializes and returns the Groq client.
    """
    api_key = settings.GROQ_API_KEY
    if not api_key:
        print("Warning: GROQ_API_KEY is not set.")
    
    # Initialize the client. In a real scenario, this would be a singleton or dependency injected.
    client = Groq(api_key=api_key)
    return client

def infer_intent(query: str) -> str:
    """
    Classifies a natural language query into one of the defined intent categories using Groq.
    """
    client = get_groq_client()
    prompt = f"""
    Analyze the following user query intended for a photo retrieval analysis system.
    Classify the query into exactly one of the following categories:
    1. Cognitive Memory & Recall
    2. Search Formulation & Query Behavior
    3. Retrieval Breakdown & Failure Modes
    4. Comparative & Segmented Inquiries
    5. Workarounds & Unmet Needs
    6. Unknown

    Return the result as a JSON object with a single key "intent" containing the exact category name.

    Query:
    "{query}"
    """
    try:
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": "You are an AI assistant that classifies user queries. Output only JSON.",
                },
                {
                    "role": "user",
                    "content": prompt,
                }
            ],
            model="openai/gpt-oss-120b",
            response_format={"type": "json_object"},
            temperature=0.0
        )
        response_text = chat_completion.choices[0].message.content
        return json.loads(response_text).get("intent", "Unknown")
    except Exception as e:
        print(f"Error during intent inference: {e}")
        return "Unknown"

import json

def extract_features(text: str) -> dict:
    """
    Extracts structured features from a raw feedback text using Groq.
    Expects JSON output with:
    - target_intent: What the user was looking for.
    - search_strategy: How they tried to find it.
    - emotion: User sentiment/frustration level.
    """
    client = get_groq_client()
    prompt = f"""
    Analyze the following user feedback about a photo retrieval experience.
    Extract the following information and format it as a JSON object:
    - remembered_attributes: A list of strings identifying what the user recalled. Choose from: ["Event", "People", "Approx time", "Location", "Object"]. (Can be empty).
    - forgotten_attributes: A list of strings identifying what the user explicitly forgot. Choose from: ["Exact date", "Exact location", "Person name", "Event name"]. (Can be empty).

    Feedback text:
    "{text}"
    """
    try:
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": "You are a helpful assistant that outputs only JSON.",
                },
                {
                    "role": "user",
                    "content": prompt,
                }
            ],
            model="openai/gpt-oss-120b",
            response_format={"type": "json_object"},
            temperature=0.0
        )
        response_text = chat_completion.choices[0].message.content
        return json.loads(response_text)
    except Exception as e:
        print(f"Error during feature extraction: {e}")
        return {
            "remembered_attributes": [],
            "forgotten_attributes": []
        }

def synthesize_insights(query: str, retrieved_context: List[dict]) -> dict:
    """
    Analyzes the retrieved context to produce structured qualitative insights,
    categorized retrieval problems, and direct supporting quotes using Groq.
    """
    client = get_groq_client()
    
    context_str = ""
    for r in retrieved_context:
        context_str += f"Thread ID: {r.get('id')}\n"
        context_str += f"Text: {r.get('raw_text')}\n"
        context_str += "---\n"
        
    prompt = f"""
    You are an expert product analyst. Analyze the following user feedback threads retrieved for the query: "{query}".
    
    Your goal is to deeply analyze the evidence, compare different retrieval problems, and identify actionable product opportunity areas.
    Based ONLY on the provided threads, generate a structured JSON output with THREE keys:
    1. "retrieval_problems": A list of objects. Each object must have a "title" and "description". Limit to the top 3-4 problems.
    2. "opportunity_areas": A list of objects. For EVERY retrieval problem, provide a corresponding opportunity area object with a "title" and "description". Do not generate opportunities for minor or edge-case problems.
    3. "evidence": A list of objects, each containing a direct "quote" extracted EXACTLY from the text, and the "source_thread_id" (integer) it came from.
    
    Feedback Threads:
    {context_str}
    """
    
    try:
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": "You are a product analyst that outputs only JSON.",
                },
                {
                    "role": "user",
                    "content": prompt,
                }
            ],
            model="openai/gpt-oss-120b",
            response_format={"type": "json_object"},
            temperature=0.0
        )
        response_text = chat_completion.choices[0].message.content
        return json.loads(response_text)
    except Exception as e:
        print(f"Error during synthesis: {e}")
        return {
            "insights": [],
            "evidence": []
        }
