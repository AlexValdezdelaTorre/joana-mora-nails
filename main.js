

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

  /* function mostrarGaleria(categoria) {
    const galerias = document.querySelectorAll('.imagenes-galeria');
    galerias.forEach(g => g.classList.add('oculto'));

    const galeriaSeleccionada = document.getElementById('galeria-' + categoria);
    galeriaSeleccionada.classList.remove('oculto');
  } */

    function abrirGaleria(categoria) {
    const modal = document.getElementById("modalGaleria");
    modal.style.display = "block";

    // Oculta todas las galerías
    const galerias = document.querySelectorAll(".imagenes-galeria");
    galerias.forEach(g => g.classList.add("oculto"));

    // Muestra la seleccionada
    const galeriaSeleccionada = document.getElementById("galeria-" + categoria);
    galeriaSeleccionada.classList.remove("oculto");
  }

  function cerrarGaleria() {
    document.getElementById("modalGaleria").style.display = "none";
  }

  // Cierra si hace clic fuera del modal
  window.onclick = function(event) {
    const modal = document.getElementById("modalGaleria");
    if (event.target === modal) {
      modal.style.display = "none";
    }
  }

  // Abrir imagen en lightbox
function abrirLightbox(src) {
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  lightboxImg.src = src;
  lightbox.classList.remove("oculto");
}

// Cerrar lightbox
function cerrarLightbox() {
  document.getElementById("lightbox").classList.add("oculto");
}

// Cerrar al hacer clic fuera de la imagen
window.addEventListener("click", function (e) {
  const lightbox = document.getElementById("lightbox");
  const img = document.getElementById("lightbox-img");
  if (e.target === lightbox && e.target !== img) {
    cerrarLightbox();
  }
});
