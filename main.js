

 function mostrarNombreArchivo() {
    const input = document.getElementById('imagenDiseno');
    const nombreArchivo = input.files.length > 0 ? input.files[0].name : 'Adjuntar imagen de diseño';
    document.getElementById('file-name').textContent = nombreArchivo;
  }

  function abrirModal() {
    document.getElementById("modalGuia").style.display = "block";
  }

  function cerrarModal() {
    document.getElementById("modalGuia").style.display = "none";
  }

  window.onclick = function(event) {
    const modal = document.getElementById("modalGuia");
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }