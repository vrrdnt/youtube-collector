#!/usr/bin/env python

"""
    File name: thumbnail_gen.py
    Author: William Swoveland
    Date created: 11/25/2020
    Date last modified: 11/25/2020
    Python version: 3.9.0
"""


def crop_center(pil_img, crop_width, crop_height):
    img_width, img_height = pil_img.size
    return pil_img.crop(((img_width - crop_width) // 2,
                         (img_height - crop_height) // 2,
                         (img_width + crop_width) // 2,
                         (img_height + crop_height) // 2))


def crop_max_square(pil_img):
    return crop_center(pil_img, min(pil_img.size), min(pil_img.size))
