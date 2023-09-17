// Import necessary modules and objects
const { peer } = require('./peer');

// Function to mute/unmute audio
function toggleAudio() {
    const enabled = myVideoStream.getAudioTracks()[0].enabled;
    myVideoStream.getAudioTracks()[0].enabled = !enabled;
}

// Function to start/stop video
function toggleVideo() {
    const enabled = myVideoStream.getVideoTracks()[0].enabled;
    myVideoStream.getVideoTracks()[0].enabled = !enabled;
}

// Function to share the screen
async function shareScreen() {
    try {
        const stream = await navigator.mediaDevices.getDisplayMedia({
            video: {
                cursor: 'always',
            },
            audio: {
                echoCancellation: true,
                noiseSuppression: true,
            },
        });

        // Replace the video track in all peer connections with the screen sharing stream
        const videoTrack = stream.getVideoTracks()[0];
        for (const peerConnection of currentPeer) {
            const sender = peerConnection.getSenders().find((s) => s.track.kind === videoTrack.kind);
            sender.replaceTrack(videoTrack);
        }

        // Handle when screen sharing ends
        videoTrack.onended = () => {
            // Replace the video track in all peer connections with the user's camera stream
            const cameraStream = myVideoStream.getVideoTracks()[0];
            for (const peerConnection of currentPeer) {
                const sender = peerConnection.getSenders().find((s) => s.track.kind === cameraStream.kind);
                sender.replaceTrack(cameraStream);
            }
        };
    } catch (error) {
        console.error('Error sharing screen:', error);
    }
}

// Function to show/hide the chat window
function toggleChat() {
    const chat = document.getElementById('chat');
    chat.hidden = !chat.hidden;
}

module.exports = {
    toggleAudio,
    toggleVideo,
    shareScreen,
    toggleChat,
};