const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const ytdl = require('ytdl-core');
const axios = require('axios');
const fsp = require('fs/promises');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { createFFmpeg, fetchFile } = require('@ffmpeg/ffmpeg');

const ffmpeg = createFFmpeg({ log: true });

// stupid as hell, see line 144
let albumArtFilePath = '';

const tempDir = path.join(__dirname, 'temp');
fs.mkdirSync(tempDir, { recursive: true });

async function downloadThumbnailAndAudio(url, titleOverride, artistOverride, album, trackNumber, albumArtFilePath, filePath, event) {
	if (!ffmpeg.isLoaded()) { await ffmpeg.load(); }

	ffmpeg.setLogger(({ type, message }) => {
		event.reply('console', `[FFmpeg ${type}] ${message}`);
	});

	if (await ytdl.validateURL(url)) {
		event.reply('console', 'URL validated');
	} else {
		event.reply('console', 'Invalid URL');
		return;
	}

	const info = await ytdl.getInfo(url);
	let videoTitle = titleOverride || info.videoDetails.title;
	videoTitle = videoTitle.replace(/[^\[\]\(\)\- \w.-]+/g, '_');
	const artist = artistOverride || info.videoDetails.ownerChannelName;

	const thumbnail = info.videoDetails.thumbnails.reduce((prev, current) => {
		if (!prev || current.width > prev.width) {
			return current;
		}
		return prev;
	});

	const thumbnailFilePath = path.join(tempDir, 'thumbnail.jpg');

	if (albumArtFilePath) {
		// Use user-provided album art
		const albumArtBuffer = await fsp.readFile(albumArtFilePath);
		await sharp(albumArtBuffer)
			.resize({ width: 500, height: 500, fit: 'cover' })
			.toFormat('jpeg')
			.toFile(thumbnailFilePath)
			.then(() => {
				event.reply('console', `Album art saved: ${thumbnailFilePath}`);
				console.log('Album art saved:', thumbnailFilePath);
			})
			.catch((error) => {
				event.reply('console', `Error saving album art: ${error}`);
				console.error('Error saving album art:', error);
			});
	} else {
		// Use YouTube video thumbnail
		const thumbnailBuffer = await axios
			.get(thumbnail.url, { responseType: 'arraybuffer' })
			.then((response) => response.data);
		await sharp(thumbnailBuffer)
			.resize({ width: 500, height: 500, fit: 'cover' })
			.toFormat('jpeg')
			.toFile(thumbnailFilePath)
			.then(() => {
				event.reply('console', `Thumbnail saved: ${thumbnailFilePath}`)
				console.log('Thumbnail saved:', thumbnailFilePath);
			})
			.catch((error) => {
				event.reply('console', `Error saving thumbnail: ${error}`)
				console.error('Error saving thumbnail:', error);
			});
	}

	const videoFormat = ytdl.chooseFormat(info.formats, { quality: 'highestaudio' });
	const audioFilePath = path.join(tempDir, `${videoTitle}.${videoFormat.container}`);

	await new Promise((resolve, reject) => {
		ytdl(url, { format: videoFormat })
			.pipe(fs.createWriteStream(audioFilePath))
			.on('finish', resolve)
			.on('error', (error) => {
				reject('Error downloading audio')
				event.reply('console', `Error downloading audio: ${error}`)
				console.error(error)
			});
	});

	ffmpeg.FS('writeFile', audioFilePath, await fetchFile(audioFilePath));
	ffmpeg.FS('writeFile', thumbnailFilePath, await fetchFile(thumbnailFilePath));

	const outputFilePath = path.join(tempDir, `output.mp3`);

	await ffmpeg.run('-i',
		`file:${audioFilePath}`,
		'-i', `file:${thumbnailFilePath}`,
		'-map', '0:a',
		'-map', '1:v',
		'-c:a', 'libmp3lame',
		'-q:a', '2',
		'-id3v2_version', '3',
		'-metadata:s:v', 'title=\"Cover (front)\"',
		'-metadata', `title=${videoTitle}`,
		'-metadata', `artist=${artist}`,
		'-metadata', `album=${album || ''}`,
		'-metadata', `track=${trackNumber || ''}`,
		`file:${outputFilePath}`);

	await fsp.writeFile(filePath, ffmpeg.FS('readFile', outputFilePath));
}

ipcMain.on('download', async (event, url, titleOverride, artistOverride, album, trackNumber) => {
	const tempDir = path.join(__dirname, 'temp');
	fs.mkdirSync(tempDir, { recursive: true });

	try {
		const result = await dialog.showSaveDialog({
			defaultPath: `${titleOverride || 'song'}.mp3`,
			filters: [{ name: 'MP3', extensions: ['mp3'] }],
		});

		if (result.canceled) {
			event.reply('download:canceled');
			return;
		}

		const filePath = result.filePath;

		event.reply('download:started');
		await downloadThumbnailAndAudio(url, titleOverride, artistOverride, album, trackNumber, albumArtFilePath, filePath, event);
		event.reply('download:completed', filePath);
		cleanup();
	} catch (error) {
		console.error(`${error}\n${error.stack}`)
		event.reply('download:error', error.message, error.stack);
	}
});

// stupid as hell
ipcMain.on('albumArt:change', async (event, filePath) => {
	albumArtFilePath = filePath;
});

const cleanup = () => {
	// Remove the temporary directory
	fs.rmSync(tempDir, { recursive: true });
};

// Register the cleanup function
process.on('exit', cleanup);
process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

function createWindow() {
	const mainWindow = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false,
		},
	});

	mainWindow.loadFile(path.join(__dirname, 'index.html'));

	ipcMain.on('console', (event, message) => {
		mainWindow.webContents.send('console', message);
	});

	mainWindow.webContents.on('did-finish-load', () => {
		mainWindow.webContents.send('console', 'Ready');
	});
}

app.whenReady().then(() => {
	createWindow();

	app.on('activate', function () {
		if (BrowserWindow.getAllWindows().length === 0) createWindow();
	});
});

app.on('window-all-closed', function () {
	if (process.platform !== 'darwin') app.quit();
});