// Pega aquí la URL /exec generada al implementar tu Google Apps Script.
const FORM_WEBHOOK_URL = "";

(function initTabs() {
  const tabList = document.querySelector(".flow-tabs");
  if (!tabList) return;

  const tabs = Array.from(tabList.querySelectorAll('[role="tab"]'));
  const panels = Array.from(document.querySelectorAll('[role="tabpanel"]'));

  function activateTab(targetTab, focusTab) {
    tabs.forEach((tab) => {
      const isSelected = tab === targetTab;
      tab.setAttribute("aria-selected", String(isSelected));
      tab.tabIndex = isSelected ? 0 : -1;
    });

    const panelId = targetTab.getAttribute("aria-controls");
    panels.forEach((panel) => {
      panel.hidden = panel.id !== panelId;
    });

    if (focusTab) {
      targetTab.focus();
    }
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => activateTab(tab, false));

    tab.addEventListener("keydown", (event) => {
      let nextIndex = null;
      if (event.key === "ArrowRight") {
        nextIndex = (index + 1) % tabs.length;
      } else if (event.key === "ArrowLeft") {
        nextIndex = (index - 1 + tabs.length) % tabs.length;
      } else if (event.key === "Home") {
        nextIndex = 0;
      } else if (event.key === "End") {
        nextIndex = tabs.length - 1;
      }

      if (nextIndex !== null) {
        event.preventDefault();
        activateTab(tabs[nextIndex], true);
      }
    });
  });
})();

(function initContactForm() {
  const form = document.getElementById("contact-form");
  const statusEl = document.getElementById("form-status");
  const submitBtn = document.getElementById("submit-btn");
  if (!form || !statusEl || !submitBtn) return;

  function setStatus(message, type) {
    statusEl.textContent = message;
    statusEl.className = "form-status";
    if (type === "ok") statusEl.classList.add("is-ok");
    if (type === "err") statusEl.classList.add("is-err");
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    setStatus("", "");

    const nombre = form.nombre.value.trim();
    const empresa = form.empresa.value.trim();
    const email = form.email.value.trim();
    const mensaje = form.mensaje.value.trim();
    const website = form.website.value.trim();

    // Si el campo oculto viene relleno, lo descartamos en silencio (honeypot).
    if (website !== "") {
      form.reset();
      setStatus("Consulta recibida. Te respondemos en menos de 24 horas laborables.", "ok");
      return;
    }

    if (!nombre || !email || !mensaje) {
      setStatus("Completa nombre, correo electrónico y la tarea que quieres agilizar.", "err");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus("Revisa el formato del correo electrónico.", "err");
      return;
    }

    if (!FORM_WEBHOOK_URL) {
      setStatus(
        "El formulario aún no está conectado. Puedes reservar directamente un hueco de 15 minutos en el calendario de al lado.",
        "err"
      );
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Enviando...";

    try {
      // text/plain evita el preflight CORS OPTIONS en Google Apps Script.
      const response = await fetch(FORM_WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "text/plain;charset=utf-8",
        },
        body: JSON.stringify({
          nombre,
          empresa,
          email,
          mensaje,
          website,
          origen: window.location.hostname || "ikonos.es",
        }),
      });

      const result = await response.json().catch(() => ({ ok: response.ok }));
      if (!response.ok || result.ok === false) {
        throw new Error(result.error || "No se pudo registrar la consulta.");
      }

      form.reset();
      setStatus("Consulta recibida. Te respondemos en menos de 24 horas laborables.", "ok");
    } catch (_error) {
      setStatus(
        "No se pudo enviar ahora mismo. Si lo prefieres, reserva directamente un hueco en el calendario.",
        "err"
      );
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Enviar consulta";
    }
  });
})();
