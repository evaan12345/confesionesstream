const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');
const cookieParser = require('cookie-parser');

const ADMIN_PASSWORD = 'borrar123';
let confesiones = [];

app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));

function esAdmin(req) {
  return req.cookies && req.cookies.admin === 'true';
}

app.post('/login', (req, res) => {
  const { password } = req.body;
  if (password === ADMIN_PASSWORD) {
    res.cookie('admin', 'true', { httpOnly: true });
    res.json({ ok: true });
  } else {
    res.status(401).json({ error: 'Contraseña incorrecta' });
  }
});

app.get('/logout', (req, res) => {
  res.clearCookie('admin');
  res.json({ ok: true });
});

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
  if (!esAdmin(req)) {
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
