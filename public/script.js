const socket = io('/')
const videoGrid=document.getElementById('video-grid')
const myVideo = document.createElement('video');
const chat = document.getElementById('chat')
chat.hidden = true;
myVideo.muted = true;
let peerConnection
var peerList = [];
var currentPeer=[]
const MAXIMUM_MESSAGE_SIZE = 65535;
const END_OF_FILE_MESSAGE = 'EOF';
let file;

var peer = new Peer(undefined,{
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
})
const parts =[]
let peers = {}
let myVideoStream
let userVideoStream
let mediaRecorder
var getUserMedia=
navigator.getUserMedia||
navigator.webkitGetUserMedia||
navigator.mozGetUsermedia;
navigator.mediaDevices.getUserMedia({
    video:true,
    audio:true
}).then(stream =>{
    myVideoStream = stream
    addVideoStream(myVideo,stream)
    peer.on('call',call=>{
        call.answer(stream)
        const video = document.createElement('video')
        currentPeer.push(call.peerConnection);
        call.on('stream',userVideoStream=>{
            if (!peerList.includes(call.peer)) {
                addVideoStream(video, userVideoStream);
                peerList.push(call.peer);
            }
        })
      
    })
    document.getElementById("btn").onclick = function() {
        mediaRecorder = new MediaRecorder (stream)
        mediaRecorder.start(1000);
        alert("Recording initiated")
        mediaRecorder.ondataavailabe = function(e){
            parts.push(e.data);
        }
    }

    socket.on('user-connected', userId => {
        // user is joining`
        setTimeout(() => {
        // user joined
        connectToNewUser(userId, stream)
        }, 1000)
        })


        let text = $("input")
        $('html').keydown((e)=>{
            if(e.which == 13 && text.val().length !==0){
                socket.emit('message',text.val())
                text.val('')
            }
        })
        
        socket.on('createMessage',message =>{
            $('.messages').append(`<li class="message"><b>user</b><br/>${message}</li>`)
            scrolltoBottom()
        })
        })

socket.on('user-disconected', userId =>{
    if(peers[userId]) {
    peers[userId].close();
        }
        })

peer.on('open',id =>{
    socket.emit('join-room',ROOM_ID,id)
})

const connectToNewUser= (userId,stream)=>{
    const call = peer.call(userId,stream)
    const video = document.createElement('video')
    call.on('stream',userVideoStream=>{
    addVideoStream(video,userVideoStream)
    })
    call.on("user-disconnected", ()=>{
        video.remove();
   })
   peers[userId] = call;
      currentPeer.push(call.peerConnection);
    }


   
    

const addVideoStream = (video,stream) =>{
    video.srcObject = stream;
    video.addEventListener("loadedmetadata",()=>{
        video.play();
    })

videoGrid.append(video);

    }
    

const scrolltoBottom = () => {
    var d = $('.main__chat__window')
    d.scrollTop(d.prop("scrollHeight"))
}
//MUTE UNMUTE
const muteUnmute = () => {
    const enabled = myVideoStream.getAudioTracks()[0].enabled;
    if (enabled){
        myVideoStream.getAudioTracks()[0].enabled = false;
        setUnmuteButton();
    }else{
        setMuteButton();
        myVideoStream.getAudioTracks()[0].enabled=true;
    }
}


const setMuteButton = () => {
    const html= `<i class="fas fa-microphone"></i>
    <span>Mute</span>`

    document.querySelector('.main__mute__button').innerHTML = html;
    
}


const setUnmuteButton = () => {
    const html= `<i class="unmute fas fa-microphone-slash"></i>
    <span>Unmute</span>`

    document.querySelector('.main__mute__button').innerHTML = html;
    
}

//STOP VIDEO

const playStop = () =>{
    let enabled = myVideoStream.getVideoTracks()[0].enabled;
    if (enabled){
        myVideoStream.getVideoTracks()[0].enabled = false;
        setPlayVideo()
    }else{
        setStopVideo()
        myVideoStream.getVideoTracks()[0].enabled = true;
    }
}
const setStopVideo = () => {
    const html = `<i class="fas fa-video"></i>
    <span>Play Video</span>
    `
    document.querySelector('.main__video__button').innerHTML=html;
}

