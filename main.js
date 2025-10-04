// === Nombre de archivo seleccionado ===

function mostrarNombreArchivo() {
  const input = document.getElementById('imagenDiseno');
  const nombreArchivo = input && input.files.length > 0
    ? input.files[0].name
    : 'Ningún archivo seleccionado';
  const nombreSpan = document.getElementById('file-name');
  if (nombreSpan) nombreSpan.textContent = nombreArchivo;
}
document.getElementById('imagenDiseno')?.addEventListener('change', mostrarNombreArchivo);

// === Modal guía ===
function abrirModal() {
  const modal = document.getElementById('modalGuia');
  if (modal) {
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
  }
}
function cerrarModal() {
  const modal = document.getElementById('modalGuia');
  if (modal) {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
  }
}

// === Galería: un solo botón / un solo contenedor ===
const btnGaleria = document.getElementById('btnGaleria');
const modalGaleria = document.getElementById('modalGaleria');
const btnCerrarGaleria = document.getElementById('btnCerrarGaleria');

function abrirGaleria() {
  // Oculta cualquier otra galería por si quedaron restos
  document.querySelectorAll('.imagenes-galeria').forEach(g => g.classList.add('oculto'));
  document.getElementById('galeria-todas')?.classList.remove('oculto');

  modalGaleria?.classList.add('is-open');
  modalGaleria?.setAttribute('aria-hidden', 'false');

  document.documentElement.classList.add('no-scroll');
  document.body.classList.add('no-scroll');

}

function cerrarGaleria() {
  modalGaleria?.classList.remove('is-open');
  modalGaleria?.setAttribute('aria-hidden', 'true');

  document.documentElement.classList.remove('no-scroll');
  document.body.classList.remove('no-scroll');

}

// Listeners de abrir/cerrar
btnGaleria?.addEventListener('click', abrirGaleria);
btnCerrarGaleria?.addEventListener('click', cerrarGaleria);


window.addEventListener('click', (e) => {
  const modalGuia = document.getElementById('modalGuia');
  const modalGaleria = document.getElementById('modalGaleria');
  if (e.target === modalGuia) cerrarModal();
  if (e.target === modalGaleria) cerrarGaleria();
});

// Cerrar con ESC
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    cerrarModal();
    cerrarGaleria();
    cerrarLightbox();
  }
});

// === Lightbox ===
function abrirLightbox(src) {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  if (lightbox && lightboxImg) {
    lightboxImg.src = src;
    lightbox.classList.remove('oculto');
  }
}
function cerrarLightbox() {
  const lightbox = document.getElementById('lightbox');
  if (lightbox) lightbox.classList.add('oculto');
}
window.addEventListener('click', function (event) {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  if (event.target === lightbox && event.target !== lightboxImg) cerrarLightbox();
});

// Abrir modal
document.querySelectorAll("[data-open]").forEach(btn => {
  btn.addEventListener("click", () => {
    const modalId = btn.getAttribute("data-open");
    document.getElementById(modalId).style.display = "flex";
  });
});

// Cerrar modal
document.querySelectorAll("[data-close]").forEach(btn => {
  btn.addEventListener("click", () => {
    const modalId = btn.getAttribute("data-close");
    document.getElementById(modalId).style.display = "none";
  });
});

// Cerrar clickeando fuera del contenido
document.querySelectorAll(".modal").forEach(modal => {
  modal.addEventListener("click", e => {
    if (e.target === modal) modal.style.display = "none";
  });
});
