import { makeFunctionReference } from "convex/server";

/**
 * Referencia tipada a la ÚNICA función de Convex que usa este repo: la query pública `catalogo:obtener`
 * definida en las3b-admin/convex/catalogo.ts. Si allá cambia la forma de la respuesta, actualizar estos tipos.
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
