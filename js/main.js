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
// 🌐 DETECCIÓN DE SECCIÓN ACTIVA
// ================================

function initSectionDetection() {
  const sections = document.querySelectorAll("section");
  const navLinks = document.querySelectorAll("nav a");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // 1. RESET GENERAL: Limpia todas las clases primero
          sections.forEach(s => {
            s.classList.remove("active-section", "blurred");
          });

          // 2. MARCA SECCIÓN ACTUAL
          entry.target.classList.add("active-section");

          // 3. APLICA BLUR AL RESTO
          sections.forEach(section => {
            if (section !== entry.target) {
              section.classList.add("blurred");
            }
          });

          // 4. ACTUALIZA NAVEGACIÓN (opcional)
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
      threshold: 0.4,       // 40% de visibilidad requerida
      rootMargin: "0px 0px -25% 0px" // 25% de margen inferior para activación temprana
    }
  );

  // Inicia observación en todas las secciones
  sections.forEach((section) => {
    observer.observe(section);
    
    // Opcional: Fuerza estado inicial si hay hash en la URL
    if (window.location.hash === `#${section.id}`) {
      section.classList.add("active-section");
    }
  });
}

// ================================
// 📊 INDICADOR DE RENDIMIENTO
// ================================

function initPerformanceIndicator() {
  const indicator = document.getElementById("performance-indicator");
  if (!indicator) return;

  // Simular métricas
  const simulatePerformance = () => {
    const perf = Math.floor(Math.random() * 30) + 70;
    const color = perf > 90 ? "#00cc66" : perf > 80 ? "#ffcc00" : "#ff6666";

    indicator.innerHTML = `Performance: <span style="color:${color}">${perf}/100</span>`;
  };

  // Actualizar cada 5 segundos
  simulatePerformance();
  setInterval(simulatePerformance, 5000);
}

// ================================
// 🕰️ TIMELINE TOGGLE
// ================================

function initTimelineToggle() {
  const timelineToggle = document.getElementById("timeline-toggle");
  const timelineContainer = document.querySelector(".timeline-container");

  if (timelineToggle && timelineContainer) {
    timelineToggle.addEventListener("click", () => {
      timelineContainer.classList.toggle("hidden");
      timelineToggle.textContent = timelineContainer.classList.contains("hidden")
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
}

// ================================
// 🧩 FILTROS DE PROYECTOS
// ================================

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

// ================================
// 🚀 INICIALIZACIÓN PRINCIPAL
// ================================

function init() {
  // Formulario
  const form = document.querySelector("form");
  if (form) {
    form.addEventListener("submit", validateForm);
  }

  // Tema oscuro/claro
  const toggleBtn = document.getElementById("theme-toggle");
  if (toggleBtn) {
    toggleBtn.addEventListener("click", toggleDarkMode);
    applySavedTheme();
  }

  // Timeline
  initTimelineToggle();

  // Filtros de proyectos
  if (document.querySelector("#proyectos")) {
    initProjectFilters();
  }

  // Funcionalidades avanzadas
  initSectionDetection();
  initPerformanceIndicator();
}

// Ejecutar al cargar el DOM
document.addEventListener("DOMContentLoaded", init);