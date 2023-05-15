const dotenv = require('dotenv').config();
const express = require("express");
const app = express();
const http = require("http"); //default http package
const cors = require("cors"); 
const { Server } = require("socket.io");

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

io.on('connection', (socket) => {
    console.log(`User Connected: ${socket.id}`);    
    
    socket.on("join_room", (data) => {
        socket.join(data);
        console.log(`User with ID: ${socket.id} joined room: ${data}`);
      });
    
      socket.on("send_message", (data) => {
        socket.to(data.room).emit("receive_message", data);
      });
    
      socket.on("disconnect", () => {
        console.log("User Disconnected", socket.id);
      });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`App is running on PORT ${PORT}`);
})