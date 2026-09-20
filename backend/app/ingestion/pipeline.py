import logging
from app.ingestion.reddit_scraper import fetch_reddit_threads
from app.ingestion.app_store_scraper import fetch_app_reviews
from app.ingestion.hn_scraper import fetch_hn_threads
from app.ingestion.cleaner import normalize_text
from app.database import SessionLocal
from app.models import FeedbackRecord

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def run_ingestion_pipeline():
    """
    Orchestrates the ingestion process: Scrape -> Clean -> Store
    """
    logger.info("Starting data ingestion pipeline...")
    
    raw_data = []
    
    # 1. Scrape Reddit - DISABLED TO PROTECT APIFY CREDITS
    try:
        logger.info("Reddit scraping is currently disabled to save credits.")
        # reddit_data = fetch_reddit_threads(limit=20) # Using a small limit to save credits
        reddit_data = []
        raw_data.extend(reddit_data)
    except Exception as e:
        logger.error(f"Failed to fetch Reddit data: {e}")
        
    # 2. Scrape App Store
    try:
        logger.info("Fetching App Store reviews...")
        app_data = fetch_app_reviews(count=50)
        raw_data.extend(app_data)
    except Exception as e:
        logger.error(f"Failed to fetch App Store data: {e}")

    # 3. Scrape Hacker News
    try:
        logger.info("Fetching Hacker News discussions...")
        hn_data = fetch_hn_threads(limit=40)
        raw_data.extend(hn_data)
    except Exception as e:
        logger.error(f"Failed to fetch Hacker News data: {e}")
    
    logger.info(f"Total records fetched: {len(raw_data)}")
    
    # Save to database
    db = SessionLocal()
    try:
        records = []
        for item in raw_data:
            records.append(FeedbackRecord(
                source=item['source'],
                raw_text=item['raw_text']
            ))
        db.bulk_save_objects(records)
        new_records = len(records)
        
        db.commit()
        logger.info(f"Successfully inserted {new_records} new records into the database.")
    except Exception as e:
        db.rollback()
        logger.error(f"Database error during ingestion: {e}")
    finally:
        db.close()
        
    logger.info("Ingestion pipeline finished.")
