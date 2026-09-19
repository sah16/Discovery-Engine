import requests
import re
res = requests.get('https://discoveryengine.onrender.com/assets/index-OqjwDzOp.js')
urls = set(re.findall(r'https?://[^\s\"\'\`\)]+', res.text))
print('Found URLs in JS:', urls)
