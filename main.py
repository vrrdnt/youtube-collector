#!/usr/bin/env python

from lib.downloader import download


def collect():
    ask_again = True
    urls = []
    while ask_again:
        user_input = input('Enter a YouTube or Soundcloud URL. Enter "stop" to stop collecting: ')

        if user_input.lower() == "stop":
            ask_again = False
        else:
            urls += [user_input]
            ask_again = True
    try:
        download(urls)
    except FileNotFoundError:
        pass


if __name__ == '__main__':
    collect()
