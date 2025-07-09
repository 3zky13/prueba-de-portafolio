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

// Agregar al final del archivo main.js

// Timeline toggle functionality
document.addEventListener("DOMContentLoaded", () => {
  const timelineToggle = document.getElementById("timeline-toggle");
  const timelineContainer = document.querySelector(".timeline-container");

  if (timelineToggle && timelineContainer) {
    timelineToggle.addEventListener("click", () => {
      timelineContainer.classList.toggle("hidden");
      timelineToggle.textContent = timelineContainer.classList.contains(
        "hidden"
      )
        ? "Ver mi trayectoria"
        : "Ocultar trayectoria";
    });
  }

  // Animación de entrada para elementos de la línea de tiempo
  const timelineEvents = document.querySelectorAll(".timeline-event");
  timelineEvents.forEach((event, index) => {
    event.style.opacity = "0";
    event.style.transform = "translateX(-20px)";
    event.style.transition = "opacity 0.5s ease, transform 0.5s ease";

    setTimeout(() => {
      event.style.opacity = "1";
      event.style.transform = "translateX(0)";
    }, 300 + index * 200);
  });
});

// Agregar al final del archivo main.js

// Project filtering functionality
function initProjectFilters() {
  const filterButtons = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card");

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // Update active button
      filterButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      const filter = button.dataset.filter;

      // Filter projects
      projectCards.forEach((card) => {
        if (filter === "all") {
          card.style.display = "flex";
          setTimeout(() => {
            card.style.opacity = "1";
          }, 50);
        } else {
          if (card.dataset.category.includes(filter)) {
            card.style.display = "flex";
            setTimeout(() => {
              card.style.opacity = "1";
            }, 50);
          } else {
            card.style.opacity = "0";
            setTimeout(() => {
              card.style.display = "none";
            }, 300);
          }
        }
      });
    });
  });
}

// Add to the init function
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
  // Initialize project filters
  if (document.querySelector("#proyectos")) {
    initProjectFilters();
  }
}

// ================================
// 🖱️ CURSOR INTELIGENTE
// ================================

// Variables globales para el cursor
let cursor;
let cursorText;
let lastX = 0;
let lastY = 0;
let cursorSpeed = 0;

function initCursor() {
  cursor = document.getElementById("custom-cursor");
  if (!cursor) return;

  // Crear elemento de texto para el cursor
  cursorText = document.createElement("div");
  cursorText.className = "cursor-text";
  cursor.appendChild(cursorText);

  // Mover cursor con el mouse
  document.addEventListener("mousemove", (e) => {
    const x = e.clientX;
    const y = e.clientY;

    // Calcular velocidad del cursor
    const deltaX = x - lastX;
    const deltaY = y - lastY;
    cursorSpeed = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    cursor.style.transform = `translate(${x}px, ${y}px)`;
    lastX = x;
    lastY = y;

    // Interacción con partículas
    if (typeof particles !== "undefined") {
      particles.forEach((p) => {
        const dx = p.x - x;
        const dy = p.y - y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 150) {
          // Repeler las partículas
          p.speedX += dx * 0.0005 * (cursorSpeed / 10);
          p.speedY += dy * 0.0005 * (cursorSpeed / 10);
        }
      });
    }
  });

  // Cambiar forma en elementos interactivos
  document.querySelectorAll("a, button, .project-card, .btn").forEach((el) => {
    el.addEventListener("mouseenter", () => {
      cursor.classList.add("hovering");

      // Texto personalizado si está definido
      const text = el.getAttribute("data-cursor-text");
      if (text) {
        cursor.classList.add("text-mode");
        cursorText.textContent = text;
      }

      // Clase adicional para elementos creativos
      if (
        el.classList.contains("project-card") ||
        el.classList.contains("btn-demo")
      ) {
        cursor.classList.add("creative");
      }
    });

    el.addEventListener("mouseleave", () => {
      cursor.classList.remove("hovering", "text-mode", "creative");
      cursorText.textContent = "";
    });
  });

  // Ocultar cursor original
  document.body.style.cursor = "none";
}

//🌐 DETECCIÓN DE SECCIÓN ACTIVA

function initSectionDetection() {
  const sections = document.querySelectorAll("section");
  const navLinks = document.querySelectorAll("nav a");

  // Observador de intersección para secciones
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Actualizar clase activa
          sections.forEach((section) =>
            section.classList.remove("active-section")
          );
          entry.target.classList.add("active-section");

          // Actualizar navegación
          const targetId = entry.target.id;
          navLinks.forEach((link) => {
            link.classList.toggle(
              "active",
              link.getAttribute("href") === `#${targetId}`
            );
          });
        }
      });
    },
    {
      threshold: 0.4,
      rootMargin: "0px 0px -50% 0px",
    }
  );

  // Observar cada sección
  sections.forEach((section) => observer.observe(section));
}

// 📊 INDICADOR DE RENDIMIENTO

function initPerformanceIndicator() {
  const indicator = document.getElementById("performance-indicator");
  if (!indicator) return;

  // Simular métricas (en un caso real, usarías la API de Lighthouse)
  const simulatePerformance = () => {
    const perf = Math.floor(Math.random() * 30) + 70;
    const color = perf > 90 ? "#00cc66" : perf > 80 ? "#ffcc00" : "#ff6666";

    indicator.innerHTML = `Performance: <span style="color:${color}">${perf}/100</span>`;
  };

  // Actualizar cada 5 segundos (solo para demostración)
  simulatePerformance();
  setInterval(simulatePerformance, 5000);
}

// 🚀 ACTUALIZAR FUNCIÓN INIT

function init() {
  // Funciones existentes...

  // Inicializar nuevas funcionalidades
  initCursor();
  initSectionDetection();
  initPerformanceIndicator();

  // Aplicar tema guardado
  applySavedTheme();
}

// Ejecutar al cargar el DOM
document.addEventListener("DOMContentLoaded", init);
