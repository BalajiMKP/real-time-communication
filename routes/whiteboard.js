const canvas = document.getElementById('whiteboard');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 400;
let drawing = false;

canvas.addEventListener('mousedown', () => drawing = true);
canvas.addEventListener('mouseup', () => drawing = false);

canvas.addEventListener('mousemove', (e) => {
  if (!drawing) return;
  const x = e.offsetX;
  const y = e.offsetY;
  ctx.fillRect(x, y, 2, 2);
  socket.emit('whiteboard-draw', { x, y });
});

socket.on('draw-data', ({ x, y }) => {
  ctx.fillRect(x, y, 2, 2);
});
