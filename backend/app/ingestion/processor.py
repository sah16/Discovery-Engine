import logging
from app.database import SessionLocal
from app.models import FeedbackRecord
from app.services.llm_client import extract_features
from app.services.embedding_client import get_embedding

logger = logging.getLogger(__name__)

def process_unembedded_records(batch_size: int = 50):
    """
    Fetches raw records that have not been processed yet (target_intent is None).
    Extracts features using LLM, generates embeddings, and saves back to the database.
    """
    logger.info("Starting processing pipeline for unembedded records...")
    db = SessionLocal()
    
    try:
        # Find records that need processing
        records = db.query(FeedbackRecord).filter(FeedbackRecord.embedding == None).limit(batch_size).all()
        
        if not records:
            logger.info("No unembedded records found to process.")
            return

        logger.info(f"Processing {len(records)} records...")
        
        processed_count = 0
        for record in records:
            raw_text = record.raw_text
            
            # 1. Extract features using Groq
            features = extract_features(raw_text)
            record.target_intent = features.get("target_intent")
            record.search_strategy = features.get("search_strategy")
            record.emotion = features.get("emotion")
            
            # 2. Generate embedding for the raw text
            # We can also combine text with extracted features for better retrieval
            text_to_embed = f"{raw_text} (Target: {record.target_intent}, Strategy: {record.search_strategy}, Emotion: {record.emotion})"
            try:
                embedding = get_embedding(text_to_embed)
                record.embedding = embedding
            except Exception as e:
                logger.error(f"Failed to generate embedding for record {record.id}: {e}")
                # We can choose to skip saving if embedding fails, but since this is 
                # a pipeline, we might just leave embedding as None and it will retry next time.
                continue

            processed_count += 1
            
        db.commit()
        logger.info(f"Successfully processed {processed_count} records.")
        
    except Exception as e:
        db.rollback()
        logger.error(f"Error during processing pipeline: {e}")
    finally:
        db.close()
        logger.info("Processing pipeline finished.")
