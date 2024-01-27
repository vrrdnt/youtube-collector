jQuery(function ($) {
    let cropper;

    const myDropzone = new Dropzone("#conversionForm", {
        paramName: "image",
        maxFilesize: 5,
        acceptedFiles: 'image/*',
        addRemoveLinks: true,
        url: '/convert',
        init: function () {
            const cropperContainer = document.createElement('div');
            document.body.appendChild(cropperContainer);

            this.on("addedfile", function (file) {
                if (file.type.match(/image.*/)) {
                    const reader = new FileReader();
                    reader.onload = function (e) {
                        const image = new Image();
                        image.src = e.target.result;
                        image.onload = function () {
                            if (cropper) {
                                cropper.replace(image);
                            } else {
                                cropper = new Cropper(image, {
                                    aspectRatio: 1,
                                    viewMode: 1,
                                });
                            }
                        };
                    };
                    reader.readAsDataURL(file);
                }
            });

            this.on("removedfile", function () {
                if (cropper) {
                    cropper.destroy();
                }
                cropperContainer.innerHTML = '';
            });
        },
    });

    $(document).on('submit', '#conversionForm', function (e) {
        e.preventDefault();

        // Check if an image was uploaded
        if (cropper && typeof cropper.getCroppedCanvas === 'function') {
            const croppedImage = cropper.getCroppedCanvas().toDataURL();
            const blob = dataURItoBlob(croppedImage);
            const file = new File([blob], 'cropped_image.jpg');

            const formData = new FormData(this);
            formData.append('image', file);

            submitConversionForm(formData);
        } else {
            // If no image was uploaded, download and crop the highest-res thumbnail from the video
            const formData = new FormData(this);
            submitConversionForm(formData);
        }
    });

    function submitConversionForm(formData) {
        
        $('#result').html('Converting... please wait :-)').show();
        $.ajax({
            type: 'POST',
            url: '/convert',
            data: formData,
            processData: false,
            contentType: false,
            success: function (data) {
                console.log('Data received from server:', data);
            
                // Use the data returned from the server to set the download link
                const downloadLink = `/downloads/${encodeURIComponent(data.mp3FileName)}`;

                // Update the download link with the correct file name
                $('#result').html('Conversion completed!').show();
                $('#downloadLink').html(`<a href="${downloadLink}" download style="text-align: center;">Download MP3</a>`).show();
            },
            error: function (xhr, status, error) {
                console.error(xhr.responseText);
                alert('Conversion failed');
            }
        });
    }

    function dataURItoBlob(dataURI) {
        const byteString = atob(dataURI.split(',')[1]);
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        return new Blob([ab], { type: 'image/jpeg' });
    }
});
