import os
from sentence_transformers import SentenceTransformer
from app.config import settings

def download_model():
    model_name = settings.EMBEDDING_MODEL_NAME
    print(f"Downloading and caching embedding model: {model_name}...")
    # Loading it automatically downloads and caches it in ~/.cache/huggingface
    model = SentenceTransformer(model_name)
    print("Model downloaded successfully!")

if __name__ == "__main__":
    download_model()
