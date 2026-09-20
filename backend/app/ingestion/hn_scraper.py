import requests
import logging
from typing import List, Dict, Any

logger = logging.getLogger(__name__)

def fetch_hn_threads(limit: int = 50) -> List[Dict[str, Any]]:
    """
    Fetches comments and threads from Hacker News related to photo retrieval and management.
    Uses the Algolia HN Search API (free, unauthenticated).
    """
    results = []
    
    # We use specific queries that usually yield discussions about photo search issues
    queries = [
        "google photos search",
        "apple photos search",
        "find old photos",
        "photo management search",
        "finding ancestry photos",
        "searching historical photos",
        "old photo keywords"
    ]
    
    base_url = "https://hn.algolia.com/api/v1/search"
    
    for query in queries:
        try:
            params = {
                "query": query,
                "tags": "comment",  # We want the actual discussions/comments
                "hitsPerPage": limit // len(queries) or 10
            }
            
            response = requests.get(base_url, params=params, timeout=10)
            response.raise_for_status()
            data = response.json()
            
            for hit in data.get("hits", []):
                comment_text = hit.get("comment_text")
                if not comment_text:
                    continue
                    
                # We do a light secondary filter to ensure it's somewhat relevant
                content_lower = comment_text.lower()
                if "photo" in content_lower and ("search" in content_lower or "find" in content_lower):
                    results.append({
                        "source": "hacker_news",
                        "raw_text": comment_text,
                        "url": f"https://news.ycombinator.com/item?id={hit.get('objectID')}",
                        "date": hit.get("created_at")
                    })
                    
        except requests.exceptions.RequestException as e:
            logger.error(f"Error scraping Hacker News for query '{query}': {str(e)}")
            
    return results
