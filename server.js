const express = require('express');
const multer = require('multer');
const path = require('path');
const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const axios = require('axios');
const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public'));
app.use('/downloads', express.static(path.join(__dirname, 'downloads')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure Multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Function to get video information from a YouTube URL
const getVideoInfo = async (url) => {
    try {
        const response = await axios.get(`https://www.youtube.com/oembed?url=${url}&format=json`);
        return {
            title: response.data.title,
            thumbnail: response.data.thumbnail_url,
        };
    } catch (error) {
        console.error('Error getting video info:', error.message);
        throw error;
    }
};

// Function to download an image and return its buffer
const downloadImage = async (url) => {
    try {
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        return Buffer.from(response.data, 'binary');
    } catch (error) {
        console.error('Error downloading image:', error.message);
        throw error;
    }
};

// Function to crop an image and return its buffer
const cropImage = async (imageBuffer) => {
    try {
        // Resize and crop the image to a square with a size of 300x300 pixels
        const croppedBuffer = await sharp(imageBuffer)
            .resize(300, 300, { fit: 'cover' })
            .toBuffer();

        return croppedBuffer;
    } catch (error) {
        console.error('Error cropping image:', error.message);
        throw error;
    }
};

const convertToMP3 = async (videoUrl, imageBuffer, artist, songName, album, trackNumber) => {
    const uniqueId = uuidv4();
    const downloadsFolder = path.join(__dirname, 'downloads');
    const mp3FileName = `${artist} - ${songName}.mp3`;
    const mp3FilePath = path.join(downloadsFolder, mp3FileName);
    const videoFilePath = path.join(downloadsFolder, `temp_${uniqueId}.mp4`);
    const imageFilePath = path.join(downloadsFolder, `temp_image_${uniqueId}.jpg`); // Temporary image file path

    try {
        // Download YouTube video and save it to a local file
        const videoInfo = await ytdl.getInfo(videoUrl);
        const videoFormat = ytdl.chooseFormat(videoInfo.formats, { quality: 'highestaudio' });
        const videoFileStream = ytdl.downloadFromInfo(videoInfo, { format: videoFormat });

        // Create a writable stream to save the video locally
        const videoWriteStream = fs.createWriteStream(videoFilePath);
        videoFileStream.pipe(videoWriteStream);

        // Wait for the download to complete
        await new Promise((resolve, reject) => {
            videoWriteStream.on('finish', resolve);
            videoWriteStream.on('error', reject);
        });

        // Save the image to a temporary file
        fs.writeFileSync(imageFilePath, imageBuffer);

        // Set metadata tags for the MP3 file
        const metadataTags = {
            title: songName,
            artist: artist,
            album: album,
            track: trackNumber,
            comment: '<3',
        };

        // Attach image as cover art and convert to MP3 using ffmpeg
        await new Promise((resolve, reject) => {
            ffmpeg(videoFilePath)
                .audioCodec('libmp3lame')
                .audioBitrate(192)
                .input(imageFilePath) // Input the image buffer directly
                .inputFormat('image2pipe')
                .outputOptions(
                    '-map', '0',
                    '-map', '1', // Map the image input
                    '-metadata', `title=${metadataTags.title}`,
                    '-metadata', `artist=${metadataTags.artist}`,
                    '-metadata', `album=${metadataTags.album}`,
                    '-metadata', `track=${metadataTags.track}`,
                    '-metadata', `comment=${metadataTags.comment}`,
                )
                .output(mp3FilePath)
                .on('end', () => {
                    // Remove temporary video file
                    fs.unlinkSync(videoFilePath);
                    resolve();
                })
                .on('error', (err) => reject(err))
                .run();
        });

        console.log('Conversion to MP3 completed');
        return { videoFilePath, mp3FileName, downloadsFolder };
    } catch (error) {
        console.error('Error converting to MP3:', error.message);

        // Handle cleaning up if an error occurs
        if (fs.existsSync(videoFilePath)) {
            fs.unlinkSync(videoFilePath);
        }

        throw error;
    }
};

// Route to serve the index.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.post('/convert', upload.single('image'), async (req, res) => {
    try {
        // Handle video conversion
        const videoUrl = req.body.videoUrl;
        const videoInfo = await getVideoInfo(videoUrl);
        const thumbnail = videoInfo.thumbnail;
        console.log(`${videoUrl}\n${videoInfo}\n${thumbnail}`)

        // Handle image cropping
        let image;
        if (req.file) {
            image = req.file.buffer;
        } else {
            // Download and use video thumbnail if no image is provided
            const thumbnailBuffer = await downloadImage(thumbnail);
            image = thumbnailBuffer;
        }

        const croppedImageBuffer = await cropImage(image);

        // Process additional form fields
        const artist = req.body.artist || 'Unknown Artist';
        const songName = req.body.songName || 'Unknown Song';
        const album = req.body.album || 'Unknown Album';
        const trackNumber = req.body.trackNumber || '1';

        // Convert video to MP3
        const { mp3FilePath, mp3FileName, downloadsFolder } = await convertToMP3(videoUrl, croppedImageBuffer, artist, songName, album, trackNumber);

        // Set the Content-Disposition header manually
        res.setHeader('Content-Disposition', `attachment; filename="${mp3FileName}"`);

        // Respond with the MP3 file name
        res.json({ mp3FileName });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
