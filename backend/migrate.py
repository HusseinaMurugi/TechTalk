# Database migration for notification model updates
from sqlalchemy import create_engine, text
try:
    from database import DATABASE_URL
except ImportError:
    DATABASE_URL = "sqlite:///./techtalk.db"

def migrate_notifications():
    engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
    
    with engine.connect() as conn:
        try:
            # Check if columns exist first
            result = conn.execute(text("PRAGMA table_info(notifications)"))
            columns = [row[1] for row in result.fetchall()]
            
            if 'related_user_id' not in columns:
                conn.execute(text("ALTER TABLE notifications ADD COLUMN related_user_id INTEGER"))
                print("✅ Added related_user_id column")
            
            if 'related_post_id' not in columns:
                conn.execute(text("ALTER TABLE notifications ADD COLUMN related_post_id INTEGER"))
                print("✅ Added related_post_id column")
                
            conn.commit()
            print("✅ Migration completed successfully")
        except Exception as e:
            print(f"⚠️ Migration info: {e}")
            # Continue anyway - might be a different database system

if __name__ == "__main__":
    migrate_notifications()