import re
from bs4 import BeautifulSoup

def remove_html(text: str) -> str:
    """Removes HTML tags from text."""
    if not text:
        return ""
    soup = BeautifulSoup(text, "html.parser")
    return soup.get_text()

def mask_pii(text: str) -> str:
    """Basic PII masking (emails, phone numbers)."""
    if not text:
        return ""
    
    # Mask emails
    email_pattern = r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}'
    text = re.sub(email_pattern, '[EMAIL_REMOVED]', text)
    
    # Mask US phone numbers (basic pattern)
    phone_pattern = r'\b(?:\+?1[-.]?)?\(?([0-9]{3})\)?[-.]?([0-9]{3})[-.]?([0-9]{4})\b'
    text = re.sub(phone_pattern, '[PHONE_REMOVED]', text)
    
    return text

def normalize_text(text: str) -> str:
    """Cleans and standardizes text."""
    if not text:
        return ""
        
    text = remove_html(text)
    text = mask_pii(text)
    
    # Replace multiple newlines with a single space
    text = re.sub(r'\s+', ' ', text)
    
    return text.strip()
