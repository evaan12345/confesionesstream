const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');

let confesiones = [];

app.use(express.json());
app.use(express.static('public'));

app.get('/confesiones', (req, res) => {
  res.json(confesiones);
});

app.post('/confesiones', (req, res) => {
  const confesion = { id: Date.now().toString(), texto: req.body.texto };
  confesiones.push(confesion);
  io.emit('nuevaConfesion', confesion);
  res.status(201).json(confesion);
});

app.delete('/confesiones/:id', (req, res) => {
  const auth = req.headers.authorization;
  const PASSWORD = 'borrar123';

  if (auth !== PASSWORD) {
    return res.status(401).json({ error: 'No autorizado' });
  }

  const id = req.params.id;
  confesiones = confesiones.filter(c => c.id !== id);
  io.emit('confesionEliminada', id);
  res.sendStatus(200);
});

io.on('connection', socket => {
  console.log('Usuario conectado');
});

http.listen(process.env.PORT || 3000, () => {
  console.log('Servidor corriendo...');
});
