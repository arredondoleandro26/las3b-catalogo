import { makeFunctionReference } from "convex/server";

/**
 * Referencias tipadas a las DOS funciones de Convex que usa este repo, ambas definidas en las3b-admin:
 *  - `catalogo:obtener` (query, convex/catalogo.ts): todo lo que se muestra.
 *  - `contacto:enviar` (mutación, convex/contacto.ts): el formulario «Contáctanos». Solo inserta la
 *    solicitud; no lee ni devuelve datos.
 * Si allá cambia la forma de los argumentos o de la respuesta, actualizar estos tipos.
 */

export type Estado = "disponible" | "sinstock" | "descontinuado";

export type Ajustes = {
  nombre: string;
  titulo: string;
  periodo: string;
  precioNota: string;
  aviso: string;
  whatsapp: string;
  pie: string;
  color: string;
  bannerUrl: string | null;
  contacto: Contacto;
};

/** Datos de la zona de contacto. Un campo vacío no se muestra. */
export type Contacto = {
  telefono: string;
  correo: string;
  instagram: string;
  facebook: string;
  direccion: string;
  /** Una línea por horario. */
  horario: string;
};

export type Categoria = { _id: string; nombre: string; icono: string; orden: number };

export type Producto = {
  _id: string;
  catId: string;
  nombre: string;
  precio: number;
  estado: Estado;
  orden: number;
  oferta: boolean;
  antes: number | null;
  imagenes: string[];
};

export type Catalogo = { ajustes: Ajustes; categorias: Categoria[]; productos: Producto[] };

export const obtenerCatalogo = makeFunctionReference<"query", Record<string, never>, Catalogo>("catalogo:obtener");

export type SolicitudContacto = { nombre: string; telefono: string; correo: string; mensaje: string; web: string };

export const enviarContacto = makeFunctionReference<"mutation", SolicitudContacto, { ok: true }>("contacto:enviar");
