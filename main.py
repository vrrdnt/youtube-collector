"""
    File name: main.py
    Author: William Swoveland
    Date created: 11/24/2020
    Date last modified: 11/24/2020
    Python version: 3.9.0
"""

# youtube-dl insisted
from __future__ import unicode_literals

# moving files
import os
import shutil
from io import BytesIO

# used to find the user's home folder. probably unnecessary
import getpass

# downloading youtube videos and converting them
import youtube_dl

# configuring mp3 metadata
import eyed3

# eyed3 won't assign the image so i have to use urllib3 until it's figured out
# also crop a square from the image
import requests
from PIL import Image
from thumbnail_gen import crop_max_square


def main():
    download(collect())
    move()
    print("All done! Feel free to close this window.")


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
                result = ytdl.extract_info(url, download=False)
                ytdl.download([url])
            except youtube_dl.utils.DownloadError:
                print()
                main()

        try:
            image_response = requests.get(result['thumbnails'][len(result['thumbnails']) - 1]['url'])
        except UnboundLocalError:
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
            shutil.move(os.path.join('./working', file), os.path.join('./', file))


def collect():
    ask_again = True
    urls = []
    while ask_again:
        user_input = input('Enter a YouTube or Soundcloud URL. Enter "stop" to stop collecting: ')

        if user_input == "stop":
            ask_again = False
        else:
            urls += [user_input]
            ask_again = True
    return urls


def move():
    for file in os.listdir("./"):
        if file.endswith(".mp3"):
            src = os.path.join("./", file)
            dst = os.path.join("/", "Users", getpass.getuser(), "Music", "Spotify", file)
            shutil.move(src, dst)
    os.remove('thumbnail.jpg')


main()
