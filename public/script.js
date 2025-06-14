const socket = io();
const lista = document.getElementById('lista-confesiones');
const form = document.getElementById('form-confesion');
const textarea = document.getElementById('texto');

const ES_ADMIN = true; // Cambia a false para visitantes
const ADMIN_PASSWORD = 'admin123'; // Cambia la contraseña que usas

socket.on('confesiones-iniciales', (confesiones) => {
  lista.innerHTML = '';
  confesiones.forEach(agregarElemento);
});

socket.on('confesion-agregada', (conf) => {
  agregarElemento(conf);
});

socket.on('confesion-eliminada', (id) => {
  const item = document.getElementById(`conf-${id}`);
  if (item) item.remove();
});

form.onsubmit = (e) => {
  e.preventDefault();
  const texto = textarea.value.trim();
  if (!texto) return;
  socket.emit('nueva-confesion', texto);
  textarea.value = '';
};

function agregarElemento(conf) {
  const li = document.createElement('li');
  li.id = `conf-${conf.id}`;
  li.textContent = conf.texto;

  if (ES_ADMIN) {
    const btn = document.createElement('button');
    btn.textContent = 'Eliminar';
    btn.onclick = () => {
      socket.emit('eliminar-confesion', {
        id: conf.id,
        password: ADMIN_PASSWORD
      });
    };
    li.appendChild(btn);
  }

  lista.appendChild(li);
}
