const express = require('express');
const axios = require('axios');
const ytdl = require('ytdl-core');
const jimp = require('jimp');
const nodeID3 = require('node-id3');
const sharp = require('sharp');
const fs = require('fs')//.promises;

const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.post('/download', async (req, res) => {
    try {
        const videoUrl = req.body.url;
        const videoInfo = await ytdl.getInfo(videoUrl);
        const videoTitle = videoInfo.videoDetails.title;
        const videoAuthor = videoInfo.videoDetails.author.name;

        await downloadVideo(videoUrl, videoTitle, videoAuthor);

        const mp3Filename = `${videoTitle}.mp3`;
        res.download(mp3Filename, () => {
            cleanup(videoTitle, mp3Filename);
        });
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).send('Error occurred while processing the download.');
    }
});

async function downloadVideo(url, videoTitle, videoAuthor) {
    await ytdl(url, {
        filter: 'audioonly',
        quality: 'highestaudio',
        format: 'mp3',
        o: `${videoTitle}.mp3`,
    });

    await downloadThumbnail(url, videoTitle);
    await addCoverArtToMp3(videoTitle, videoAuthor);
}

async function downloadThumbnail(url, videoTitle) {
    const info = await ytdl.getInfo(url);
    const thumbnailUrl = info.videoDetails.thumbnails[info.videoDetails.thumbnails.length - 1].url;

    const response = await axios.get(thumbnailUrl, {
        responseType: 'arraybuffer',
      });
    
      const buffer = Buffer.from(response.data, 'binary');
    
      let image = sharp(buffer);
      const imageMetadata = await image.metadata();
    
      if (imageMetadata.format === 'webp') {
        const convertedBuffer = await image.jpeg().toBuffer();
        image = await jimp.read(convertedBuffer);
      } else {
        image = await jimp.read(buffer);
      }
    
      await fs.writeFileSync(`${videoTitle}.jpg`, image);
    
      // Wait for the file to be written and close the file handle
    //   await fs.close(await fs.open(`${videoTitle}.jpg`, 'r'));
}

async function addCoverArtToMp3(videoTitle, videoAuthor) {
    const thumbnailPath = `${videoTitle}.jpg`;
    const mp3Path = `${videoTitle}.mp3`;

    const thumbnailBuffer = await sharp(thumbnailPath)
        .jpeg()
        .toBuffer();

    const tags = {
        title: videoTitle,
        artist: videoAuthor,
        attachments: [
            {
                type: 'image/jpeg',
                data: thumbnailBuffer,
            },
        ],
    };

    const mp3Buffer = fs.readFileSync(mp3Path);
    const updatedMp3Buffer = await nodeID3.update(tags, mp3Buffer);

    fs.writeFileSync(`${videoTitle}_with_cover.mp3`, updatedMp3Buffer);
}

async function cleanup(videoTitle, fileToRemove) {
    try {
        await fs.unlink(`${videoTitle}.mp3`);
        await fs.unlink(`${videoTitle}.jpg`);
        await fs.unlink(`${videoTitle}_with_cover.mp3`);

        if (fileToRemove) {
            await fs.unlink(fileToRemove);
        }
    } catch (error) {
        console.error('Error occurred during cleanup:', error);
    }
}

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
