from sentence_transformers import SentenceTransformer
from app.config import settings
from typing import List

# Load model lazily or at startup
# Using BAAI/bge-large-en-v1.5 as per architecture
_model = None

def init_model() -> None:
    """
    Preloads the model into memory. Call this at application startup.
    """
    global _model
    if _model is None:
        print(f"Loading embedding model: {settings.EMBEDDING_MODEL_NAME}...")
        _model = SentenceTransformer(settings.EMBEDDING_MODEL_NAME)

def get_embedding_model() -> SentenceTransformer:
    global _model
    if _model is None:
        init_model()
    return _model

def get_embedding(text: str) -> List[float]:
    """
    Returns the vector embedding for a given text.
    """
    model = get_embedding_model()
    # bge models expect query to be prefixed slightly if used for retrieval, 
    # but simple encoding is fine for basic usage.
    embedding = model.encode(text, normalize_embeddings=True)
    return embedding.tolist()
