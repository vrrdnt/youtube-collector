#!/usr/bin/env python

"""
    File name: main.py
    Author: William Swoveland
    Date created: 11/24/2020
    Date last modified: 11/25/2020
    Python version: 3.9.0
"""

from lib.collector import collect
from lib.downloader import download
from lib.move_files import move


if __name__ == '__main__':
    download(collect())
    move()
    print("All done!")
