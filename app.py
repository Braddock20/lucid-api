from flask import Flask, request, jsonify, send_file, Response
from yt_dlp import YoutubeDL
import tempfile
import os
import shutil

app = Flask(__name__)

YDL_OPTIONS = {
    'format': 'bestaudio/best',
    'quiet': True,
    'nocheckcertificate': True
}

@app.route('/')
def index():
    return jsonify({
        'message': 'YouTube Music API (Python) is running!',
        'endpoints': {
            'search': '/api/search?q=your_query',
            'info': '/api/info?url=video_url',
            'stream': '/api/stream?url=video_url',
            'download': '/api/download?url=video_url&format=mp3'
        }
    })

@app.route('/api/info')
def info():
    url = request.args.get('url')
    if not url:
        return jsonify({'error': 'Missing URL'}), 400

    try:
        with YoutubeDL(YDL_OPTIONS) as ydl:
            info_dict = ydl.extract_info(url, download=False)
            return jsonify({
                'id': info_dict.get('id'),
                'title': info_dict.get('title'),
                'duration': info_dict.get('duration'),
                'uploader': info_dict.get('uploader'),
                'thumbnail': info_dict.get('thumbnail'),
                'webpage_url': info_dict.get('webpage_url'),
                'formats': info_dict.get('formats')
            })
    except Exception as e:
        return jsonify({'error': 'Failed to fetch info', 'message': str(e)}), 500

@app.route('/api/stream')
def stream():
    url = request.args.get('url')
    if not url:
        return jsonify({'error': 'Missing URL'}), 400

    try:
        ydl_opts = {'format': 'bestaudio', 'quiet': True}
        with YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=False)
            audio_url = info['url']
            return jsonify({'audio_url': audio_url})
    except Exception as e:
        return jsonify({'error': 'Streaming failed', 'message': str(e)}), 500

@app.route('/api/download')
def download():
    url = request.args.get('url')
    fmt = request.args.get('format', 'mp3')

    if not url:
        return jsonify({'error': 'Missing URL'}), 400

    temp_dir = tempfile.mkdtemp()
    ydl_opts = {
        'format': 'bestaudio/best',
        'outtmpl': os.path.join(temp_dir, 'audio.%(ext)s'),
        'postprocessors': [{
            'key': 'FFmpegExtractAudio',
            'preferredcodec': fmt,
            'preferredquality': '192'
        }],
        'quiet': True
    }

    try:
        with YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=True)
            file_path = os.path.join(temp_dir, f'audio.{fmt}')
            return send_file(file_path, as_attachment=True, download_name=f"{info['title']}.{fmt}")
    except Exception as e:
        return jsonify({'error': 'Download failed', 'message': str(e)}), 500
    finally:
        shutil.rmtree(temp_dir, ignore_errors=True)

# ✅ Render-compatible server binding
if __name__ == '__main__':
    import os
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)), debug=True)
