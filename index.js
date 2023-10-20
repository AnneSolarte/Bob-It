const express = require('express');
const http = require("http")
const socketIO = require('socket.io');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');


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

//
app.use('/api', createProxyMiddleware({ target: 'http://localhost:3000', changeOrigin: true }));

// Todas las demás rutas se reenvían al cliente
app.use('/', createProxyMiddleware({ target: 'http://localhost:5173', changeOrigin: true }));


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

server.listen(8080, () => {
    console.log("Server listening at port 8080");
});