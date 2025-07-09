// ================================
// 🧠 UTILIDADES
// ================================

/**
 * Crea una alerta dinámica y la inserta en el DOM.
 * @param {string} message - Texto del mensaje.
 * @param {string} type - Tipo de alerta: 'info', 'success', 'error'.
 */
function showAlert(message, type = "info") {
  const alert = document.createElement("div");
  alert.className = `alert alert-${type}`;
  alert.textContent = message;

  const formSection = document.querySelector("#contacto");
  formSection.insertBefore(alert, formSection.querySelector("form"));

  setTimeout(() => alert.remove(), 4000);
}

// ================================
// 📬 VALIDACIÓN DE FORMULARIO
// ================================

/**
 * Valida los campos del formulario de contacto.
 * Muestra una alerta si hay errores o éxito.
 */
function validateForm(event) {
  event.preventDefault();

  const name = document.querySelector('input[type="text"]');
  const email = document.querySelector('input[type="email"]');
  const message = document.querySelector("textarea");

  if (!name.value.trim() || !email.value.trim() || !message.value.trim()) {
    showAlert("Por favor, completa todos los campos.", "error");
    return;
  }

  if (!email.value.includes("@")) {
    showAlert("El correo no parece válido.", "error");
    return;
  }

  showAlert("¡Mensaje enviado con éxito!", "success");
  event.target.reset();
}

// ================================
// 🚀 INICIALIZACIÓN
// ================================

/**
 * Inicializa los eventos del sitio.
 */
function init() {
  const form = document.querySelector("form");
  if (form) {
    form.addEventListener("submit", validateForm);
  }
}

// Ejecutar al cargar el DOM
document.addEventListener("DOMContentLoaded", init);

// ================================
// 🌗 MODO OSCURO
// ================================

/**
 * Alterna entre modo claro y oscuro.
 */
function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");

  const isDark = document.body.classList.contains("dark-mode");
  localStorage.setItem("theme", isDark ? "dark" : "light");

  const toggleBtn = document.getElementById("theme-toggle");
  toggleBtn.textContent = isDark ? "☀️ Modo Claro" : "🌙 Modo Oscuro";

  // Animación al hacer clic
  toggleBtn.classList.add("clicked");
  setTimeout(() => toggleBtn.classList.remove("clicked"), 300);
}

/**
 * Aplica el tema guardado o detecta el del sistema operativo.
 */
function applySavedTheme() {
  const savedTheme = localStorage.getItem("theme");

  if (savedTheme) {
    if (savedTheme === "dark") {
      document.body.classList.add("dark-mode");
    }
  } else {
    // Detectar preferencia del sistema operativo
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    if (prefersDark) {
      document.body.classList.add("dark-mode");
      localStorage.setItem("theme", "dark");
    }
  }

  // Actualizar texto del botón
  const toggleBtn = document.getElementById("theme-toggle");
  const isDark = document.body.classList.contains("dark-mode");
  toggleBtn.textContent = isDark ? "☀️ Modo Claro" : "🌙 Modo Oscuro";
}

// ================================
// 🚀 ACTUALIZAR INIT
// ================================

function init() {
  const form = document.querySelector("form");
  if (form) {
    form.addEventListener("submit", validateForm);
  }

  const toggleBtn = document.getElementById("theme-toggle");
  if (toggleBtn) {
    toggleBtn.addEventListener("click", toggleDarkMode);
    applySavedTheme();
  }
}
