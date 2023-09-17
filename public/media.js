const { peer } = require('./peer');

let myVideoStream;
let mediaRecorder;
const MAXIMUM_MESSAGE_SIZE = 65535;
const END_OF_FILE_MESSAGE = 'EOF';
const parts = [];

// Get the user's media stream (audio and video)
navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true,
}).then((stream) => {
    myVideoStream = stream;
    // Add user's own video stream to the page
    addVideoStream(myVideo, stream);

    // Handle incoming calls from other users
    peer.on('call', (call) => {
        call.answer(stream);
        const video = createVideoElement();
        call.on('stream', (userVideoStream) => {
            addVideoStream(video, userVideoStream);
        });
    });

    // Set up recording when the button is clicked
    document.getElementById('btn').onclick = startRecording;
});

// Create a video element for displaying video streams
function createVideoElement() {
    const video = document.createElement('video');
    video.autoplay = true;
    return video;
}

// Add a video stream to the video grid
function addVideoStream(video, stream) {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
        video.play();
    });
    videoGrid.appendChild(video);
}

// Start recording the user's video stream
function startRecording() {
    mediaRecorder = new MediaRecorder(myVideoStream);
    mediaRecorder.start(1000);
    alert('Recording initiated');
    mediaRecorder.ondataavailable = handleDataAvailable;
}

// Handle recorded data when available
function handleDataAvailable(e) {
    parts.push(e.data);
}

module.exports = {
    createVideoElement,
    addVideoStream,
    startRecording,
    handleDataAvailable,
};