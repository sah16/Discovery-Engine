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
    # 1. Infer the user's intent
    intent = infer_intent(query)
    
    # 2. Get the vector embedding of the query
    query_vector = get_embedding(query)
    
    # 3. Perform similarity search in Postgres with pgvector
    # We order by cosine distance (closest first). 
    results = (
        db.query(FeedbackRecord)
        .filter(FeedbackRecord.embedding.is_not(None))
        .order_by(FeedbackRecord.embedding.cosine_distance(query_vector))
        .limit(limit)
        .all()
    )
    
    formatted_results = []
    for record in results:
        formatted_results.append({
            "id": record.id,
            "source": record.source,
            "raw_text": record.raw_text,
            "target_intent": record.target_intent,
            "search_strategy": record.search_strategy,
            "emotion": record.emotion,
        })
        
    metrics = quantify_metrics(formatted_results)
    synthesis = synthesize_insights(query, formatted_results)
        
    return {
        "intent": intent,
        "results": formatted_results,
        "metrics": metrics,
        "retrieval_problems": synthesis.get("retrieval_problems", None),
        "opportunity_areas": synthesis.get("opportunity_areas", None),
        "insights": synthesis.get("insights", None),
        "evidence": synthesis.get("evidence", [])
    }
