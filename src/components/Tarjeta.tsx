import { memo } from "react";
import type { Producto } from "../api";
import { fmt, num } from "../lib/formato";

type Props = { p: Producto; icono: string; cantidad: number; onCantidad: (id: string, n: number) => void };

export const Tarjeta = memo(function Tarjeta({ p, icono, cantidad, onCantidad }: Props) {
  return (
    <article className={`card ${p.estado}${p.oferta ? " oferta" : ""}`} data-id={p._id}>
      {p.oferta && <span className="badge-oferta">OFERTA</span>}
      {p.imagenes.length ? (
        <div className="pic">
          {p.imagenes.map((src, k) => <img key={src} src={src} alt={k ? "" : p.nombre} decoding="async" loading="lazy" />)}
        </div>
      ) : (
        <div className="pic ph" aria-hidden="true">{icono || "🛍️"}</div>
      )}
      {p.estado === "sinstock" && <span className="ribbon">SIN STOCK</span>}
      <h3 className="nombre" title={p.nombre}>{p.nombre}</h3>
      <div className="buy">
        <div className="pbox">
          {p.oferta && p.antes ? <span className="antes">Antes {fmt(p.antes)}</span> : null}
          <div className="tag"><span className="cur">$</span><span className="num">{num(p.precio)}</span></div>
        </div>
        <div className="qty">
          {p.estado !== "disponible" ? (
            <span className="nostock">{p.estado === "sinstock" ? "Sin stock" : "No disponible"}</span>
          ) : cantidad ? (
            <div className="step">
              <button type="button" aria-label="Quitar uno" onClick={() => onCantidad(p._id, cantidad - 1)}>−</button>
              <b>{cantidad}</b>
              <button type="button" aria-label="Agregar uno" onClick={() => onCantidad(p._id, cantidad + 1)}>+</button>
            </div>
          ) : (
            <button type="button" className="add" onClick={() => onCantidad(p._id, 1)}>Agregar</button>
          )}
        </div>
      </div>
    </article>
  );
});
