const socket = io();
const formulario = document.getElementById('formulario');
const texto = document.getElementById('texto');
const contenedor = document.getElementById('confesiones');

function mostrar(confesion) {
  const div = document.createElement('div');
  div.className = 'confesion';
  div.id = confesion.id;
  div.innerHTML = `
    ${confesion.texto}
    <button class="borrar" onclick="borrarConfesion('${confesion.id}')">X</button>
  `;
  contenedor.prepend(div);
}

function borrarConfesion(id) {
  const clave = prompt("Ingresa la contraseña para borrar:");
  if (clave !== 'borrar123') {
    alert("Contraseña incorrecta.");
    return;
  }

  fetch(`/confesiones/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': clave }
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

fetch('/confesiones')
  .then(res => res.json())
  .then(data => data.forEach(mostrar));

socket.on('nuevaConfesion', mostrar);
socket.on('confesionEliminada', id => {
  const div = document.getElementById(id);
  if (div) div.remove();
});
