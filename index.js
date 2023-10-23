const express = require('express');
const http = require("http")
const socketIO = require('socket.io');
const cors = require('cors');



const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors()); 

let playersWaiting = 0;
let firstPressed = false;
let colors = ['red', 'magenta', 'yellow', 'bopIt', 'orange', 'blue'];
function randomColor() {
  const index = Math.floor(Math.random() * colors.length);
  return colors[index];
}
let currentColor = randomColor();

app.get('/', (req, res) => {
  res.send('¡Hola Mundo!');
});


io.on('connect', (socket) => {
    console.log("Client connected:" );
    
    console.log("players waiting:",playersWaiting)
    

  socket.on('players-waiting', () => {
      playersWaiting++;
      console.log("players waiting:",playersWaiting )
      
      if (playersWaiting == 2) { 
          io.emit('go-to-main-screen');
          io.emit('start-timer');
          io.emit('color', currentColor)
          playersWaiting = 0; // Reset para próximas conexiones
      }
  });

    socket.on("generate-new-color", () => { // Escuchar una solicitud de un nuevo color
      currentColor = randomColor(); // Generar un nuevo color
      io.emit('color', currentColor); // Emitir el nuevo color a todos los clientes conectados
    });

    socket.on("send-item", (user) => {
        if (!firstPressed) {
            firstPressed = true;
            io.emit('first-player-pressed', user); // Emitir a todos los jugadores
        }
        console.log('User pressed:', user);
        socket.broadcast.emit("other-player-pressed", user);
    })

    socket.on("disconnect", () => {
        console.log("Client disconnected");
        playersWaiting = 0;
    })
});

server.listen(3000, () => {
  console.log("Server listening at port 3000");
});
