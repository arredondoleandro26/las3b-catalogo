import { memo } from "react";
import type { Producto } from "../api";
import { fmt, num } from "../lib/formato";

type Props = { p: Producto; icono: string; cantidad: number; onCantidad: (id: string, n: number) => void };

/** Carrito con un «+»: botón para agregar al pedido. */
function IconoCarritoMas() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 4h2l2.2 10.2a1.5 1.5 0 0 0 1.5 1.2h8.6a1.5 1.5 0 0 0 1.5-1.1L20.5 8H6.2" />
      <circle cx="9.5" cy="19.5" r="1.3" />
      <circle cx="17" cy="19.5" r="1.3" />
      <path d="M13 6.5v-4M11 4.5h4" strokeWidth="2.4" />
    </svg>
  );
}

export const Tarjeta = memo(function Tarjeta({ p, icono, cantidad, onCantidad }: Props) {
  return (
    <article className={`card ${p.estado}${p.oferta ? " oferta" : ""}`} data-id={p._id}>
      {p.oferta && <span className="badge-oferta">OFERTA</span>}
      <div className="media">
        {p.imagenes.length ? (
          <div className="pic">
            {p.imagenes.map((src, k) => <img key={src} src={src} alt={k ? "" : p.nombre} decoding="async" loading="lazy" />)}
          </div>
        ) : (
          <div className="pic ph" aria-hidden="true">{icono || "🛍️"}</div>
        )}
        {/* Agregar flota sobre la foto: así el precio tiene su fila completa y todas las tarjetas quedan alineadas */}
        {p.estado === "disponible" && (
          <div className="qty">
            {cantidad ? (
              <div className="step">
                <button type="button" aria-label={`Quitar uno de ${p.nombre}`} onClick={() => onCantidad(p._id, cantidad - 1)}>−</button>
                <b aria-live="polite">{cantidad}</b>
                <button type="button" aria-label={`Agregar otro de ${p.nombre}`} onClick={() => onCantidad(p._id, cantidad + 1)}>+</button>
              </div>
            ) : (
              <button type="button" className="add" aria-label={`Agregar ${p.nombre} al pedido`} title="Agregar al pedido" onClick={() => onCantidad(p._id, 1)}>
                <IconoCarritoMas />
              </button>
            )}
          </div>
        )}
      </div>
      {p.estado === "sinstock" && <span className="ribbon">SIN STOCK</span>}
      <h3 className="nombre" title={p.nombre}>{p.nombre}</h3>
      <div className="buy">
        <div className="pbox">
          {/* la línea «Antes» siempre ocupa su espacio para que los precios de una fila queden a la misma altura */}
          <span className="antes">{p.oferta && p.antes ? `Antes ${fmt(p.antes)}` : ""}</span>
          <div className="tag"><span className="cur">$</span><span className="num">{num(p.precio)}</span><span className="cu">c/u</span></div>
        </div>
      </div>
    </article>
  );
});
