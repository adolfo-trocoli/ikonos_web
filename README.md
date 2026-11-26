# Ikonos — Web pública (`ikonos.es`)

Sitio web estático de **Ikonos** (*integraciones sencillas de IA y formación práctica para Pymes*), publicado en **GitHub Pages** sobre el dominio [`https://ikonos.es`](https://ikonos.es).

---

## Estructura

```text
ikonos_web/
├── index.html       # Landing principal (Qué hacemos, Cómo empezamos, Quiénes somos, Contacto)
├── privacidad.html  # Política de Privacidad (RGPD / LOPDGDD)
├── styles.css       # Estilos (sin frameworks externos)
├── app.js           # Pestañas accesibles y envío del formulario de contacto
├── CNAME            # Dominio personalizado para GitHub Pages (ikonos.es)
└── assets/          # Logotipo, favicons y foto optimizada (WebP + JPG/PNG)
```

---

## Previsualización en local

Al ser HTML, CSS y JavaScript puro, no requiere compilación ni dependencias:

```bash
python3 -m http.server 8000
```

Abrir `http://localhost:8000` en el navegador.

---

## Despliegue y funcionamiento

* **Hosting:** cada push a `main` actualiza automáticamente `https://ikonos.es` mediante GitHub Pages con HTTPS forzado.
* **Formulario de contacto:** `app.js` valida los campos, aplica un campo *honeypot* antispam y envía las consultas por `POST` (`text/plain`) al webhook configurado en `FORM_WEBHOOK_URL` (Google Apps Script).
* **Privacidad:** la web no utiliza cookies analíticas, publicitarias ni scripts de seguimiento de terceros.
