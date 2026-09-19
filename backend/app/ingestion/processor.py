import logging
from app.database import SessionLocal
from app.models import FeedbackRecord
from app.services.llm_extractor import extract_metadata
from app.services.vectorizer import generate_embedding

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def process_unprocessed_records(batch_size: int = 50):
    """
    Fetches raw records from the database that haven't been processed yet,
    runs them through the LLM metadata extractor and Vectorizer,
    and saves the structured data and embeddings back to the database.
    """
    logger.info("Starting processing job...")
    db = SessionLocal()
    
    try:
        # Fetch unprocessed records
        records = db.query(FeedbackRecord).filter(FeedbackRecord.is_processed == 0).limit(batch_size).all()
        
        if not records:
            logger.info("No unprocessed records found. Processing complete.")
            return

        logger.info(f"Processing {len(records)} records...")
        
        processed_count = 0
        for record in records:
            try:
                # 1. LLM Extraction
                metadata = extract_metadata(record.raw_text)
                
                import json
                # 2. Update metadata fields
                record.remembered_attributes = json.dumps(metadata.get("remembered_attributes") or [])
                record.forgotten_attributes = json.dumps(metadata.get("forgotten_attributes") or [])
                
                # 3. Vector Embedding
                # We embed a combination of the raw text and the structured metadata for better semantic search
                combined_text = f"Text: {record.raw_text} | Remembered: {record.remembered_attributes} | Forgotten: {record.forgotten_attributes}"
                embedding = generate_embedding(combined_text)
                
                if embedding:
                    record.embedding = embedding
                
                # 4. Mark as processed
                record.is_processed = 1
                processed_count += 1
                
                # Commit every 10 records to avoid long locks and save progress
                if processed_count % 10 == 0:
                    db.commit()
                    logger.info(f"Committed {processed_count} records so far...")
                    
            except Exception as e:
                logger.error(f"Failed to process record {record.id}: {e}")
                
        # Final commit for remaining records
        db.commit()
        logger.info(f"Successfully processed and embedded {processed_count} records.")
        
    except Exception as e:
        logger.error(f"Database error during processing: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    # Test script will run process_unprocessed_records
    pass
