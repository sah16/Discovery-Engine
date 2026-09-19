from fastapi import FastAPI, BackgroundTasks, Depends
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.database import engine, Base
from app.config import settings
from app.ingestion.scheduler import start_scheduler, stop_scheduler
from app.ingestion.pipeline import run_ingestion_pipeline
from app.ingestion.processor import process_unprocessed_records
import os
import app.models
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas import QueryRequest, QueryResponse
from app.services.query_engine import perform_rag_query

# Create database tables
Base.metadata.create_all(bind=engine)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    start_scheduler()
    yield
    # Shutdown
    stop_scheduler()

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="API for the AI-Powered Discovery Engine",
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS for frontend access
frontend_url = os.getenv("FRONTEND_URL")
origins = [frontend_url] if frontend_url else ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    return {"status": "ok", "message": "Discovery Engine API is running"}

@app.post("/api/ingest")
def trigger_ingestion(background_tasks: BackgroundTasks):
    """Manually trigger the data ingestion pipeline."""
    background_tasks.add_task(run_ingestion_pipeline)
    return {"status": "ok", "message": "Data ingestion started in the background"}

@app.post("/api/process")
def trigger_processing(background_tasks: BackgroundTasks):
    """Manually trigger the data processing and vectorization pipeline."""
    background_tasks.add_task(process_unprocessed_records)
    return {"status": "ok", "message": "Data processing started in the background"}

@app.post("/api/query", response_model=QueryResponse)
def query_rag_engine(request: QueryRequest, db: Session = Depends(get_db)):
    """
    Infers intent and retrieves relevant feedback threads using RAG.
    """
    result = perform_rag_query(request.query, db, limit=10)
    return result
