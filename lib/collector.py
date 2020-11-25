#!/usr/bin/env python

"""
    File name: collector.py
    Author: William Swoveland
    Date created: 11/25/2020
    Date last modified: 11/25/2020
    Python version: 3.9.0
"""

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
