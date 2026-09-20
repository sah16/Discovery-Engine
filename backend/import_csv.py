import csv
import sys
import os

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from app.database import SessionLocal
from app.models import FeedbackRecord

def import_csv(filepath):
    db = SessionLocal()
    records_to_insert = []
    try:
        with open(filepath, mode='r', encoding='utf-8') as file:
            reader = csv.DictReader(file)
            for row in reader:
                # Use user_evidence as raw_text
                source = f"csv_import/{row.get('source_type', 'unknown')}/{row.get('source', 'unknown')}"
                raw_text = row.get('user_evidence', '').strip()
                if raw_text:
                    records_to_insert.append(FeedbackRecord(
                        source=source,
                        raw_text=raw_text
                    ))
        
        if records_to_insert:
            db.bulk_save_objects(records_to_insert)
            db.commit()
            print(f"Successfully imported {len(records_to_insert)} records.")
        else:
            print("No records found to import.")
    except Exception as e:
        db.rollback()
        print(f"Error importing CSV: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    import_csv("scraped_data.csv")
