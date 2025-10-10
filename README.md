# Joana Mora Nails Studio 💅✨

Landing + mini-app de Joana Mora Nails Studio: catálogo de diseños, pedido personalizado con upload, guía para medir uñas, enlace directo a WhatsApp y tarjeta de fidelidad con confetti 🎉.

🚀 Descripción

Sitio PWA ligero enfocado en uñas personalizadas y press-on con una experiencia minimalista y mística alineada al branding del estudio.
Incluye un flujo de pedido (producto, tamaño, estilo, descripción, imagen de referencia) y un programa de fidelidad simple para premiar visitas.

🌐 Demo en vivo

Ver la landing online: https://joana-mora-nails.netlify.app

✨ Funcionalidades

Catálogo de diseños (galería y categorías simples).

Pedido personalizado:

Selección de producto, tamaño, estilo.

Subida de imagen de referencia (Supabase Storage).

Guarda en base de datos para seguimiento en admin.

Guía de medición: modal con imagen y pasos para medir uñas.

Agenda por WhatsApp: CTA directo a wa.me.

Enlaces a redes.

Tarjeta de fidelidad (QR/link):

Confetti al alcanzar 5 y 10.

Modelo “o una u otra”:

A los 5 sellos → 20% de descuento (si canjea, se reinicia).

O esperar a 10 sellos → Pedicure Spa gratis (si canjea, se reinicia).

El confetti se reactiva automáticamente cuando el conteo baja tras canjear.

🛠️ Tecnologías

HTML5, CSS3, JS Vanilla

Supabase (DB + Storage)

Netlify/Vercel para deploy

canvas-confetti (confetti en 5/10)

QRCode (tarjeta/QR)

📁 Estructura (resumen)

/
├── index.html (Landing + enlaces)
├── tarjeta.html (Tarjeta de fidelidad / QR)
├── css/
│ └── style.css
├── js/
│ └── main.js (Interacciones varias de la landing)
├── assets/
│ ├── img/ (Ilustraciones / fotos)
│ └── icons/ (Íconos)
└── README.md

Nota: tarjeta.html usa módulos ES y librerías por CDN.

🧪 Tarjeta de fidelidad — Cómo funciona

Reglas:

Con 5 sellos puedes canjear 20% OFF o seguir sumando hasta 10 para pedicure gratis.

Al canjear, el admin reinicia el conteo (sellos → 0) para empezar una nueva vuelta.

Confetti:

Se lanza automáticamente al llegar a 5 y 10.

Si el conteo baja (después de canjear), las banderas locales se limpian para que el confetti vuelva a sonar en la siguiente vuelta.

Acceso por QR/Link:

La tarjeta se abre con ?id=<UUID_CLIENTA>

Pruebas rápidas (local y prod):

?mock=5 → simula 5 sellos (solo en localhost/127.0.0.1).

?mock=10 → simula 10 sellos.

?celebra=1 → fuerza el confetti.

Ejemplo:
http://localhost:5500/tarjeta.html?id=<UUID>&mock=5

🗄️ Base de datos (Supabase)

Tabla mínima para la tarjeta:

SQL:
create table if not exists public.customers (
id uuid primary key default gen_random_uuid(),
name text,
phone text,
stamps int4 not null default 0
);

🧰 Desarrollo local

Necesitas un servidor local (por módulos ES).

Comandos:

npx http-server -c-1 .
(en la carpeta del proyecto)

o

python -m http.server 8080

Luego abre:
http://localhost:8080/index.html

🔧 Configuración de Supabase

Ajusta tus credenciales en el código cuando cambies de proyecto:

const SUPABASE_URL = "https://<TU-PROYECTO>.supabase.co";
const SUPABASE_ANON = "<TU-ANON-KEY>";

RLS: asegúrate de permitir SELECT/UPDATE lo necesario sobre customers (o realiza updates de sellos sólo desde el admin autenticado).

🎨 Paleta (branding)

:root {
--bg: #F6F0FA;
--text: #3A2D46;
--muted: #7B6C87;
--lila: #C7AEE6;
--lila-dark: #A985D6;
--card: #FFFFFF;
--line: #E6E1EC;
--shadow: 0 8px 20px rgba(58,45,70,.08);
--ring: rgba(169,133,214,.25);
}

📌 Roadmap sugerido (opcional)

Admin con buscador/filtros y exportación CSV.

Historial de canjes y notas por clienta.

Catálogo administrable (CRUD, categorías).

Notificaciones (email/WhatsApp templates).

Métricas (pedidos/mes, top diseños, conversión WhatsApp).

📜 Licencia

Uso interno del estudio. Todos los derechos reservados.