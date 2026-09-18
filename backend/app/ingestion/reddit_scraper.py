import os
import praw
import logging
from typing import List, Dict, Any

logger = logging.getLogger(__name__)

def get_reddit_client() -> praw.Reddit:
    client_id = os.getenv("REDDIT_CLIENT_ID")
    client_secret = os.getenv("REDDIT_CLIENT_SECRET")
    user_agent = os.getenv("REDDIT_USER_AGENT", "python:discovery_engine:v1 (by /u/developer)")

    if not all([client_id, client_secret]) or client_id == "your_reddit_client_id":
        logger.warning("Reddit API credentials not configured. Reddit scraping will be disabled.")
        return None


    return praw.Reddit(
        client_id=client_id,
        client_secret=client_secret,
        user_agent=user_agent
    )

def fetch_reddit_threads(limit: int = 50) -> List[Dict[str, Any]]:
    """
    Fetches threads from specific subreddits related to photo retrieval.
    """
    reddit = get_reddit_client()
    if not reddit:
        return []

    subreddits = ["googlephotos", "ApplePhotos", "ios", "Android"]
    keywords = ["find photo", "search picture", "can't find", "remember photo", "searching for a photo"]
    
    results = []
    
    for sub in subreddits:
        try:
            subreddit = reddit.subreddit(sub)
            for keyword in keywords:
                # Search within the subreddit
                for submission in subreddit.search(keyword, limit=limit, sort="new"):
                    results.append({
                        "source": f"reddit/r/{sub}",
                        "raw_text": f"Title: {submission.title}\n\n{submission.selftext}",
                        "url": submission.url,
                        "created_utc": submission.created_utc
                    })
        except Exception as e:
            logger.error(f"Error scraping Reddit (r/{sub}): {str(e)}")
            
    return results
