from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Discovery Engine API"
    DATABASE_URL: str = "postgresql://user:password@localhost/discovery_engine"
    GROQ_API_KEY: str = ""
    EMBEDDING_MODEL_NAME: str = "all-MiniLM-L6-v2"
    
    # Apify variables
    APIFY_API_TOKEN: str = ""

    # YouTube variables
    YOUTUBE_API_KEY: str = ""

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
