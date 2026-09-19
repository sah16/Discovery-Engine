import sys
import os

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from app.database import SessionLocal, engine
from app.models import FeedbackRecord
import app.models

def reset():
    print("Wiping feedback_records table...")
    app.models.Base.metadata.drop_all(bind=engine)
    app.models.Base.metadata.create_all(bind=engine)
    print("Done! Database is clean.")

if __name__ == "__main__":
    reset()
