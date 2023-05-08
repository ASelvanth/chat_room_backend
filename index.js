const dotenv = require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http'); //default http package
const { Server } = require('socket.io');

const app = express();
app.use(cors());

//ex for http socket connection
const server = http.createServer(app);

//socket connection
const io = new Server(server, {
    cors: {
      origin: "https://chat-room-fe.netlify.app",
      methods: ["GET", "POST"],
    },
  });

app.get('/',(req,res)=>{
    res.send("Chat App Home Page");
});

app.use(cors({
    origin: 'http://localhost:3000',
    credentials : true
}));


io.on('connection', (socket) => {

    socket.on('join-room', (data) => {
        socket.join(data);
        console.log(`user ${socket.id} has joined the room ${data}`);
    });

    socket.on('send-message', (data) => {
        console.log('Data: ', data );
        socket.to(data.room).emit('receive-message', data);
    } );

    socket.on('disconnect', () => {
        console.log('User Disconnected: ', socket.id);
    })
})

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`App is running on PORT ${PORT}`);
})