const peerConfig = {
    config :{
        iceServers: [{
            urls: [ "stun:fr-turn1.xirsys.com" ]
         }, {
            username: "oLHvLNCvu_5EUvw4969dCmVenxDHtph9QbCt_kPudCUxp3tTQbznQ1EtdsAR4diBAAAAAGHz0X1aZXVzMTM0",
            credential: "4cb25b9c-802c-11ec-95f2-0242ac120004",
            urls: [
                "turn:fr-turn1.xirsys.com:80?transport=udp",
                "turn:fr-turn1.xirsys.com:3478?transport=udp",
                "turn:fr-turn1.xirsys.com:80?transport=tcp",
                "turn:fr-turn1.xirsys.com:3478?transport=tcp",
                "turns:fr-turn1.xirsys.com:443?transport=tcp",
                "turns:fr-turn1.xirsys.com:5349?transport=tcp"
            ]
         }]
        }
};

const peer = new Peer(undefined, peerConfig);

peer.on('open', (id) => {
    socket.emit('join-room', ROOM_ID, id);
});

peer.on('call', (call) => {
    // Handle incoming calls
    call.answer(myVideoStream);
    const video = createVideoElement();
    call.on('stream', (userVideoStream) => {
        addVideoStream(video, userVideoStream);
    });
    call.on('close', () => {
        video.remove();
    });
});

function connectToNewUser(userId, stream) {
    const call = peer.call(userId, stream);
    const video = createVideoElement();
    call.on('stream', (userVideoStream) => {
        addVideoStream(video, userVideoStream);
    });
    call.on('close', () => {
        video.remove();
    });
}

function createVideoElement() {
    const video = document.createElement('video');
    video.autoplay = true;
    return video;
}

module.exports = {
    peer,
    connectToNewUser,
};