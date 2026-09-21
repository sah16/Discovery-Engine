from sqlalchemy.orm import Session
from app.models import FeedbackRecord
from app.services.llm_client import infer_intent, synthesize_insights
from app.services.synthesis_engine import quantify_metrics
from app.services.embedding_client import get_embedding
from typing import Dict, Any

import asyncio

async def perform_rag_query(query: str, db: Session, limit: int = 10) -> Dict[str, Any]:
    """
    Performs Intent Inference and RAG retrieval for a natural language query.
    """
    print(f"\n[RAG Pipeline] Starting query analysis for: '{query}'")
    
    print("[RAG Pipeline] Steps 1 & 2: Inferring intent (LLM) and generating embedding (CPU) in parallel...")
    # Run LLM intent inference and CPU-bound embedding generation in parallel!
    loop = asyncio.get_event_loop()
    intent_task = asyncio.create_task(infer_intent(query))
    embedding_task = loop.run_in_executor(None, get_embedding, query)
    
    intent, query_vector = await asyncio.gather(intent_task, embedding_task)
    print(f"[RAG Pipeline] -> Intent inferred: {intent}")
    print("[RAG Pipeline] -> Embedding generated.")
    
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
            try: 
                parsed = json.loads(record.remembered_attributes)
                if isinstance(parsed, list):
                    remembered = parsed
            except: pass
            
        forgotten = []
        if record.forgotten_attributes:
            try: 
                parsed = json.loads(record.forgotten_attributes)
                if isinstance(parsed, list):
                    forgotten = parsed
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
    synthesis = await synthesize_insights(query, formatted_results, metrics)
    
    print("[RAG Pipeline] Pipeline complete! Returning response to frontend.\n")
        
    evidence_clean = []
    for item in synthesis.get("evidence", []):
        if isinstance(item, str):
            evidence_clean.append({"quote": item, "source_thread_id": None})
        elif isinstance(item, dict):
            evidence_clean.append({
                "quote": str(item.get("quote", "")),
                "source_thread_id": item.get("source_thread_id", None)
            })

    return {
        "intent": intent,
        "results": formatted_results,
        "metrics": metrics,
        "is_out_of_scope": synthesis.get("is_out_of_scope", False),
        "executive_summary": synthesis.get("executive_summary", None),
        "retrieval_problems": synthesis.get("retrieval_problems", None),
        "opportunity_areas": synthesis.get("opportunity_areas", None),
        "insights": synthesis.get("insights", None),
        "evidence": evidence_clean
    }
