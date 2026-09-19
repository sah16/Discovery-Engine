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
    remembered_attributes: Optional[List[str]] = None
    forgotten_attributes: Optional[List[str]] = None
    similarity_score: Optional[float] = None

class QuantitativeMetrics(BaseModel):
    remembered_attributes: Dict[str, float]
    forgotten_attributes: Dict[str, float]

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
    is_out_of_scope: Optional[bool] = False
    retrieval_problems: Optional[List[SynthesizedInsight]] = None
    opportunity_areas: Optional[List[SynthesizedInsight]] = None
    insights: Optional[List[SynthesizedInsight]] = None
    evidence: List[EvidenceQuote]
