import asyncio
from app.ingestion.app_store_scraper import fetch_app_reviews
from app.ingestion.reddit_scraper import fetch_reddit_threads
from app.ingestion.cleaner import normalize_text
import json

def test_ingestion():
    print("Testing App Store Scraper...")
    try:
        app_reviews = fetch_app_reviews(count=1000)
        print(f"Found {len(app_reviews)} matching app reviews.")
        for r in app_reviews[:2]:
            print(f"- {r['source']}: {r['rating']} stars | {normalize_text(r['raw_text'])}")
    except Exception as e:
        print("Error with app store scraper:", str(e))
        
    print("\nTesting Reddit Scraper...")
    try:
        reddit_threads = fetch_reddit_threads(limit=10)
        if reddit_threads:
            print(f"Found {len(reddit_threads)} matching reddit threads.")
        else:
            print("Reddit returned empty (expected if credentials are missing).")
    except Exception as e:
        print("Error with reddit scraper:", str(e))

if __name__ == "__main__":
    test_ingestion()
