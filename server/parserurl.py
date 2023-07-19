import requests
from bs4 import BeautifulSoup

# Make a request to the local backend server
url = "http://localhost:3033/requests"  # Replace with the URL of your local backend server
response = requests.get(url)

# Parse the HTML content using BeautifulSoup
soup = BeautifulSoup(response.content, "html.parser")

# Find all the <a> tags and extract the URLs
urls = []
for link in soup.find_all("a"):
    href = link.get("href")
    if href:
        urls.append(href)

# Print the extracted URLs
for url in urls:
    print(url)
