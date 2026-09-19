from typing import List, Dict, Any
from collections import Counter

def quantify_metrics(results: List[Dict[str, Any]]) -> Dict[str, Dict[str, float]]:
    """
    Calculates the proportional distribution of target intents, search strategies, 
    and emotions from the retrieved RAG results.
    """
    total = len(results)
    if total == 0:
        return {
            "remembered_attributes": {},
            "forgotten_attributes": {}
        }
        
    remembered_attributes = Counter()
    forgotten_attributes = Counter()
    
    for r in results:
        for attr in r.get("remembered_attributes", []):
            remembered_attributes[attr] += 1
            
        for attr in r.get("forgotten_attributes", []):
            forgotten_attributes[attr] += 1
        
    def to_percentages(counter: Counter) -> Dict[str, float]:
        return {k: round((v / total) * 100, 2) for k, v in counter.items() if str(k).lower() != "unknown"}
        
    return {
        "remembered_attributes": to_percentages(remembered_attributes),
        "forgotten_attributes": to_percentages(forgotten_attributes)
    }
