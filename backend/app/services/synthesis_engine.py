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
            "target_intents": {},
            "search_strategies": {},
            "emotions": {}
        }
        
    target_intents = Counter()
    search_strategies = Counter()
    emotions = Counter()
    
    for r in results:
        t_intent = r.get("target_intent") or "Unknown"
        s_strategy = r.get("search_strategy") or "Unknown"
        emotion = r.get("emotion") or "Unknown"
        
        target_intents[t_intent] += 1
        search_strategies[s_strategy] += 1
        emotions[emotion] += 1
        
    def to_percentages(counter: Counter) -> Dict[str, float]:
        return {k: round((v / total) * 100, 2) for k, v in counter.items()}
        
    return {
        "target_intents": to_percentages(target_intents),
        "search_strategies": to_percentages(search_strategies),
        "emotions": to_percentages(emotions)
    }
