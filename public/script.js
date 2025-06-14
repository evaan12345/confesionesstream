const socket = io();
const formulario = document.getElementById('formulario');
const texto = document.getElementById('texto');
const contenedor = document.getElementById('confesiones');
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');

let admin = false;

function mostrar(confesion) {
  const div = document.createElement('div');
  div.className = 'confesion';
  div.id = confesion.id;
  div.innerHTML = `
    ${confesion.texto}
    ${admin ? `<button class="borrar" onclick="borrarConfesion('${confesion.id}')">X</button>` : ''}
  `;
  contenedor.prepend(div);
}

function borrarConfesion(id) {
  fetch(`/confesiones/${id}`, { method: 'DELETE' })
    .then(res => {
      if (!res.ok) alert("No autorizado para borrar.");
    });
}

formulario.addEventListener('submit', e => {
  e.preventDefault();
  if (texto.value.trim()) {
    fetch('/confesiones', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ texto: texto.value.trim() })
    });
    texto.value = '';
  }
});

loginBtn.addEventListener('click', () => {
  const pwd = prompt("Contraseña de administrador:");
  fetch('/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password: pwd })
  })
    .then(res => res.json())
    .then(data => {
      if (data.ok) {
        admin = true;
        cargarConfesiones();
      } else {
        alert("Contraseña incorrecta.");
      }
    });
});

logoutBtn.addEventListener('click', () => {
  fetch('/logout')
    .then(() => {
      admin = false;
      cargarConfesiones();
    });
});

function cargarConfesiones() {
  contenedor.innerHTML = '';
  fetch('/confesiones')
    .then(res => res.json())
    .then(data => data.forEach(mostrar));
}

cargarConfesiones();

socket.on('nuevaConfesion', mostrar);
socket.on('confesionEliminada', id => {
  const div = document.getElementById(id);
  if (div) div.remove();
});
