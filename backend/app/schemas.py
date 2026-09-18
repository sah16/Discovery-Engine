from pydantic import BaseModel
from typing import List, Optional, Dict

class QueryRequest(BaseModel):
    query: str

class RetrievedThread(BaseModel):
    id: int
    source: Optional[str] = None
    raw_text: str
    target_intent: Optional[str] = None
    search_strategy: Optional[str] = None
    emotion: Optional[str] = None
    similarity_score: Optional[float] = None

class QuantitativeMetrics(BaseModel):
    target_intents: Dict[str, float]
    search_strategies: Dict[str, float]
    emotions: Dict[str, float]

class SynthesizedInsight(BaseModel):
    title: str
    description: str

class EvidenceQuote(BaseModel):
    quote: str
    source_thread_id: Optional[int] = None

class QueryResponse(BaseModel):
    intent: str
    results: List[RetrievedThread]
    metrics: QuantitativeMetrics
    retrieval_problems: Optional[List[SynthesizedInsight]] = None
    opportunity_areas: Optional[List[SynthesizedInsight]] = None
    insights: Optional[List[SynthesizedInsight]] = None
    evidence: List[EvidenceQuote]
