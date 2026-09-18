from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.sql import func
from pgvector.sqlalchemy import Vector
from app.database import Base

class FeedbackRecord(Base):
    __tablename__ = "feedback_records"

    id = Column(Integer, primary_key=True, index=True)
    source = Column(String(100), index=True)
    raw_text = Column(Text, nullable=False)
    target_intent = Column(String(200), nullable=True)
    search_strategy = Column(String(200), nullable=True)
    emotion = Column(String(50), nullable=True)
    embedding = Column(Vector(384), nullable=True)  # all-MiniLM-L6-v2 has 384 dims
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class ProcessedInsight(Base):
    __tablename__ = "processed_insights"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)
    category = Column(String(100), index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
