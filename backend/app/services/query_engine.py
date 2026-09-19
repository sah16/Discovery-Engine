from sqlalchemy.orm import Session
from app.models import FeedbackRecord
from app.services.llm_client import infer_intent, synthesize_insights
from app.services.synthesis_engine import quantify_metrics
from app.services.embedding_client import get_embedding
from typing import Dict, Any

def perform_rag_query(query: str, db: Session, limit: int = 10) -> Dict[str, Any]:
    """
    Performs Intent Inference and RAG retrieval for a natural language query.
    """
    print(f"\n[RAG Pipeline] Starting query analysis for: '{query}'")
    
    # 1. Infer the user's intent
    print("[RAG Pipeline] Step 1: Inferring user intent via LLM...")
    intent = infer_intent(query)
    print(f"[RAG Pipeline] -> Intent inferred: {intent}")
    
    # 2. Get the vector embedding of the query
    print("[RAG Pipeline] Step 2: Generating vector embedding for query...")
    query_vector = get_embedding(query)
    
    # 3. Perform similarity search in Postgres with pgvector
    print(f"[RAG Pipeline] Step 3: Searching pgvector database for top {limit} closest threads...")
    # We order by cosine distance (closest first). 
    results = (
        db.query(FeedbackRecord)
        .filter(FeedbackRecord.embedding.is_not(None))
        .order_by(FeedbackRecord.embedding.cosine_distance(query_vector))
        .limit(limit)
        .all()
    )
    print(f"[RAG Pipeline] -> Retrieved {len(results)} relevant threads.")
    
    formatted_results = []
    for record in results:
        import json
        
        remembered = []
        if record.remembered_attributes:
            try: remembered = json.loads(record.remembered_attributes)
            except: pass
            
        forgotten = []
        if record.forgotten_attributes:
            try: forgotten = json.loads(record.forgotten_attributes)
            except: pass
            
        formatted_results.append({
            "id": record.id,
            "source": record.source,
            "raw_text": record.raw_text,
            "remembered_attributes": remembered,
            "forgotten_attributes": forgotten,
        })
        
    print("[RAG Pipeline] Step 4: Quantifying retrieved metrics...")
    metrics = quantify_metrics(formatted_results)
    
    print("[RAG Pipeline] Step 5: Synthesizing qualitative insights via LLM...")
    synthesis = synthesize_insights(query, formatted_results)
    
    print("[RAG Pipeline] Pipeline complete! Returning response to frontend.\n")
        
    return {
        "intent": intent,
        "results": formatted_results,
        "metrics": metrics,
        "retrieval_problems": synthesis.get("retrieval_problems", None),
        "opportunity_areas": synthesis.get("opportunity_areas", None),
        "insights": synthesis.get("insights", None),
        "evidence": synthesis.get("evidence", [])
    }
