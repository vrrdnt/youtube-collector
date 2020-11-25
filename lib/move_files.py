#!/usr/bin/env python

"""
    File name: move_files.py
    Author: William Swoveland
    Date created: 11/25/2020
    Date last modified: 11/25/2020
    Python version: 3.9.0
"""

import getpass
import os
import shutil


def move():
    for file in os.listdir("./output"):
        if file.endswith(".mp3"):
            src = os.path.join("./output", file)
            dst = os.path.join("/", "Users", getpass.getuser(), "Music", "Spotify", file)
            shutil.move(src, dst)

    os.remove("thumbnail.jpg")
