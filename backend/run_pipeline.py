from dotenv import load_dotenv
load_dotenv()
from app.ingestion.pipeline import run_ingestion_pipeline

if __name__ == "__main__":
    run_ingestion_pipeline()
