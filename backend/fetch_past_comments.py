import os
from apify_client import ApifyClient
from dotenv import load_dotenv

load_dotenv()

def fetch_past():
    api_token = os.getenv("APIFY_API_TOKEN")
    client = ApifyClient(api_token)
    
    actor_id = "automation-lab/reddit-scraper"
    
    # Get the latest runs of this actor
    runs = client.actor(actor_id).runs().list(desc=True, limit=5).items
    
    print(f"Found {len(runs)} recent runs.")
    if not runs:
        return
        
    last_run = runs[0]
    dataset_id = last_run['defaultDatasetId']
    print(f"Using dataset from last run: {dataset_id}")
    
    # Fetch items from dataset
    dataset_items = client.dataset(dataset_id).iterate_items()
    
    keywords = ["search", "find", "photo", "remember"]
    relevant_comments = []
    
    for item in dataset_items:
        comments = item.get('comments', [])
        for comment in comments:
            text = comment.get('text', '')
            if text and any(k in text.lower() for k in keywords):
                relevant_comments.append(text)
                
    print(f"Found {len(relevant_comments)} relevant comments from the previous run without spending credits!")
    if relevant_comments:
        print(f"Sample: {relevant_comments[0][:100]}")

if __name__ == "__main__":
    fetch_past()
