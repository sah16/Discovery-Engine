import logging
from sentence_transformers import SentenceTransformer
from app.config import settings

logger = logging.getLogger(__name__)

_model = None

def get_model():
    global _model
    if _model is None:
        try:
            model_name = settings.EMBEDDING_MODEL_NAME if hasattr(settings, 'EMBEDDING_MODEL_NAME') else 'all-MiniLM-L6-v2'
            logger.info(f"Loading embedding model lazily: {model_name}")
            _model = SentenceTransformer(model_name)
        except Exception as e:
            logger.error(f"Failed to load sentence-transformers model: {e}")
    return _model

def generate_embedding(text: str) -> list:
    """
    Generates a dense vector embedding for the given text.
    Returns a list of floats (size 384 for all-MiniLM-L6-v2).
    """
    model = get_model()
    if not model or not text:
        return []
        
    try:
        # Generate the embedding
        embedding = model.encode(text)
        # Convert numpy array to list for SQLAlchemy pgvector compatibility
        return embedding.tolist()
    except Exception as e:
        logger.error(f"Error generating embedding: {e}")
        return []
