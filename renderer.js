const { ipcRenderer } = require('electron');

const urlInput = document.getElementById('urlInput');
const titleInput = document.getElementById('titleInput');
const artistInput = document.getElementById('artistInput');
const albumInput = document.getElementById('albumInput');
const trackNumberInput = document.getElementById('trackNumberInput');
const downloadButton = document.getElementById('downloadButton');
const messageElement = document.getElementById('message');
const consoleElement = document.getElementById('console');

downloadButton.addEventListener('click', () => {
  const url = urlInput.value;
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
  consoleElement.textContent = `File saved to: ${filePath}`;
});

ipcRenderer.on('download:error', (event, errorMessage, errorStack) => {
  messageElement.textContent = `Error: ${errorMessage}\n${errorStack}`;
  consoleElement.textContent = '';
});

ipcRenderer.on('console', (event, message) => {
  consoleElement.textContent += `${message}\n`;
  consoleElement.scrollTop = consoleElement.scrollHeight;
});