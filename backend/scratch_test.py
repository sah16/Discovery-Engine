from app_store_scraper import AppStore
import json

try:
    g_photos = AppStore(country='us', app_name='google-photos', app_id='962194608')
    g_photos.review(how_many=5)
    
    print(json.dumps([r for r in g_photos.reviews], default=str))
except Exception as e:
    print("Error:", str(e))
