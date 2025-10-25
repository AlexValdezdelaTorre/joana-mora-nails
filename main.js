// =========================
// main.js — Joana Mora (FIX: Referidas abre + Guía responsiva)
// =========================

// === Nombre de archivo seleccionado ===
function mostrarNombreArchivo() {
  const input = document.getElementById('imagenDiseno');
  const nombreArchivo =
    input && input.files && input.files.length > 0
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

function ensureGuiaImagesFit(modalEl) {
  // Asegura que las imágenes DENTRO del modal Guía sean responsivas y no se desborden
  if (!modalEl) return;
  const imgs = modalEl.querySelectorAll('img, .imagen-modal');
  imgs.forEach((img) => {
    img.style.maxWidth = '100%';
    img.style.height = 'auto';
    img.style.maxHeight = '70vh';
    img.style.objectFit = 'contain';
    img.style.display = 'block';
    img.style.margin = '0 auto';
  });
}

function openModalById(id) {
  const modal = document.getElementById(id);
  if (!modal) {
    console.warn('[openModalById] No existe el modal con id:', id);
    return;
  }

  // limpia posibles inline styles heredados
  modal.style.removeProperty('display');

  modal.classList.add('is-open');
  modal.classList.remove('oculto', 'hidden');
  modal.setAttribute('aria-hidden', 'false');

  // Ajustes específicos
  if (id === 'modalGuia') {
    ensureGuiaImagesFit(modal);
  }

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

// Delegación: abrir (previene submit/navegación)
document.addEventListener('click', (e) => {
  const openBtn = e.target.closest('[data-open]');
  if (openBtn) {
    e.preventDefault(); // evita submit de <button> en <form> y navegación de <a>
    e.stopPropagation();
    const modalId = openBtn.getAttribute('data-open');
    if (modalId) openModalById(modalId);
  }
});

// Delegación: cerrar (botones internos)
document.addEventListener('click', (e) => {
  const closeBtn = e.target.closest('[data-close]');
  if (closeBtn) {
    e.preventDefault();
    e.stopPropagation();
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
/*  API específica Guía y Galería (compat legacy)
    Si tienes botones antiguos que llaman estas funciones, siguen funcionando. */
// =========================
function abrirModal() { openModalById('modalGuia'); }
function cerrarModal() { closeModalById('modalGuia'); }

function abrirGaleria() { openModalById('modalGaleria'); }
function cerrarGaleria() { closeModalById('modalGaleria'); }

const btnGaleria = document.getElementById('btnGaleria');
const btnCerrarGaleria = document.getElementById('btnCerrarGaleria');
btnGaleria?.addEventListener('click', (e) => { e.preventDefault(); abrirGaleria(); });
btnCerrarGaleria?.addEventListener('click', (e) => { e.preventDefault(); cerrarGaleria(); });

// =========================
//  LIGHTBOX
// =========================
function abrirLightbox(src) {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  if (lightbox && lightboxImg) {
    lightboxImg.src = src;
    // asegurar que el lightbox esté por encima del modal
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
//  MODAL: Programa Referidas (extra utilidades)
// =========================

// Copiar enlace de referidas si el botón existe
document.addEventListener('click', async (e) => {
  const isCopyBtn = e.target && (e.target.id === 'copiarRef' || e.target.closest('#copiarRef'));
  if (isCopyBtn) {
    e.preventDefault();
    const input = document.getElementById('refLink');
    if (!input) return;
    const texto = input.value;
    try {
      await navigator.clipboard.writeText(texto);
      alert('¡Enlace copiado!');
    } catch {
      input.select();
      document.execCommand('copy');
      alert('¡Enlace copiado!');
    }
  }
});

// ===== Accesibilidad mínima: devolver foco al opener + trap de TAB =====
let lastOpener = null;

function getFocusableEls(root){
  return root.querySelectorAll(
    'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
  );
}

function trapHandler(e){
  if (e.key !== 'Tab') return;
  const modal = e.currentTarget;
  const nodes = Array.from(getFocusableEls(modal));
  if (nodes.length === 0) return;

  const first = nodes[0];
  const last  = nodes[nodes.length - 1];

  if (e.shiftKey && document.activeElement === first){
    e.preventDefault(); last.focus();
  } else if (!e.shiftKey && document.activeElement === last){
    e.preventDefault(); first.focus();
  }
}

// Guardamos referencias originales para extender sin romper API existente
const _openModalById_ref = openModalById;
openModalById = function(id){
  lastOpener = document.querySelector(`[data-open="${id}"]`) || document.activeElement;
  _openModalById_ref(id);
  const modal = document.getElementById(id);
  if (!modal) return;
  const focusables = getFocusableEls(modal);
  focusables[0]?.focus();
  modal.addEventListener('keydown', trapHandler);
};

const _closeModalByEl_ref = closeModalByEl;
closeModalByEl = function(modal){
  if (!modal) return;
  modal.removeEventListener('keydown', trapHandler);
  _closeModalByEl_ref(modal);
  // devuelve el foco al botón que abrió
  lastOpener?.focus();
};

// Robustez: si usas clase .copiar en lugar de #copiarRef, también funciona
document.addEventListener('click', async (e) => {
  const copyBtn = e.target.closest('#copiarRef, .copiar');
  if (!copyBtn) return;
  const input = document.getElementById('refLink') || copyBtn.closest('.enlace-ref')?.querySelector('input');
  if (!input) return;
  e.preventDefault();
  try {
    await navigator.clipboard.writeText(input.value);
    alert('¡Enlace copiado!');
  } catch {
    input.select();
    document.execCommand('copy');
    alert('¡Enlace copiado!');
  }
});

// Asegura que Guía aplique el resize también si se abre por data-open
document.addEventListener('click', (e) => {
  const opener = e.target.closest('[data-open="modalGuia"]');
  if (!opener) return;
  setTimeout(() => {
    const modal = document.getElementById('modalGuia');
    if (!modal) return;
    modal.querySelectorAll('img, .imagen-modal').forEach((img) => {
      img.style.maxWidth = '100%';
      img.style.height = 'auto';
      img.style.maxHeight = '70vh';
      img.style.objectFit = 'contain';
      img.style.display = 'block';
      img.style.margin = '0 auto';
    });
  }, 0);
});


// =========================
//  NOTA: Eliminados parches antiguos que interceptaban clicks
//  (capture + stopImmediatePropagation) para no romper onclick inline.
// =========================
