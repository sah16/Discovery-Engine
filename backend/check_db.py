from app.database import SessionLocal
from app.models import FeedbackRecord
from sqlalchemy import text

def check_db():
    db = SessionLocal()
    try:
        count = db.query(FeedbackRecord).filter(FeedbackRecord.source.like('reddit/r/%')).count()
        print(f"Found {count} reddit threads in database.")
        
        # Get first 5 URLs just in case they are there
        records = db.query(FeedbackRecord).filter(FeedbackRecord.source.like('reddit/r/%')).limit(5).all()
        for r in records:
            # wait, FeedbackRecord doesn't have a 'url' field in the model?
            # Let's check the schema
            print(r.raw_text[:50])
    except Exception as e:
        print("Error:", e)
    finally:
        db.close()

if __name__ == "__main__":
    check_db()