const setPlayVideo = () => {
    const html = `<i class="stop fas fa-video-slash"></i>
    <span>Stop Video</span>
    `
    document.querySelector('.main__video__button').innerHTML=html;
}
const showchat = () => { 
    if (chat.hidden == false) { 
        chat.hidden = true;
    } else {
        chat.hidden = false; 
    }
}

document.getElementById("stopbtn").onclick = function() {
    mediaRecorder.stop();
    const blob = new Blob(parts,{
        type:"video/webm"
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display:none";
    a.href = url;
    a.download = "test.webm"
    a.click(); 
}



let capturestream= null

  
 const screenshare = async () => {
    capturestream = navigator.mediaDevices.getDisplayMedia({
        video: {
           cursor: 'always'
        },
        audio: {
         echoCancellation: true,
              noiseSupprission: true
         }
       }).then(capturestream => {

       let videoTrack = capturestream.getVideoTracks()[0];
       for (let x=0;x<currentPeer.length;x++){
          let sender = currentPeer[x].getSenders().find(function(s) {
               return s.track.kind == videoTrack.kind;
            })
           sender.replaceTrack(videoTrack);
       }

          videoTrack.onended = function() {
            let videoTrack = myVideoStream.getVideoTracks()[0];
  for (let x=0;x<currentPeer.length;x++){
          let sender = currentPeer[x].getSenders().find(function(s){
              return s.track.kind == videoTrack.kind;
            }) 
          sender.replaceTrack(videoTrack);
             }       
      }
    })
      
   }
   


const shareFile = () => {
    if (file) {
        const channelLabel = file.name;
        const channel = peer.createDataChannel(channelLabel);
        channel.binaryType = 'arraybuffer';
    
        channel.onopen = async () => {
          const arrayBuffer = await file.arrayBuffer();
          for (let i = 0; i < arrayBuffer.byteLength; i += MAXIMUM_MESSAGE_SIZE) {
            channel.send(arrayBuffer.slice(i, i + MAXIMUM_MESSAGE_SIZE));
          }
          channel.send(END_OF_FILE_MESSAGE);
        };
    
        channel.onclose = () => {
          closeDialog();
        };
       }
    };
    const closeDialog = () => {
        document.getElementById('select-file-input').value = '';
        document.getElementById('select-file-dialog').style.display = 'none';
      };
      
      const downloadFile = (blob, fileName) => {
        const a = document.createElement('a');
        const url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = fileName;
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove()
      };


      document.getElementById('share-file-button').addEventListener('click', () => {
        document.getElementById('select-file-dialog').style.display = 'block';
      });
      
      document.getElementById('cancel-button').addEventListener('click', () => {
              closeDialog()
      })
      
      document.getElementById('select-file-input').addEventListener('change', (event) => {
        file = event.target.files[0];
        document.getElementById('ok-button').disabled = !file;
      });
      document.getElementById('ok-button').addEventListener('click', () => {
          shareFile();
      })


        channel.addEventListener("open", (event) => {
        const { channel } = event;
        channel.binaryType = 'arraybuffer';
      
        const receivedBuffers = [];
        channel.onmessage = async (event) => {
          const { data } = event;
          try {
            if (data !== END_OF_FILE_MESSAGE) {
              receivedBuffers.push(data);
            } else {
              const arrayBuffer = receivedBuffers.reduce((acc, arrayBuffer) => {
                const tmp = new Uint8Array(acc.byteLength + arrayBuffer.byteLength);
                tmp.set(new Uint8Array(acc), 0);
                tmp.set(new Uint8Array(arrayBuffer), acc.byteLength);
                return tmp;
              }, new Uint8Array());
              const blob = new Blob([arrayBuffer]);
              downloadFile(blob, channel.label);
              channel.close();
            }
          } catch (err) {
            console.log('File transfer failed');
          }
        };
       
      })