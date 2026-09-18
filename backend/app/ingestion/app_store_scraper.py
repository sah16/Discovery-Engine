import logging
from typing import List, Dict, Any
from google_play_scraper import Sort, reviews
from app_store_scraper import AppStore

logger = logging.getLogger(__name__)

def fetch_app_reviews(count: int = 100) -> List[Dict[str, Any]]:
    """
    Fetches negative reviews for specific photo apps from Google Play and iOS App Store.
    """
    play_apps = {
        "com.google.android.apps.photos": "Google Photos"
    }
    
    ios_apps = [
        {"app_name": "google-photos", "app_id": "962194608"}
    ]
    
    results = []
    keywords = ["search", "find", "locate", "lost", "remember", "can't find", "hard to find"]
    
    # Google Play Store
    for app_id, app_name in play_apps.items():
        try:
            rvs, _ = reviews(
                app_id,
                lang='en',
                country='us',
                sort=Sort.NEWEST,
                count=count
            )
            
            for review in rvs:
                score = review.get('score', 5)
                content = review.get('content', '').lower()
                
                if any(k in content for k in keywords):
                    results.append({
                        "source": f"play_store/{app_name}",
                        "raw_text": review.get('content'),
                        "rating": score,
                        "date": review.get('at')
                    })
        except Exception as e:
            logger.error(f"Error scraping Google Play ({app_name}): {str(e)}")
            
    # iOS App Store
    for app in ios_apps:
        try:
            ios_app = AppStore(country='us', app_name=app["app_name"], app_id=app["app_id"])
            ios_app.review(how_many=count)
            
            for review in ios_app.reviews:
                score = review.get('rating', 5)
                content = review.get('review', '').lower()
                
                if any(k in content for k in keywords):
                    results.append({
                        "source": f"app_store/{app['app_name']}",
                        "raw_text": review.get('review'),
                        "rating": score,
                        "date": review.get('date')
                    })
        except Exception as e:
            logger.error(f"Error scraping iOS App Store ({app['app_name']}): {str(e)}")
            
    return results
