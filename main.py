from fastapi import FastAPI, Query
from fastapi.responses import FileResponse
import yt_dlp
import uuid
import os

app = FastAPI()

@app.get("/")
def home():
    return {"message": "🎥 Video Downloader API is Live! Use /download?url=VIDEO_URL"}

@app.get("/download")
def download_video(url: str = Query(...)):
    unique_id = str(uuid.uuid4())[:8]
    filename = f"{unique_id}.mp4"

    ydl_opts = {
        'outtmpl': filename,
        'format': 'bestvideo+bestaudio/best',
        'merge_output_format': 'mp4'
    }

    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            ydl.download([url])
        return FileResponse(filename, media_type='video/mp4', filename=filename)
    except Exception as e:
        return {"error": str(e)}
    finally:
        if os.path.exists(filename):
            os.remove(filename)
