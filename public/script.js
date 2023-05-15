document.getElementById('download-form').addEventListener('submit', function (event) {
    event.preventDefault();
    const urlInput = document.getElementById('url');
    const url = urlInput.value.trim();
  
    if (url !== '') {
      downloadMP3(url);
      urlInput.value = '';
    }
  });
  
  function downloadMP3(url) {
    const downloadForm = document.createElement('form');
    downloadForm.action = '/download';
    downloadForm.method = 'POST';
  
    const urlInput = document.createElement('input');
    urlInput.type = 'hidden';
    urlInput.name = 'url';
    urlInput.value = url;
  
    downloadForm.appendChild(urlInput);
    document.body.appendChild(downloadForm);
    downloadForm.submit();
  }
  