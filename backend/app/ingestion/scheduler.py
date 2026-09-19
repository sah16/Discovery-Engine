from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger
from .pipeline import run_ingestion_pipeline
import logging

logger = logging.getLogger(__name__)

# Initialize the scheduler
scheduler = BackgroundScheduler()

def start_scheduler():
    if not scheduler.running:
        # Disabled daily ingestion to save Apify credits
        # scheduler.add_job(
        #     run_ingestion_pipeline,
        #     trigger=CronTrigger(hour=0, minute=0),
        #     id='daily_ingestion_job',
        #     name='Daily Data Ingestion',
        #     replace_existing=True
        # )
        scheduler.start()
        logger.info("Background scheduler started. Daily ingestion is DISABLED to save credits.")

def stop_scheduler():
    if scheduler.running:
        scheduler.shutdown()
        logger.info("Background scheduler stopped.")
