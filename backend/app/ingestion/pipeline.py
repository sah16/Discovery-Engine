import logging
from app.database import SessionLocal
from app.models import FeedbackRecord
from .scrapers import reddit, playstore, appstore, support_forums, youtube

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def run_ingestion_pipeline():
    """
    Runs all scrapers and inserts new feedback records into the database.
    """
    logger.info("Starting data ingestion pipeline...")
    
    all_results = []
    
    logger.info("Scraping Reddit...")
    all_results.extend(reddit.scrape())
    
    logger.info("Scraping Google Play Store...")
    all_results.extend(playstore.scrape())
    
    logger.info("Scraping App Store...")
    all_results.extend(appstore.scrape())
    
    logger.info("Scraping Google Support Forums...")
    all_results.extend(support_forums.scrape())
    
    logger.info("Scraping YouTube Comments...")
    all_results.extend(youtube.scrape())
    
    logger.info(f"Total records fetched: {len(all_results)}")
    
    # Save to database
    db = SessionLocal()
    try:
        new_records = 0
        for item in all_results:
            # Basic deduplication strategy based on raw_text
            exists = db.query(FeedbackRecord).filter(FeedbackRecord.raw_text == item['raw_text']).first()
            if not exists:
                record = FeedbackRecord(
                    source=item['source'],
                    raw_text=item['raw_text']
                )
                db.add(record)
                new_records += 1
        
        db.commit()
        logger.info(f"Successfully inserted {new_records} new records into the database.")
    except Exception as e:
        db.rollback()
        logger.error(f"Database error during ingestion: {e}")
    finally:
        db.close()
        
    logger.info("Ingestion pipeline finished.")
