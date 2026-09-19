from app.database import engine
from sqlalchemy import text

def alter_table():
    with engine.connect().execution_options(isolation_level="AUTOCOMMIT") as conn:
        try:
            conn.execute(text("ALTER TABLE feedback_records ADD COLUMN target_of_search VARCHAR(200);"))
            print("Added target_of_search")
        except Exception as e: print("Error target_of_search:", e)
        try:
            conn.execute(text("ALTER TABLE feedback_records ADD COLUMN search_strategy VARCHAR(200);"))
            print("Added search_strategy")
        except Exception as e: print("Error search_strategy:", e)
        try:
            conn.execute(text("ALTER TABLE feedback_records ADD COLUMN emotion VARCHAR(100);"))
            print("Added emotion")
        except Exception as e: print("Error emotion:", e)
        try:
            conn.execute(text("ALTER TABLE feedback_records ADD COLUMN is_processed INTEGER DEFAULT 0;"))
            print("Added is_processed")
        except Exception as e: print("Error is_processed:", e)

if __name__ == "__main__":
    alter_table()
