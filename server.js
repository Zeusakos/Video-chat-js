const express = require('express');
const { ExpressPeerServer } = require('peer');
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const {v4: uuid4v4} = require('uuid')
const peerServer = ExpressPeerServer(server,{
    debug:true
})

app.set('view engine','ejs')
app.use(express.static('public'))
app.use('/peerjs',peerServer)

app.get('/',(req,res)=>{
    res.redirect(`/${uuid4v4()}`)
})

app.get('/:room',(req,res)=>{
    res.render('room', {roomId:req.params.room})
})
app.get('/', (req, res) => {
    res.sendFile('views/room.ejs');
  });
  

io.on('connection', socket => {
    socket.on('join-room', (roomId, userId) => {
      socket.join(roomId)
      socket.to(roomId).emit('user-connected', userId);
      socket.on('disconnect', () => {
        socket.broadcast.to(roomId).emit('user-disconnected', userId)
      })
      // messages
      socket.on('message', (message) => {
        //send message to the same room
        io.to(roomId).emit('createMessage', message)
    }); 
   
  

      })
    })
  


server.listen(process.env.PORT || 3030)