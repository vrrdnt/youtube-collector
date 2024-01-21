using YoutubeExplode;
using YoutubeExplode.Exceptions;
using YoutubeExplode.Videos.Streams;
using YoutubeExplode.Common;
using TagLib;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Processing;
using YoutubeExplode.Converter;
using System.Reflection;

namespace youtube_collector
{
    public partial class Form1 : Form
    {
        string albumArtFilePath = "";

        public Form1()
        {
            InitializeComponent();

            // Event handlers
            DownloadButton.Click += DownloadButton_Click;
            ClearButton.Click += ClearButton_Click;
            AlbumArtButton.Click += AlbumArtButton_Click;
        }

        private void AlbumArtButton_Click(object sender, EventArgs e)
        {

            LogRichTextBox.AppendText("Awaiting user-provided album art\n");

            // Open OpenFileDialog to select album art from the user's computer
            if (OpenFileDialogAlbumArt.ShowDialog() == DialogResult.OK)
            {
                // Store the selected album art file path
                string selectedFilePath = OpenFileDialogAlbumArt.FileName;

                // Update the logic to handle the selected album art file
                HandleSelectedAlbumArt(selectedFilePath);

                LogRichTextBox.AppendText($"Image selected: {selectedFilePath}\n");
            }
        }
        private async void DownloadButton_Click(object sender, EventArgs e)
        {
            var youtube = new YoutubeClient();

            // Full path to ffmpeg.exe
            string ffmpegPath = Path.Combine(Path.GetDirectoryName(Application.ExecutablePath), "ffmpeg", "ffmpeg.exe");

            LogRichTextBox.AppendText("Locating highest quality audio stream");

            try
            {
                // Get highest quality audio stream
                var videoUrl = URLTextBox.Text;
                var streamManifest = await youtube.Videos.Streams.GetManifestAsync(videoUrl);

                var streamInfo = streamManifest.GetAudioOnlyStreams().GetWithHighestBitrate();

                LogRichTextBox.AppendText($"Found highest quality audio stream: {streamInfo}\n");

                // Download the audio stream
                LogRichTextBox.AppendText($"Now downloading audio.{streamInfo.Container} and converting to mp3\n");

                // Open SaveFileDialog to select the destination for the finished MP3
                saveFileDialogMP3File.InitialDirectory = Environment.GetFolderPath(Environment.SpecialFolder.MyMusic);
                saveFileDialogMP3File.FileName = $"{TitleTextBox.Text}.mp3";
                if (saveFileDialogMP3File.ShowDialog() == DialogResult.OK)
                {
                    string destinationPath = saveFileDialogMP3File.FileName;

                    // Rename the file based on the provided title
                    string title = TitleTextBox.Text;
                    string newFileName = $"{title}.mp3";
                    string newPath = Path.Combine(Path.GetDirectoryName(destinationPath), newFileName);

                    // Download the audio stream and wait for completion
                    await youtube.Videos.DownloadAsync(videoUrl, newPath, o => o
                        .SetContainer("mp3")
                        .SetFFmpegPath(ffmpegPath)
                    );

                    if (string.IsNullOrEmpty(albumArtFilePath))
                    {
                        await DownloadThumbnailAsync(videoUrl);
                    }

                    LogRichTextBox.AppendText($"Downloaded and saved MP3 to: {newPath}\nAwaiting metadata\n");

                    // Now that the download is complete, write metadata tags
                    WriteMetadataTags(newPath, albumArtFilePath);
                }
            }
            catch (VideoUnplayableException ex)
            {
                LogRichTextBox.AppendText($"Error: {ex.Message}\n");
            }
            catch (Exception ex)
            {
                LogRichTextBox.AppendText($"An unexpected error occurred: {ex.Message}\n");
            }
        }

