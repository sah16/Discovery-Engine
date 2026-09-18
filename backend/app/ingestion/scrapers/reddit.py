import praw
from typing import List
from app.config import settings

def scrape() -> List[dict]:
    results = []
    if not all([settings.REDDIT_CLIENT_ID, settings.REDDIT_CLIENT_SECRET, settings.REDDIT_USER_AGENT]):
        print("Reddit credentials not fully configured. Skipping Reddit scrape.")
        return results
        
    try:
        reddit = praw.Reddit(
            client_id=settings.REDDIT_CLIENT_ID,
            client_secret=settings.REDDIT_CLIENT_SECRET,
            user_agent=settings.REDDIT_USER_AGENT
        )
        
        # Subreddits to scrape: primary focus and secondary focus
        target_subreddits = ["googlephotos", "GooglePixel", "Android"]
        # Comparison group
        comparison_subreddits = ["ApplePhotos"]
        
        query = "find OR search OR remember OR missing"
        
        # Helper function to scrape a specific subreddit
        def scrape_sub(sub_name, is_comparison=False):
            subreddit = reddit.subreddit(sub_name)
            for submission in subreddit.search(query, limit=30):
                text = f"Title: {submission.title}\n{submission.selftext}"
                source_tag = f"Reddit (r/{sub_name} - {'Comparison' if is_comparison else 'Primary'})"
                
                results.append({"source": source_tag, "raw_text": text})
                
                # Fetch top comments
                submission.comments.replace_more(limit=0)
                for comment in submission.comments[:3]:
                    results.append({"source": source_tag, "raw_text": comment.body})
                    
        for sub in target_subreddits:
            scrape_sub(sub, is_comparison=False)
            
        for sub in comparison_subreddits:
            scrape_sub(sub, is_comparison=True)

    except Exception as e:
        print(f"Error scraping Reddit: {e}")
        
    return results
