# youtube-collector
A CLI tool for downloading YouTube/SoundCloud audio and storing it for Spotify to use, using [youtube-dl](https://github.com/ytdl-org/youtube-dl) and [FFMPEG](https://ffmpeg.org/).  

## Preliminary Setup \[Semi-optional\]
In the Spotify© app for PC, click the three white dots at the top left, click **Edit**, and click **Preferences**. (You can also press **Ctrl** + **P**)  
Next, scroll down to the Local Files section. Click **Add a Source**, and create a folder called Spotify in your Music folder.  
To do this, click the dropdown by your name after clicking **Add a Source**, **Right-click** the Music folder, hover over **new**, and click **Folder**. Name that folder "Spotify". Click **OK** once done.  
Make sure to enable the folder by clicking the toggle button to its right, leaving it in the enabled/green position.  
##### NOTE:  
You don't have to make a folder called `Spotify`, but the program as of now was written to detect it automatically. Please modify Line 20 of `youtube-collector/lib/move_files.py` to your liking.
  
#### Installing FFMPEG  
This project requires [FFMPEG](https://ffmpeg.org/download.html). Please download the correct binary for your OS, and make it available in your environment/path.  
A detailed, easy-to-follow guide for installing FFMPEG on Windows is [here](https://www.wikihow.com/Install-FFmpeg-on-Windows).  
A guide for Mac OS X is [here](https://superuser.com/a/624562).  
A guide for Linux/Ubuntu is [here](https://linuxize.com/post/how-to-install-ffmpeg-on-ubuntu-18-04/).

# Installation
### Downloading youtube-collector
The image below shows where to click to download the .zip file for this repository.  
![](https://i.imgur.com/g6fzqGb.jpg)  
Once downloaded, right click the file and click "**Extract All...**"  
Change the directory to your desktop, documents folder, etc... or leave it how it is.  
You can also move it anywhere after it's extracted.  
  
### Installing Python
Click [here](https://www.python.org/ftp/python/3.9.0/python-3.9.0-amd64.exe) to download the correct python installer.  
Click install, and make sure **pip** gets installed along with Python. (There will be a checkbox).  
Also make sure to add Python to your PATH. (Should be another checkbox.)  
Once finished, restart your computer.  
  
### Installing the required libraries  
Open the folder of this project you downloaded and extracted, and run **setup.py**.

# All done!  
You'll find the songs you downloaded in the "Local Files" tab in your Spotify app.  
To sync your files to your phone, follow [this guide](https://support.spotify.com/us/article/listen-to-local-files/).
