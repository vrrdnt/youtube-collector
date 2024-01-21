namespace youtube_collector
{
    partial class Form1
    {
        /// <summary>
        ///  Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        ///  Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        ///  Required method for Designer support - do not modify
        ///  the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            components = new System.ComponentModel.Container();
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(Form1));
            DescriptionLabel = new Label();
            URLTextBox = new TextBox();
            TitleTextBox = new TextBox();
            tableLayoutPanel1 = new TableLayoutPanel();
            DownloadButton = new Button();
            ClearButton = new Button();
            ArtistTextBox = new TextBox();
            AlbumTextBox = new TextBox();
            OpenFileDialogAlbumArt = new OpenFileDialog();
            saveFileDialogMP3File = new SaveFileDialog();
            AlbumArtButton = new Button();
            RequiredLabel = new Label();
            AlbumArtInfoLabel = new Label();
            LogLabel = new Label();
            LogRichTextBox = new RichTextBox();
            githubLinkLabel = new LinkLabel();
            TrackNumberUpDown = new NumericUpDown();
            toolTip1 = new ToolTip(components);
            TrackNumberLabel = new Label();
            tableLayoutPanel1.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)TrackNumberUpDown).BeginInit();
            SuspendLayout();
            // 
            // DescriptionLabel
            // 
            DescriptionLabel.Anchor = AnchorStyles.Top | AnchorStyles.Left | AnchorStyles.Right;
            DescriptionLabel.Location = new Point(200, 9);
            DescriptionLabel.Name = "DescriptionLabel";
            DescriptionLabel.Size = new Size(270, 48);
            DescriptionLabel.TabIndex = 1;
            DescriptionLabel.Text = "easily convert youtube videos to mp3 files with embedded tags :-)";
            DescriptionLabel.TextAlign = ContentAlignment.TopRight;
            // 
            // URLTextBox
            // 
            URLTextBox.Location = new Point(12, 11);
            URLTextBox.Margin = new Padding(3, 2, 3, 2);
            URLTextBox.Name = "URLTextBox";
            URLTextBox.PlaceholderText = "Enter YouTube URL *";
            URLTextBox.Size = new Size(172, 23);
            URLTextBox.TabIndex = 2;
            // 
            // TitleTextBox
            // 
            TitleTextBox.AllowDrop = true;
            TitleTextBox.Location = new Point(12, 38);
            TitleTextBox.Margin = new Padding(3, 2, 3, 2);
            TitleTextBox.Name = "TitleTextBox";
            TitleTextBox.PlaceholderText = "Title *";
            TitleTextBox.Size = new Size(172, 23);
            TitleTextBox.TabIndex = 3;
            // 
            // tableLayoutPanel1
            // 
            tableLayoutPanel1.Anchor = AnchorStyles.None;
            tableLayoutPanel1.ColumnCount = 2;
            tableLayoutPanel1.ColumnStyles.Add(new ColumnStyle(SizeType.Percent, 50F));
            tableLayoutPanel1.ColumnStyles.Add(new ColumnStyle(SizeType.Percent, 50F));
            tableLayoutPanel1.Controls.Add(DownloadButton, 0, 0);
            tableLayoutPanel1.Controls.Add(ClearButton, 0, 0);
            tableLayoutPanel1.Location = new Point(200, 338);
            tableLayoutPanel1.Name = "tableLayoutPanel1";
            tableLayoutPanel1.RowCount = 1;
            tableLayoutPanel1.RowStyles.Add(new RowStyle(SizeType.Percent, 50F));
            tableLayoutPanel1.RowStyles.Add(new RowStyle(SizeType.Percent, 50F));
            tableLayoutPanel1.Size = new Size(270, 36);
            tableLayoutPanel1.TabIndex = 4;
            // 
            // DownloadButton
            // 
            DownloadButton.Anchor = AnchorStyles.None;
            DownloadButton.Location = new Point(138, 3);
            DownloadButton.Name = "DownloadButton";
            DownloadButton.Size = new Size(129, 30);
            DownloadButton.TabIndex = 1;
            DownloadButton.Text = "Download";
            DownloadButton.UseVisualStyleBackColor = true;
            // 
            // ClearButton
            // 
            ClearButton.Anchor = AnchorStyles.None;
            ClearButton.Location = new Point(3, 3);
            ClearButton.Name = "ClearButton";
            ClearButton.Size = new Size(129, 30);
            ClearButton.TabIndex = 0;
            ClearButton.Text = "Clear";
            ClearButton.UseVisualStyleBackColor = true;
            // 
            // ArtistTextBox
            // 
            ArtistTextBox.AllowDrop = true;
            ArtistTextBox.Location = new Point(12, 65);
            ArtistTextBox.Margin = new Padding(3, 2, 3, 2);
            ArtistTextBox.Name = "ArtistTextBox";
            ArtistTextBox.PlaceholderText = "Artist";
            ArtistTextBox.Size = new Size(172, 23);
            ArtistTextBox.TabIndex = 6;
            // 
            // AlbumTextBox
            // 
            AlbumTextBox.AllowDrop = true;
            AlbumTextBox.Location = new Point(12, 92);
            AlbumTextBox.Margin = new Padding(3, 2, 3, 2);
            AlbumTextBox.Name = "AlbumTextBox";
            AlbumTextBox.PlaceholderText = "Album";
            AlbumTextBox.Size = new Size(172, 23);
            AlbumTextBox.TabIndex = 7;
            // 
            // OpenFileDialogAlbumArt
            // 
            OpenFileDialogAlbumArt.InitialDirectory = "%userprofile%/Downloads";
            OpenFileDialogAlbumArt.ShowPreview = true;
            OpenFileDialogAlbumArt.Title = "Album art";
            // 
            // saveFileDialogMP3File
            // 
            saveFileDialogMP3File.DefaultExt = "mp3";
            saveFileDialogMP3File.Filter = "MP3 Files (*.mp3)|*.MP3|All files (*.*)|*.*";
            saveFileDialogMP3File.InitialDirectory = "%userprofile%/Music";
            saveFileDialogMP3File.RestoreDirectory = true;
            // 
            // AlbumArtButton
            // 
            AlbumArtButton.Location = new Point(12, 147);
            AlbumArtButton.Name = "AlbumArtButton";
            AlbumArtButton.Size = new Size(172, 23);
            AlbumArtButton.TabIndex = 9;
            AlbumArtButton.Text = "Album art";
            AlbumArtButton.UseVisualStyleBackColor = true;
            // 
            // RequiredLabel
            // 
            RequiredLabel.AutoSize = true;
            RequiredLabel.ForeColor = SystemColors.ControlDark;
            RequiredLabel.Location = new Point(114, 173);
            RequiredLabel.Name = "RequiredLabel";
            RequiredLabel.Size = new Size(70, 15);
            RequiredLabel.TabIndex = 10;
            RequiredLabel.Text = "* = required";
            // 
            // AlbumArtInfoLabel
            // 
            AlbumArtInfoLabel.Font = new Font("Segoe UI", 8F);
            AlbumArtInfoLabel.ForeColor = SystemColors.ControlDark;
            AlbumArtInfoLabel.Location = new Point(12, 188);
            AlbumArtInfoLabel.Name = "AlbumArtInfoLabel";
            AlbumArtInfoLabel.Size = new Size(172, 171);
            AlbumArtInfoLabel.TabIndex = 11;
            AlbumArtInfoLabel.Text = resources.GetString("AlbumArtInfoLabel.Text");
            // 
            // LogLabel
            // 
            LogLabel.AutoSize = true;
            LogLabel.Font = new Font("Consolas", 9F, FontStyle.Regular, GraphicsUnit.Point, 0);
            LogLabel.Location = new Point(200, 43);
            LogLabel.Name = "LogLabel";
            LogLabel.Size = new Size(35, 14);
            LogLabel.TabIndex = 12;
            LogLabel.Text = "Log:";
            // 
            // LogRichTextBox
            // 
            LogRichTextBox.Font = new Font("Consolas", 7.8F, FontStyle.Regular, GraphicsUnit.Point, 0);
            LogRichTextBox.Location = new Point(200, 60);
            LogRichTextBox.Name = "LogRichTextBox";
            LogRichTextBox.Size = new Size(270, 272);
            LogRichTextBox.TabIndex = 13;
            LogRichTextBox.Text = "";
            // 
            // githubLinkLabel
            // 
            githubLinkLabel.ActiveLinkColor = Color.White;
            githubLinkLabel.AutoSize = true;
            githubLinkLabel.LinkColor = Color.ForestGreen;
            githubLinkLabel.Location = new Point(12, 359);
            githubLinkLabel.Name = "githubLinkLabel";
            githubLinkLabel.Size = new Size(99, 15);
            githubLinkLabel.TabIndex = 14;
            githubLinkLabel.TabStop = true;
            githubLinkLabel.Text = "made by @vrrdnt";
            toolTip1.SetToolTip(githubLinkLabel, "<3");
            githubLinkLabel.VisitedLinkColor = Color.ForestGreen;
            // 
            // TrackNumberUpDown
            // 
            TrackNumberUpDown.Location = new Point(114, 120);
            TrackNumberUpDown.Name = "TrackNumberUpDown";
            TrackNumberUpDown.Size = new Size(70, 23);
            TrackNumberUpDown.TabIndex = 16;
            toolTip1.SetToolTip(TrackNumberUpDown, "Track number");
            // 
            // TrackNumberLabel
            // 
            TrackNumberLabel.AutoSize = true;
            TrackNumberLabel.ForeColor = SystemColors.ControlDark;
            TrackNumberLabel.Location = new Point(12, 122);
            TrackNumberLabel.Name = "TrackNumberLabel";
            TrackNumberLabel.Size = new Size(79, 15);
            TrackNumberLabel.TabIndex = 17;
            TrackNumberLabel.Text = "Track number";
            // 
            // Form1
            // 
            AutoScaleDimensions = new SizeF(7F, 15F);
            AutoScaleMode = AutoScaleMode.Font;
            ClientSize = new Size(481, 382);
            Controls.Add(TrackNumberLabel);
            Controls.Add(TrackNumberUpDown);
            Controls.Add(githubLinkLabel);
            Controls.Add(LogRichTextBox);
            Controls.Add(LogLabel);
            Controls.Add(AlbumArtInfoLabel);
            Controls.Add(RequiredLabel);
            Controls.Add(AlbumArtButton);
            Controls.Add(AlbumTextBox);
            Controls.Add(ArtistTextBox);
            Controls.Add(tableLayoutPanel1);
            Controls.Add(TitleTextBox);
            Controls.Add(URLTextBox);
            Controls.Add(DescriptionLabel);
            FormBorderStyle = FormBorderStyle.FixedSingle;
            Icon = (Icon)resources.GetObject("$this.Icon");
            Margin = new Padding(3, 2, 3, 2);
            MaximizeBox = false;
            Name = "Form1";
            Text = "youtube-collector";
            tableLayoutPanel1.ResumeLayout(false);
            ((System.ComponentModel.ISupportInitialize)TrackNumberUpDown).EndInit();
            ResumeLayout(false);
            PerformLayout();
        }

        #endregion
        private Label DescriptionLabel;
        private TextBox URLTextBox;
        private TextBox TitleTextBox;
        private TableLayoutPanel tableLayoutPanel1;
        private Button ClearButton;
        private Button DownloadButton;
        private TextBox ArtistTextBox;
        private TextBox AlbumTextBox;
        private OpenFileDialog OpenFileDialogAlbumArt;
        private SaveFileDialog saveFileDialogMP3File;
        private Button AlbumArtButton;
        private Label RequiredLabel;
        private Label AlbumArtInfoLabel;
        private Label LogLabel;
        private RichTextBox LogRichTextBox;
        private LinkLabel githubLinkLabel;
        private NumericUpDown TrackNumberUpDown;
        private ToolTip toolTip1;
        private Label TrackNumberLabel;
    }
}
