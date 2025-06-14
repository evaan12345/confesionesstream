const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

let confesiones = [];
let nextId = 1;

app.use(express.static('public'));
app.use(express.json());

io.on('connection', (socket) => {
  socket.emit('confesiones-iniciales', confesiones);

  socket.on('nueva-confesion', (texto) => {
    const nueva = { id: nextId++, texto };
    confesiones.push(nueva);
    io.emit('confesion-agregada', nueva);
  });

  socket.on('eliminar-confesion', ({ id, password }) => {
    if (password !== ADMIN_PASSWORD) return;
    confesiones = confesiones.filter(c => c.id !== id);
    io.emit('confesion-eliminada', id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
