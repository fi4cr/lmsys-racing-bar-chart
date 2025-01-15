import base64
import csv
import json
import os
import requests
from datetime import datetime

# GitHub API configuration
OWNER = "fboulnois"
REPO = "llm-leaderboard-csv"
FILE_PATH = "csv/lmsys.csv"
GITHUB_API = "https://api.github.com"

def get_commits():
    url = f"{GITHUB_API}/repos/{OWNER}/{REPO}/commits"
    params = {"path": FILE_PATH}
    response = requests.get(url, params=params)
    return response.json()

def get_file_content(commit_sha):
    url = f"{GITHUB_API}/repos/{OWNER}/{REPO}/contents/{FILE_PATH}"
    params = {"ref": commit_sha}
    response = requests.get(url, params=params)
    if response.status_code == 200:
        content = response.json()["content"]
        return base64.b64decode(content).decode('utf-8')
    return None

def save_csv(content, date):
    filename = f"data/lmsys_{date}.csv"
    with open(filename, 'w', newline='', encoding='utf-8') as f:
        f.write(content)

def main():
    if not os.path.exists('data'):
        os.makedirs('data')

    commits = get_commits()
    for commit in commits:
        commit_date = datetime.strptime(commit['commit']['committer']['date'], 
                                      '%Y-%m-%dT%H:%M:%SZ').strftime('%Y%m%d')
        content = get_file_content(commit['sha'])
        if content:
            save_csv(content, commit_date)
            print(f"Saved data/lmsys_{commit_date}.csv")

if __name__ == "__main__":
    main()
