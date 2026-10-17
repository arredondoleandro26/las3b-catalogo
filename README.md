# las3b-catalogo — Catálogo público de precios

Sitio público del catálogo de **Jabonería Las 3B**: departamentos, búsqueda, filtro de stock, ofertas y un pedido que se envía como mensaje de WhatsApp (`wa.me`) con la lista de productos y el total.

Es **solo lectura**: no contiene ninguna función de escritura ni login. Los productos se administran desde [las3b-admin](https://github.com/arredondoleandro26/las3b-admin), que es dueño del backend Convex. Este repo consume únicamente la query pública `catalogo:obtener` (ver `src/api.ts`), y como es reactiva, cualquier cambio hecho en el panel aparece aquí al instante.

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

- Una sola query devuelve ajustes, categorías y productos (~150 KB para 550 productos).
- Las imágenes se sirven desde Convex File Storage con `loading="lazy"`, así que solo se descargan las que entran en pantalla.
