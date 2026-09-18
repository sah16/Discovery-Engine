from google_play_scraper import Sort, reviews
from typing import List

def scrape() -> List[dict]:
    results = []
    try:
        # App ID for Google Photos
        app_id = "com.google.android.apps.photos"
        rvs, _ = reviews(
            app_id,
            lang='en',
            country='us',
            sort=Sort.NEWEST,
            count=100
        )
        
        keywords = ["search", "find", "remember", "lost", "date", "scroll"]
        for review in rvs:
            content = review.get('content', '')
            # Filter low rating reviews that contain our keywords
            if review.get('score', 5) <= 3 and any(k in content.lower() for k in keywords):
                results.append({"source": "Google Play Store", "raw_text": content})
    except Exception as e:
        print(f"Error scraping Google Play Store: {e}")
        
    return results
