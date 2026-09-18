from app_store_scraper import AppStore
from typing import List

def scrape() -> List[dict]:
    results = []
    try:
        photos_app = AppStore(country="us", app_name="google-photos", app_id="962194608")
        photos_app.review(how_many=100)
        
        keywords = ["search", "find", "remember", "lost", "date", "scroll"]
        for review in photos_app.reviews:
            content = review.get('review', '')
            if review.get('rating', 5) <= 3 and any(k in content.lower() for k in keywords):
                results.append({"source": "Apple App Store", "raw_text": content})
    except Exception as e:
        print(f"Error scraping App Store: {e}")
        
    return results
