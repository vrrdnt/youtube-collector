const { ipcRenderer } = require('electron');
const path = require('path');

const urlInput = document.getElementById('urlInput');
const titleInput = document.getElementById('titleInput');
const artistInput = document.getElementById('artistInput');
const albumInput = document.getElementById('albumInput');
const trackNumberInput = document.getElementById('trackNumberInput');
const downloadButton = document.getElementById('downloadButton');
const messageElement = document.getElementById('message');
const consoleElement = document.getElementById('console');
const albumArtInput = document.getElementById('albumArtInput');

let albumArtFilePath = '';

albumArtInput.addEventListener('change', () => {
  const file = albumArtInput.files[0];
  albumArtFilePath = file ? file.path : '';
  ipcRenderer.send('albumArt:change', albumArtFilePath);
  const newLine = document.createElement('div');
  newLine.textContent = `Album art file path: ${albumArtFilePath}`;
  consoleElement.appendChild(newLine);
});

downloadButton.addEventListener('click', () => {
  const url = urlInput.value.split('&')[0]; // allow people to enter a url with a playlist index
  const title = titleInput.value;
  const artist = artistInput.value;
  const album = albumInput.value;
  const trackNumber = trackNumberInput.value;

  ipcRenderer.send('download', url, title, artist, album, trackNumber);
});

ipcRenderer.on('download:started', () => {
  messageElement.textContent = 'Download started...';
  consoleElement.textContent = '';
});

ipcRenderer.on('download:completed', (event, filePath) => {
  messageElement.textContent = 'Download completed successfully!';
  const newLine = document.createElement('div');
  newLine.textContent = `File saved to: ${filePath}`;
  newLine.style.color = 'green';
  consoleElement.appendChild(newLine);

  urlInput.value = '';
  titleInput.value = '';
  artistInput.value = '';
  albumInput.value = '';
  trackNumberInput.value = '';
  albumArtInput.value = '';
});

ipcRenderer.on('download:error', (event, errorMessage, errorStack) => {
  messageElement.textContent = `Error: ${errorMessage}\n${errorStack}`;
  consoleElement.textContent = '';
});

ipcRenderer.on('console', (event, message) => {
  const newLine = document.createElement('div');
  newLine.textContent = message;
  if (message.startsWith('[FFmpeg info')) { newLine.style.color = 'goldenrod'; };
  if (message.startsWith('[FFmpeg fferr')) { newLine.style.color = 'darkblue'; };
  if (message.startsWith('[FFmpeg ffout')) { newLine.style.color = 'darkgreen'; }
  consoleElement.appendChild(newLine);
  consoleElement.scrollTop = consoleElement.scrollHeight;
});