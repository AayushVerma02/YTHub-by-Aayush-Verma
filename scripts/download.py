import yt_dlp
import sys
import os
import re
import locale

# Ensure UTF-8 encoding is used
sys.stdout.reconfigure(encoding='utf-8')

# Get arguments from the command line
if len(sys.argv) < 3:
    print("Error: Missing arguments. Usage: python download.py <video_url> <download_folder>")
    sys.exit(1)

video_url = sys.argv[1]
download_folder = sys.argv[2]

# Ensure download folder exists
if not os.path.exists(download_folder):
    os.makedirs(download_folder)

# Function to clean filenames
def sanitize_filename(name):
    return re.sub(r'[<>:"/\\|?*]', "", name)  # Remove invalid characters for filenames

# yt-dlp options
ydl_opts = {
    'outtmpl': os.path.join(download_folder, '%(title)s.%(ext)s'),  
    'format': 'best[ext=mp4]', 
    'noplaylist': True,  
}

# Download the video
try:
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info_dict = ydl.extract_info(video_url, download=True)  
        video_title = sanitize_filename(info_dict.get("title", "video")) 
        video_ext = info_dict.get("ext", "mp4") 
        saved_filename = f"{video_title}.{video_ext}" 
    
    print(f"Download completed successfully! Saved as: {saved_filename}")

except Exception as e:
    print(f"Error: {str(e)}")
    sys.exit(1)