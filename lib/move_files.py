#!/usr/bin/env python


import getpass
import os
import shutil


def move():
    for file in os.listdir("./output"):
        if file.endswith(".mp3"):
            src = os.path.join("./output", file)
            dst = os.path.join("/", "Users", getpass.getuser(), "Music", "Spotify", file)
            shutil.move(src, dst)

    shutil.rmtree(os.path.join("./output"))
    shutil.rmtree(os.path.join("./working"))
    os.remove("thumbnail.jpg")
