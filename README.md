# las3b-catalogo — Catálogo público de productos

Sitio público del catálogo de **Jabonería Las 3B**: departamentos, búsqueda, filtro de stock, ofertas, un pedido que se envía como mensaje de WhatsApp (`wa.me`) con la lista de productos y el total, y una zona **«Contáctanos»** con formulario.

No tiene login. Los productos se administran desde [las3b-admin](https://github.com/arredondoleandro26/las3b-admin), que es dueño del backend Convex. Este repo usa solo dos funciones públicas (ver `src/api.ts`):

- `catalogo:obtener` (query): todo lo que se muestra. Es reactiva: cualquier cambio hecho en el panel aparece aquí al instante. Búsqueda, filtros y carrito se calculan en el navegador sobre esa misma respuesta, sin más llamadas.
- `contacto:enviar` (mutación): el formulario «Contáctanos». Es la única escritura y está acotada: solo inserta la solicitud (que se lee en el panel), valida de nuevo en el servidor, descarta robots con un campo oculto y limita los envíos seguidos. No lee ni devuelve datos.

Stack: React 19 + Vite + TypeScript + `convex/react`.

## Puesta en marcha

```bash
npm install
cp .env.example .env.local   # y completar VITE_CONVEX_URL
npm run dev
```

`VITE_CONVEX_URL` es la URL del deployment de Convex que creó el repo admin (dashboard de Convex → Settings → URL & Deploy Key → *Deployment URL*). Para producción, usar la URL del deployment de producción.

## Despliegue

Vercel o Netlify: build `npm run build`, salida `dist/`, variable `VITE_CONVEX_URL`. El `vercel.json` incluido redirige todas las rutas a `index.html`.

## Consumo de datos

- Una sola query devuelve ajustes (incluida la zona de contacto), categorías y productos (~150 KB para 550 productos).
- La validación del formulario (`src/lib/contacto.ts`) es copia de `las3b-admin/convex/lib/contacto.ts`: si cambia una regla, cambiarla en ambos.
- Las imágenes se sirven desde Convex File Storage con `loading="lazy"`, así que solo se descargan las que entran en pantalla.
