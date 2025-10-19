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

// =========================
//  SISTEMA DE MODALES (UNIFICADO POR CLASES)
// =========================
const HTML_EL = document.documentElement;
const BODY_EL = document.body;

function lockScroll() {
  HTML_EL.classList.add('no-scroll');
  BODY_EL.classList.add('no-scroll');
}
function unlockScroll() {
  HTML_EL.classList.remove('no-scroll');
  BODY_EL.classList.remove('no-scroll');
}

function openModalById(id) {
  const modal = document.getElementById(id);
  if (!modal) return;

  // limpia posibles inline styles heredados
  modal.style.removeProperty('display');

  modal.classList.add('is-open');
  modal.classList.remove('oculto', 'hidden');
  modal.setAttribute('aria-hidden', 'false');

  if (modal.matches('#modalGaleria, #modalGuia') || modal.hasAttribute('data-lock-scroll')) {
    lockScroll();
  }
}

function closeModalByEl(modal) {
  if (!modal) return;
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
  modal.classList.add('oculto');

  if (modal.matches('#modalGaleria, #modalGuia') || modal.hasAttribute('data-lock-scroll')) {
    unlockScroll();
  }
}

function closeModalById(id) {
  const modal = document.getElementById(id);
  closeModalByEl(modal);
}

// Delegación: abrir
document.addEventListener('click', (e) => {
  const openBtn = e.target.closest('[data-open]');
  if (openBtn) {
    const modalId = openBtn.getAttribute('data-open');
    if (modalId) openModalById(modalId);
  }
});

// Delegación: cerrar (botones internos)
document.addEventListener('click', (e) => {
  const closeBtn = e.target.closest('[data-close]');
  if (closeBtn) {
    const modalId = closeBtn.getAttribute('data-close');
    if (modalId) {
      closeModalById(modalId);
    } else {
      const modal = closeBtn.closest('.modal');
      closeModalByEl(modal);
    }
  }
});

// Cerrar clickeando el backdrop (solo si el click es EXACTAMENTE en el overlay .modal)
document.addEventListener('click', (e) => {
  document.querySelectorAll('.modal.is-open').forEach((m) => {
    if (e.target === m) closeModalByEl(m);
  });
});

// Cerrar con ESC
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal.is-open').forEach(closeModalByEl);
    cerrarLightbox();
  }
});

// =========================
//  API específica Guía y Galería (compat)
// =========================
function abrirModal() { openModalById('modalGuia'); }
function cerrarModal() { closeModalById('modalGuia'); }

function abrirGaleria() { openModalById('modalGaleria'); }
function cerrarGaleria() { closeModalById('modalGaleria'); }

const btnGaleria = document.getElementById('btnGaleria');
const btnCerrarGaleria = document.getElementById('btnCerrarGaleria');
btnGaleria?.addEventListener('click', abrirGaleria);
btnCerrarGaleria?.addEventListener('click', cerrarGaleria);

// =========================
//  LIGHTBOX
// =========================
function abrirLightbox(src) {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  if (lightbox && lightboxImg) {
    lightboxImg.src = src;

    // Asegurar que el lightbox esté SIEMPRE por encima del modal
    // (tu modal usa z-index ~1000, le damos bastante margen)
    lightbox.style.zIndex = '10000';

    lightbox.classList.remove('oculto');
    lightbox.setAttribute('aria-hidden', 'false');
    lockScroll();
  }
}

function cerrarLightbox() {
  const lightbox = document.getElementById('lightbox');
  if (lightbox) {
    lightbox.classList.add('oculto');
    lightbox.setAttribute('aria-hidden', 'true');
    unlockScroll();
  }
}

// Cerrar lightbox clickeando fuera de la imagen
window.addEventListener('click', function (event) {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  if (!lightbox) return;
  if (event.target === lightbox && event.target !== lightboxImg) cerrarLightbox();
});

// =========================
//  IMPORTANTE: eliminamos parches anteriores que interceptaban clicks
//  en imágenes con capture + stopImmediatePropagation (bloqueaban tu onclick inline)
// =========================

