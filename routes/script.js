const fileInput = document.getElementById('fileInput');
fileInput.addEventListener('change', () => {
  const file = fileInput.files[0];
  const reader = new FileReader();
  reader.onload = () => {
    socket.emit('file-upload', { name: file.name, content: reader.result });
  };
  reader.readAsDataURL(file);
});

socket.on('file-share', data => {
  const a = document.createElement('a');
  a.href = data.content;
  a.download = data.name;
  a.textContent = `Download ${data.name}`;
  document.body.appendChild(a);
});
