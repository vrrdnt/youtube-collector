#!/usr/bin/env python


import os
import shutil
from io import BytesIO
import eyed3
import requests
from PIL import Image
import youtube_dl
from lib.thumbnail import crop_max_square
from lib.move_files import move
if __name__ == '__main__':
    from main import collect


def download(urls):
    ytdl_options = {
        "outtmpl": "working/%(title)s.%(ext)s",
        "format": "bestaudio/best",
        "postprocessors": [
            {
                "key": "FFmpegExtractAudio",
                "preferredcodec": "mp3",
                "preferredquality": "320",
            }
        ],
    }

    for url in urls:
        with youtube_dl.YoutubeDL(ytdl_options) as ytdl:
            try:
                result = ytdl.extract_info(url, download=True)
            except youtube_dl.utils.DownloadError:
                print()
                collect()

        try:
            image_response = requests.get(result['thumbnails'][len(result['thumbnails']) - 1]['url'])
        except Exception as e:
            print("Exception: {}".format(e))
            continue
        img = Image.open(BytesIO(image_response.content))

        img = crop_max_square(img).resize((500, 500), Image.LANCZOS)
        img.save('thumbnail.jpg')

        files = []
        for file in os.listdir("./working"):
            if file.endswith(".mp3"):
                files += [file]
        for file in files:
            audio_file = eyed3.load(os.path.join('./working', file))
            audio_file.initTag()
            audio_file.tag.artist = result['uploader']
            audio_file.tag.title = result["title"]
            audio_file.tag.album = result["title"]
            audio_file.tag.artist_url = result['webpage_url']
            audio_file.tag.images.set(
                type_=3,
                img_data=open('thumbnail.jpg', 'rb').read(),
                mime_type="image/jpeg"
            )
            audio_file.tag.save()
            os.makedirs(os.path.join('./output'), exist_ok=True)
            shutil.move(os.path.join('./working', file), os.path.join('./output', file))

    return move()