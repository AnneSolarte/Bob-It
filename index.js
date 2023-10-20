const express = require('express');
const http = require("http")
const socketIO = require('socket.io');
const cors = require('cors');


const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: "*",  
    methods: ["GET", "POST"],
    credentials: true
  }
});

app.use(cors()); 

io.on('connect', (socket) => {
    console.log("Client connected")

    socket.on("send-item", (user) => {
        console.log('User pressed:', user);
        
        // Evento a todos los otros jugadores, excepto al que envió el mensaje original.
        socket.broadcast.emit("other-player-pressed", user);
    })

    socket.on("disconnect", (socket) => {
        console.log("Client disconnected")
    })
});

server.listen(3000, () => {
    console.log("Server listening at port 3000");
});