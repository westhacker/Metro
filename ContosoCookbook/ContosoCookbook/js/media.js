(function () {
    "use strict";

    var dtm = Windows.ApplicationModel.DataTransfer.DataTransferManager;
    var capture = Windows.Media.Capture;

    WinJS.Namespace.define("media", {
        shareFile: null, // Photo or video to be shared

        sharePhoto: function () {
            var camera = new capture.CameraCaptureUI();

            // Capture a photo and display the share UI
            camera.captureFileAsync(capture.CameraCaptureUIMode.photo)
    .then(function (file) {
        if (file != null) {
            media.shareFile = file;
            dtm.showShareUI();
        }
    });
        },


        shareVideo: function () {
            var camera = new capture.CameraCaptureUI();
            camera.videoSettings.format = capture.CameraCaptureUIVideoFormat.wmv;

            // Capture a video and display the share UI
            camera.captureFileAsync(capture.CameraCaptureUIMode.video)
    .then(function (file) {
        if (file != null) {
            media.shareFile = file;
            dtm.showShareUI();
        }
    });
        }

    });
})();
