// Import required modules
const socket = io('/');
const videoGrid = document.getElementById('video-grid');
const chat = document.getElementById('chat');

// Import other modules
const { setupSocketConnection } = require('./socket');
const { setupMediaRecorder, createVideoElement, addVideoStream } = require('./media');
const { setupChat } = require('./chat');
const { setupVideoControls, toggleAudio, toggleVideo, shareScreen, toggleChat } = require('./video-controls');
const { peer, connectToNewUser } = require('./peer');

// Create a video element for displaying the user's video
const myVideo = createVideoElement();

// Main entry point code
setupSocketConnection(socket);
setupMediaRecorder(myVideo);
setupChat();
setupVideoControls(myVideo, peer);

// Helper function to create a video element
function createVideoElement() {
    const video = document.createElement('video');
    video.muted = true;
    return video;
}

// Handle user connection events
socket.on('user-connected', (userId) => {
    setTimeout(() => {
        connectToNewUser(userId, myVideoStream);
    }, 1000);
});

// Get the user's media stream (audio and video)
let myVideoStream;
navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true,
}).then((stream) => {
    myVideoStream = stream;
    addVideoStream(myVideo, stream);

    peer.on('call', (call) => {
        call.answer(stream);
        const video = createVideoElement();
        call.on('stream', (userVideoStream) => {
            addVideoStream(video, userVideoStream);
        });
    });

    document.getElementById('btn').onclick = () => {
        toggleAudio(); // Toggle audio mute/unmute
    };

    document.getElementById('btn-video').onclick = () => {
        toggleVideo(); // Toggle video start/stop
    };

    document.getElementById('btn-share-screen').onclick = () => {
        shareScreen(); // Start screen sharing
    };

    document.getElementById('btn-toggle-chat').onclick = () => {
        toggleChat(); // Show/hide chat window
    };
});
