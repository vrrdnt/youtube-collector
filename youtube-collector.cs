using YoutubeExplode;
using YoutubeExplode.Exceptions;
using YoutubeExplode.Videos.Streams;
using YoutubeExplode.Common;
using TagLib;

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
            // Open OpenFileDialog to select album art from the user's computer
            if (OpenFileDialogAlbumArt.ShowDialog() == DialogResult.OK)
            {
                // Store the selected album art file path
                string selectedFilePath = OpenFileDialogAlbumArt.FileName;

                // Update the logic to handle the selected album art file
                HandleSelectedAlbumArt(selectedFilePath);
            }
        }
        private async void DownloadButton_Click(object sender, EventArgs e)
        {
            var youtube = new YoutubeClient();

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

                    // Download and move the audio stream to the new file path
                    await youtube.Videos.Streams.DownloadAsync(streamInfo, newPath);

                    if (string.IsNullOrEmpty(albumArtFilePath))
                    {
                        await DownloadThumbnailAsync(videoUrl);
                    }

                    LogRichTextBox.AppendText($"Downloaded and saved MP3 to: {newPath}\nAwaiting metadata\n");

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
                file.RemoveTags(TagTypes.Id3v2);

                // Write metadata tags
                file.Tag.Title = TitleTextBox.Text;
                file.Tag.Performers = new[] { ArtistTextBox.Text };
                file.Tag.Album = AlbumTextBox.Text;
                file.Tag.Track = (uint)TrackNumberUpDown.Value;


                // Embed album art
                if (!string.IsNullOrEmpty(albumArtPath))
                {
                    var picture = new Picture(albumArtPath);
                    file.Tag.Pictures = new IPicture[] { picture };
                }

                // LogRichTextBox.AppendText($"Title: {file.Tag.Title}\n");
                // LogRichTextBox.AppendText($"Artist: {file.Tag.Performers}\n");
                // LogRichTextBox.AppendText($"Album: {file.Tag.Album}\n");
                // LogRichTextBox.AppendText($"Track #: {file.Tag.Track}\n");
                // LogRichTextBox.AppendText($"Album art: ${file.Tag.Pictures[0]}");

                // Save changes
                file.Save();

                LogRichTextBox.AppendText("All metadata written to file\n");
            }
            catch (Exception ex)
            {
                LogRichTextBox.AppendText($"Error writing tags: {ex.Message}\n");
            }
        }

        private async Task<string> DownloadThumbnailAsync(string videoUrl)
        {
            var youtube = new YoutubeClient();

            try
            {
                var video = await youtube.Videos.GetAsync(videoUrl);
                var thumbnail = video.Thumbnails.TryGetWithHighestResolution();

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
                    HandleSelectedAlbumArt(thumbnailPath);

                    return thumbnailPath;
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

        private void HandleSelectedAlbumArt(string selectedFilePath)
        {
            // Store the selected album art file path
            albumArtFilePath = selectedFilePath;

            // Implement cropping logic to make the image square
            CropAlbumArt(selectedFilePath);
        }

        private void CropAlbumArt(string imagePath)
        {
            try
            {
                // Load the image
                using (var originalImage = Image.FromFile(imagePath))
                {
                    // Determine the size of the square
                    int size = Math.Min(originalImage.Width, originalImage.Height);

                    // Create a rectangle for the square
                    var squareRectangle = new Rectangle(0, 0, size, size);

                    // Create a new bitmap with the square size
                    using (var croppedImage = new Bitmap(size, size))
                    {
                        // Create a graphics object to draw the cropped image
                        using (var graphics = Graphics.FromImage(croppedImage))
                        {
                            // Crop the original image to the square size
                            graphics.DrawImage(originalImage, squareRectangle, squareRectangle, GraphicsUnit.Pixel);
                        }

                        // Save the cropped image back to the original file
                        croppedImage.Save(imagePath, originalImage.RawFormat);
                    }
                }
            }
            catch (Exception ex)
            {
                LogRichTextBox.AppendText($"Error cropping album art: {ex.Message}\n");
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