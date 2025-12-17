/* PROTOCOLO DE COMUNICACIÓN DELITIĀRE (Global)
  Maneja la construcción dinámica de enlaces de WhatsApp y Tracking.
*/

function initWaLinks() {
  const DEFAULT_PHONE = "523342874709"; // Línea Central / Concierge

  function buildWaUrl(phone, text) {
    const cleanPhone = String(phone || "").replace(/\D/g, "");
    const base = cleanPhone ? `https://wa.me/${cleanPhone}` : "https://wa.me/";
    const qs = text ? `?text=${encodeURIComponent(text)}` : "";
    return base + qs;
  }

  document.querySelectorAll("a[data-wa]").forEach((el) => {
    // Evitar procesar dos veces el mismo elemento si se llama varias veces
    if (el.dataset.waProcessed) return;

    const phone = el.getAttribute("data-wa-phone") || DEFAULT_PHONE;
    let text = el.getAttribute("data-wa-text") || "";

    // Sustituir variables dinámicas {{variable}}
    Array.from(el.attributes).forEach((attr) => {
      if (attr.name.startsWith("data-wa-var-")) {
        const key = attr.name.replace("data-wa-var-", "");
        const value = attr.value;
        const re = new RegExp(`{{\\s*${key}\\s*}}`, "g");
        text = text.replace(re, value);
      }
    });

    const url = buildWaUrl(phone, text);

    el.setAttribute("href", url);
    el.setAttribute("target", "_blank");
    el.setAttribute("rel", "noopener noreferrer");
    
    // Marcar como procesado
    el.dataset.waProcessed = "true";
  });
}

// Ejecutar cuando el DOM esté listo
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initWaLinks);
} else {
  initWaLinks();
}

// Si usas View Transitions de Astro, descomenta la siguiente línea:
// document.addEventListener('astro:page-load', initWaLinks);