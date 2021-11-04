function startAssessment() {
 





    let preview = document.getElementById("preview");
    let recording = document.getElementById("recording");
    let startButton = document.getElementById("start");
    let stopButton = document.getElementById("stop");
    var formData = new FormData();
    let recordingTimeMS = 5000;
    
    function wait(delayInMS) {
        return new Promise(resolve => setTimeout(resolve, delayInMS));
    }
    function startRecording(stream, lengthInMS) {
        let recorder = new MediaRecorder(stream);
        let data = [];
        recorder.ondataavailable = event => data.push(event.data);
        recorder.start();
        let stopped = new Promise((resolve, reject) => {
            recorder.onstop = resolve;
            recorder.onerror = event => reject(event.name);
        });
        let recorded = wait(lengthInMS).then(
            () => recorder.state == "recording" && recorder.stop()
        );
        return Promise.all([
            stopped,
            recorded
        ])
            .then(() => data);
    }
    function stop(stream) {
        stream.getTracks().forEach(track => track.stop());
    }




    startButton.addEventListener("click", function () {
        
         navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
        }).then(stream => {
            preview.srcObject = stream;
            preview.captureStream = preview.captureStream || preview.mozCaptureStream;
            return new Promise(resolve => preview.onplaying = resolve);
        }).then(() => startRecording(preview.captureStream(), recordingTimeMS))
            .then(recordedChunks => {
                let recordedBlob = new Blob(recordedChunks, {
                    type: "video/webm"
                });
                recording.src = URL.createObjectURL(recordedBlob);
                formData.append('video', recordedBlob);
            }).catch(log)
        function log(msg) {
            alert(msg);
            return;
        }
    }, false);




    stopButton.addEventListener("click", function () {

        stop(preview.srcObject);
    }, false);
 














}









// Once page is ready do this =>
document.addEventListener("DOMContentLoaded", function (event) {
    startAssessment()
});