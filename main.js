// Mostrar el nombre del archivo seleccionado
function mostrarNombreArchivo() {
  const input = document.getElementById('imagenDiseno');
  const nombreArchivo = input.files.length > 0 ? input.files[0].name : 'Adjuntar imagen de diseño';
  const nombreSpan = document.getElementById('file-name');
  if (nombreSpan) nombreSpan.textContent = nombreArchivo;
}

// Abrir y cerrar el modal de la guía
function abrirModal() {
  const modal = document.getElementById("modalGuia");
  if (modal) modal.style.display = "block";
}

function cerrarModal() {
  const modal = document.getElementById("modalGuia");
  if (modal) modal.style.display = "none";
}

// Abrir galería por categoría
function abrirGaleria(categoria) {
  const modal = document.getElementById("modalGaleria");
  if (modal) modal.style.display = "block";

  document.querySelectorAll(".imagenes-galeria").forEach(g => g.classList.add("oculto"));

  const galeriaSeleccionada = document.getElementById("galeria-" + categoria);
  if (galeriaSeleccionada) galeriaSeleccionada.classList.remove("oculto");
}

function cerrarGaleria() {
  const modal = document.getElementById("modalGaleria");
  if (modal) modal.style.display = "none";
}

// Abrir imagen en lightbox
function abrirLightbox(src) {
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  if (lightbox && lightboxImg) {
    lightboxImg.src = src;
    lightbox.classList.remove("oculto");
  }
}

// Cerrar lightbox
function cerrarLightbox() {
  const lightbox = document.getElementById("lightbox");
  if (lightbox) lightbox.classList.add("oculto");
}

// Manejo global de clics para cerrar modales al hacer clic fuera
window.addEventListener("click", function (event) {
  const modalGuia = document.getElementById("modalGuia");
  const modalGaleria = document.getElementById("modalGaleria");
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");

  if (event.target === modalGuia) cerrarModal();
  if (event.target === modalGaleria) cerrarGaleria();
  if (event.target === lightbox && event.target !== lightboxImg) cerrarLightbox();
});
