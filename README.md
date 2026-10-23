# Alfa Capital — Demo tienda + panel admin

Demo **solo frontend** para Alfa Capital (perfumería 1.1 + originales, relojes y gafas — Armenia, Quindío).
No usa base de datos: todo se guarda en el `localStorage` del navegador, así que se puede mostrar sin costos.

## Correr el proyecto

```bash
yarn
yarn dev        # http://localhost:3000
```

Antes de cada commit: `yarn typecheck && yarn lint`.

## Qué incluye

**Tienda**
- Inicio con hero animado, sección de scroll (Perfumería → Relojes → Gafas), favoritos, transparencia Original vs. 1.1, Instagram y pasos de compra.
- Catálogo con filtros (categoría, dama/caballero, tipo, familia olfativa), búsqueda y orden.
- Ficha de producto con pirámide olfativa, duración/proyección y ocasiones.
- **Encuentra tu aroma** (`/quiz`): test de 4 preguntas que recomienda perfumes.
- **Arma tu look** (`/look`): combo perfume + reloj + gafas con descuento.
- Carrito persistente y checkout que arma el pedido y lo abre en WhatsApp.

**Admin** (`/admin` — demo: `admin@alfacapital.co` / `demo1234`)
- Dashboard (ventas, pedidos, ticket promedio, clientes nuevos, gráfica, top productos, stock bajo).
- Pedidos con estados, contacto por WhatsApp y exportación CSV.
- Productos: crear, editar, ocultar, stock rápido, subir foto (se optimiza a WebP).
- Clientes, reportes (categoría, 1.1 vs. original, canal, pago, barrios) y configuración.

Los pedidos hechos en la tienda aparecen al instante en el admin (mismo navegador).

## Notas del demo
- Productos, marcas e imágenes son **de prueba** (ilustraciones SVG). Se reemplazan subiendo fotos desde el admin.
- El número de WhatsApp se cambia en `src/lib/config.ts` o en Admin → Configuración.
- Si el cliente aprueba: pasar datos a Supabase + imágenes a Cloudflare R2, login real con RLS, service worker offline.
