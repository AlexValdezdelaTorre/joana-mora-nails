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
//  - No se usa style.display, solo clases.
//  - Usa .is-open para mostrar y aria-hidden para accesibilidad.
//  - Soporta data-open y data-close.
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
  // limpiar posibles inline styles heredados de código previo
  modal.style.removeProperty('display');

  modal.classList.add('is-open');
  modal.classList.remove('oculto', 'hidden');
  modal.setAttribute('aria-hidden', 'false');

  // si este modal necesita bloquear scroll (galería/guía), puedes marcarlo en HTML con data-lock-scroll
  if (modal.matches('#modalGaleria, #modalGuia') || modal.hasAttribute('data-lock-scroll')) {
    lockScroll();
  }
}

function closeModalByEl(modal) {
  if (!modal) return;
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');

  // por si tu CSS usa .oculto para esconder
  modal.classList.add('oculto');

  // quitar bloqueo si era de los que bloquean
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
      // Si no trae id, cerramos el modal ancestro
      const modal = closeBtn.closest('.modal');
      closeModalByEl(modal);
    }
  }
});

// Cerrar clickeando fuera del contenido (en el backdrop)
document.addEventListener('click', (e) => {
  const modal = e.target.closest('.modal');
  // Si se hizo click en un .modal (el contenedor) y el target ES el modal (no el panel interno)
  document.querySelectorAll('.modal.is-open').forEach((m) => {
    if (e.target === m) closeModalByEl(m);
  });
});

// Cerrar con ESC
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal.is-open').forEach(closeModalByEl);
    cerrarLightbox(); // por si el lightbox está abierto
  }
});

// =========================
//  COMPAT: API específica que ya usabas para Guía y Galería
//  (redirigen a las funciones unificadas)
// =========================
function abrirModal() { openModalById('modalGuia'); }
function cerrarModal() { closeModalById('modalGuia'); }

function abrirGaleria() { openModalById('modalGaleria'); }
function cerrarGaleria() { closeModalById('modalGaleria'); }

// Si tienes botones viejos apuntando a estas funciones, se mantienen:
const btnGaleria = document.getElementById('btnGaleria');
const btnCerrarGaleria = document.getElementById('btnCerrarGaleria');
btnGaleria?.addEventListener('click', abrirGaleria);
btnCerrarGaleria?.addEventListener('click', cerrarGaleria);

// =========================
//  LIGHTBOX (se mantiene igual, solo sin mezclar con display inline)
// =========================
function abrirLightbox(src) {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  if (lightbox && lightboxImg) {
    lightboxImg.src = src;
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
//  IMPORTANTE: Se eliminan los viejos listeners que usaban style.display
//  (ya NO uses estos bloques en tu HTML o JS):
//  - document.querySelectorAll("[data-open]") con style.display="flex"
//  - document.querySelectorAll("[data-close]") con style.display="none"
//  - querySelectorAll(".modal") cerrando por style.display
// =========================
