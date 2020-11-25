# youtube-collector
A tool for downloading YouTube/SoundCloud audio and storing it for Spotify to use.  

## Preliminary Setup  
In the Spotify© app for PC, click the three white dots at the top left, click **Edit**, and click **Preferences**. (You can also press **Ctrl** + **P**)  
Next, scroll down to the Local Files section. Click **Add a Source**, and create a folder called Spotify in your Music folder.  
To do this, click the dropdown by your name after clicking **Add a Source**, **Right-click** the Music folder, hover over **new**, and click **Folder**. Name that folder "Spotify". Click **OK** once done.  
Make sure to enable the folder by clicking the toggle button to its right, leaving it in the enabled/green position.  
  
#### Installing FFMPEG  
This project requires [FFMPEG](https://ffmpeg.org/download.html). Please download the correct binary for your OS, and make it available in your environment/path.  
A detailed, easy-to-follow guide for installing FFMPEG on Windows is [here](https://www.wikihow.com/Install-FFmpeg-on-Windows).

# Installation
### Downloading youtube-collector
Below shows where to download the .zip file for this repository.  
![](https://i.imgur.com/g6fzqGb.jpg)  
Once downloaded, right click the file and click "**Extract All...**"  
Change the directory to your desktop, documents folder, etc... or leave it how it is.  
You can also move it anywhere after it's extracted.  
You can also move the shortcut called **Collector** anywhere to easily run the program.
  
### Installing Python
Click [here](https://www.python.org/ftp/python/3.9.0/python-3.9.0-amd64.exe) to download the correct python installer.  
Click install, and make sure **pip** gets installed along with Python. (There will be a checkbox).  
Also make sure to add Python to your PATH. (Should be another checkbox.)  
Once finished, restart your computer.  
  
### Installing the required libraries  
Open the folder of this project you downloaded and extracted, and run **setup.py**.
