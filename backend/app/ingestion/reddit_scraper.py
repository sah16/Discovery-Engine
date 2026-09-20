import os
import logging
from typing import List, Dict, Any
from apify_client import ApifyClient

from app.config import settings

logger = logging.getLogger(__name__)

def fetch_reddit_threads(limit: int = 50) -> List[Dict[str, Any]]:
    """
    Fetches threads from specific subreddits related to photo retrieval using Apify.
    """
    api_token = settings.APIFY_API_TOKEN
    
    if not api_token or api_token == "your_apify_api_token":
        logger.warning("Apify API token not configured. Reddit scraping will be disabled.")
        return []

    client = ApifyClient(api_token)
    
    # We use automation-lab/reddit-scraper, a robust and free community scraper on Apify
    actor_id = "automation-lab/reddit-scraper"
    
    subreddits = ["googlephotos", "ApplePhotos", "ios", "Android", "Genealogy", "AskReddit", "DataHoarder", "photography"]
    keywords = ["find photo", "search picture", "can't find", "remember photo", "searching for a photo", "keywords old photos", "how to find old photos", "searching historical photos"]
    
    results = []
    
    for sub in subreddits:
        try:
            for keyword in keywords:
                # Prepare the Actor input
                run_input = {
                    "searches": [keyword],
                    "subreddits": [sub],
                    "sort": "new",
                    "maxItems": limit // len(keywords) or 10,
                    "skipComments": False
                }
                
                # Run the Actor and wait for it to finish
                run = client.actor(actor_id).call(run_input=run_input)
                
                # Fetch and parse Actor results from the run's dataset
                for item in client.dataset(run["defaultDatasetId"]).iterate_items():
                    # Extract the main post body
                    post_title = item.get('title', '')
                    post_body = item.get('selftext', '') or item.get('text', '')
                    full_post = f"{post_title}\n{post_body}".strip()
                    if full_post:
                        results.append({
                            "source": f"reddit_thread/r/{sub}",
                            "raw_text": full_post,
                            "url": item.get('url'),
                            "date": item.get('createdAt')
                        })

                    # Extract comments
                    comments = item.get('comments', [])
                    for comment in comments:
                        comment_text = comment.get('text', '')
                        # Only keep comments that are substantial enough to be relevant
                        if comment_text and len(comment_text) > 30:
                            results.append({
                                "source": f"reddit_comment/r/{sub}",
                                "raw_text": comment_text,
                                "url": comment.get('url', item.get('url')),
                                "date": comment.get('createdAt')
                            })
        except Exception as e:
            logger.error(f"Error scraping Reddit (r/{sub}) via Apify: {str(e)}")
            
    return results