        private void WriteMetadataTags(string filePath, string albumArtPath)
        {
            try
            {
                var file = TagLib.File.Create(filePath);

                // Clear existing tags
                file.RemoveTags(TagTypes.AllTags);

                file.Save();
                file.Dispose();

                file = TagLib.File.Create(filePath);

                // Create an ID3v2 tag
                var newTag = (TagLib.Id3v2.Tag)file.GetTag(TagTypes.Id3v2, true);

                // Set metadata tags
                newTag.Title = TitleTextBox.Text;
                newTag.Performers = new[] { ArtistTextBox.Text };
                newTag.Album = AlbumTextBox.Text;
                newTag.Track = (uint)TrackNumberUpDown.Value;

                // Embed album art
                if (!string.IsNullOrEmpty(albumArtPath))
                {
                    var picture = new Picture(albumArtPath);
                    newTag.Pictures = new IPicture[] { picture };
                }

                // Save changes
                file.Save();
                file.Dispose();

                System.IO.File.Delete(albumArtPath);

                LogRichTextBox.AppendText("All metadata written to file\n");
            }
            catch (Exception ex)
            {
                LogRichTextBox.AppendText($"Error writing tags: {ex.Message}\n");
            }
        }

        private async Task<string?> DownloadThumbnailAsync(string videoUrl)
        {
            var youtube = new YoutubeClient();

            try
            {
                var video = await youtube.Videos.GetAsync(videoUrl);
                var thumbnail = video.Thumbnails.TryGetWithHighestResolution();
                LogRichTextBox.AppendText($"Thumbnail found: {thumbnail}\n");

                if (thumbnail != null)
                {
                    // Download and save the thumbnail to a file
                    string thumbnailPath = Path.Combine(Path.GetTempPath(), "thumbnail.jpg");
                    using (HttpClient httpClient = new())
                    {
                        var thumbnailBytes = await httpClient.GetByteArrayAsync(thumbnail.Url);
                        System.IO.File.WriteAllBytes(thumbnailPath, thumbnailBytes);
                    }

                    // Store the downloaded album art file path
                    return HandleSelectedAlbumArt(thumbnailPath);
                }
                else
                {
                    LogRichTextBox.AppendText("Thumbnail not found.\n");
                    return null;
                }
            }
            catch (Exception ex)
            {
                LogRichTextBox.AppendText($"Error downloading thumbnail: {ex.Message}\n");
                return null;
            }
        }

        private string HandleSelectedAlbumArt(string selectedFilePath)
        {
            // Store the selected album art file path
            albumArtFilePath = selectedFilePath;

            // Implement cropping logic to make the image square
            CropAlbumArt(selectedFilePath);

            return albumArtFilePath;
        }

        private void CropAlbumArt(string imagePath)
        {
            string croppedImagePath = "";
            try
            {
                using (var originalImage = SixLabors.ImageSharp.Image.Load(imagePath))
                {
                    // Determine the size of the square
                    int size = Math.Min(originalImage.Width, originalImage.Height);

                    // Calculate the coordinates for cropping centered on the actual center of the image
                    int x = (originalImage.Width - size) / 2;
                    int y = (originalImage.Height - size) / 2;

                    // Crop the image using ImageSharp
                    var croppedImage = originalImage.Clone(ctx => ctx.Crop(new SixLabors.ImageSharp.Rectangle(x, y, size, size)));

                    // Save the cropped image to a new file
                    croppedImagePath = Path.Combine(Path.GetTempPath(), "cropped_thumbnail.jpg");
                    croppedImage.Save(croppedImagePath);
                }

                // Replace the original file with the cropped one
                System.IO.File.Copy(croppedImagePath, imagePath, true);
            }
            catch (Exception ex)
            {
                LogRichTextBox.AppendText($"Error cropping album art: {ex.StackTrace}\n");
            }
        }

        private void ClearButton_Click(object sender, EventArgs e)
        {
            // Clear all textboxes and log
            URLTextBox.Clear();
            TitleTextBox.Clear();
            ArtistTextBox.Clear();
            AlbumTextBox.Clear();
            TrackNumberUpDown.Value = 0;
            LogRichTextBox.Clear();
        }
    }
}