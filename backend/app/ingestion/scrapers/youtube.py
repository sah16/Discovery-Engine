from googleapiclient.discovery import build
from typing import List
import os

def scrape() -> List[dict]:
    results = []
    # Using an environment variable for YouTube API key if available
    api_key = os.getenv("YOUTUBE_API_KEY")
    if not api_key:
        print("YOUTUBE_API_KEY not set. Skipping YouTube scrape.")
        return results
        
    try:
        youtube = build('youtube', 'v3', developerKey=api_key)
        
        # Search for videos related to google photos search
        search_response = youtube.search().list(
            q="how to search google photos",
            part="id,snippet",
            maxResults=5,
            type="video"
        ).execute()
        
        keywords = ["search", "find", "can't", "remember", "lost"]
        
        for item in search_response.get("items", []):
            video_id = item["id"]["videoId"]
            
            # Fetch comments for the video
            comments_response = youtube.commentThreads().list(
                part="snippet",
                videoId=video_id,
                maxResults=20,
                textFormat="plainText"
            ).execute()
            
            for comment_item in comments_response.get("items", []):
                comment = comment_item["snippet"]["topLevelComment"]["snippet"]["textDisplay"]
                if any(k in comment.lower() for k in keywords):
                    results.append({"source": "YouTube Comments", "raw_text": comment})
                    
    except Exception as e:
        print(f"Error scraping YouTube: {e}")
        
    return results
