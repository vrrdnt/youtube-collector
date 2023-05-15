const express = require('express');
const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');
const Jimp = require('jimp');
const archiver = require('archiver');
const sanitize = require('sanitize-filename');
const axios = require('axios');
const fs = require('fs');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.listen(3000, function () {
    console.log('Success! App is listening at http://localhost:3000.')
})

app.post('/download', async (req, res) => {
    const youtubeURL = await req.body.url;
    const isPlaylist = ytdl.validateURL(youtubeURL) && ytdl.getURLVideoID(youtubeURL) === null;

    try {
        const info = await ytdl.getInfo(youtubeURL);

        const videoTitle = sanitize(info.videoDetails.title);

        if (isPlaylist) {
            await downloadPlaylist(youtubeURL, videoTitle);
            await convertPlaylistToMp3(videoTitle);
            await downloadThumbnail(youtubeURL, videoTitle)
            await addCoverArtToMp3(videoTitle);
            await createZipFile(videoTitle);
            res.download(`${videoTitle}.zip`, `${videoTitle}.zip`, (err) => {
                if (err) {
                    console.error('Error:', err);
                    res.status(500).send('An error occurred');
                }
                cleanup(videoTitle);
            });
        } else {
            await downloadVideo(youtubeURL, videoTitle);
            await convertToMp3(videoTitle);
            await downloadThumbnail(youtubeURL, videoTitle)
            await addCoverArtToMp3(videoTitle, info.videoDetails.author.name);
            res.download(`${videoTitle}.mp3`, `${videoTitle}.mp3`, (err) => {
                if (err) {
                    console.error('Error:', err);
                    res.status(500).send('An error occurred');
                }
                cleanup(videoTitle);
            });
        }
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).send('An error occurred');
    }
});

async function downloadVideo(url, videoTitle) {
    const videoStream = ytdl(url, { filter: 'audioandvideo' });
    await videoStream.pipe(fs.createWriteStream(`${videoTitle}.mp4`));
    return new Promise((resolve) => {
        videoStream.on('end', resolve);
    });
}

async function downloadPlaylist(url, videoTitle) {
    const playlist = await ytdl.getPlaylist(url);
    const videos = playlist.videos;

    for (let i = 0; i < videos.length; i++) {
        const video = videos[i];
        const videoStream = ytdl(video.url);
        await videoStream.pipe(fs.createWriteStream(`${videoTitle} - ${i + 1}.mp4`));
        await new Promise((resolve) => {
            videoStream.on('end', resolve);
        });
    }
}

async function convertToMp3(videoTitle) {
    return new Promise((resolve, reject) => {
        ffmpeg(`${videoTitle}.mp4`)
            .noVideo()
            .output(`${videoTitle}.mp3`)
            .on('end', resolve)
            .on('error', reject)
            .run();
    });
}

async function convertPlaylistToMp3(videoTitle) {
    const files = fs.readdirSync('.');
    const playlistFiles = files.filter((file) => file.startsWith(`${videoTitle} -`));

    for (const file of playlistFiles) {
        await convertToMp3(file.replace('.mp4', ''));
    }
}

async function downloadThumbnail(url, videoTitle) {
    const info = await ytdl.getInfo(url);
    console.log(info.videoDetails.thumbnails);
    const thumbnailUrl = info.videoDetails.thumbnails[info.videoDetails.thumbnails.length - 1].url;

    const response = await axios.get(thumbnailUrl, {
        responseType: 'arraybuffer',
    });

    let image = Jimp(response.data);
  const imageMetadata = await image.metadata();

  if (imageMetadata.format === 'webp') {
    image = image.webp();
  }

  await image.toFile(`${videoTitle}.jpg`);
}

async function addCoverArtToMp3(videoTitle, uploader) {
    const files = fs.readdirSync('.');
    const mp3Files = files.filter((file) => file.endsWith('.mp3'));

    for (const file of mp3Files) {
        const thumbnail = await Jimp.read(`${videoTitle}.jpg`);
        thumbnail.cover(500, 500).write(`thumbnail.jpg`);

        await new Promise((resolve, reject) => {
            ffmpeg(file)
                .input(`thumbnail.jpg`)
                .outputOptions(
                    '-map', '0',
                    '-map', '1',
                    '-c', 'copy',
                    '-id3v2_version', '3',
                    '-metadata', `title=${videoTitle}`,
                    '-metadata', `artist=${uploader}`,
                    '-metadata:s:v', 'title="Album cover"',
                    '-metadata:s:v', 'comment="Cover (front)"'
                  )
                .output(`output_${file}`)
                .on('end', () => {
                    fs.renameSync(`output_${file}`, file); // Replace the original file with the one containing cover art
                    resolve();
                })
                .on('error', reject)
                .run();
        });
    }
}


async function createZipFile(videoTitle) {
    const files = fs.readdirSync('.');
    const mp3Files = files.filter((file) => file.endsWith('.mp3'));

    const zip = archiver('zip');
    const output = fs.createWriteStream(`${videoTitle}.zip`);

    zip.pipe(output);
    mp3Files.forEach((file) => {
        zip.file(file, { name: file });
    });

    await zip.finalize();
};

function cleanup(videoTitle) {
    fs.unlinkSync(`${videoTitle}.mp4`);
    fs.unlinkSync(`${videoTitle}.mp3`);
    fs.unlinkSync(`${videoTitle}.jpg`);
    fs.unlinkSync(`thumbnail.jpg`);
}
