import { useEffect, useRef, useState } from "react";
import type { Producto } from "../api";
import { Tarjeta } from "./Tarjeta";

type Props = {
  productos: Producto[];
  iconoDe: (p: Producto) => string;
  carrito: Record<string, number>;
  onCantidad: (id: string, n: number) => void;
};

/** Fila deslizable con los productos en oferta, al principio del catálogo. Quien la usa la oculta si no hay ofertas. */
export function SeccionOfertas({ productos, iconoDe, carrito, onCantidad }: Props) {
  const fila = useRef<HTMLDivElement>(null);
  const [puede, setPuede] = useState({ izq: false, der: false });

  // Las flechas solo aparecen si la fila no cabe entera
  useEffect(() => {
    const el = fila.current;
    if (!el) return;
    const medir = () => setPuede({ izq: el.scrollLeft > 4, der: el.scrollLeft + el.clientWidth < el.scrollWidth - 4 });
    medir();
    el.addEventListener("scroll", medir, { passive: true });
    const ro = new ResizeObserver(medir);
    ro.observe(el);
    return () => { el.removeEventListener("scroll", medir); ro.disconnect(); };
  }, [productos.length]);

  const mover = (dir: 1 | -1) => fila.current?.scrollBy({ left: dir * fila.current.clientWidth * 0.85, behavior: "smooth" });

  return (
    <section className="wrap ofertas" id="ofertas" aria-labelledby="ofertas-t">
      <div className="cat-head ofertas-head">
        <span className="cat-icon">🏷️</span>
        <h2 id="ofertas-t">Ofertas</h2>
        <span className="count">{productos.length} producto{productos.length === 1 ? "" : "s"}</span>
      </div>
      <div className="ofertas-cont">
        {puede.izq && <button type="button" className="of-flecha izq" aria-label="Ver ofertas anteriores" onClick={() => mover(-1)}>‹</button>}
        <div className="ofertas-fila" ref={fila}>
          {productos.map((p) => (
            <Tarjeta key={p._id} p={p} icono={iconoDe(p)} cantidad={carrito[p._id] || 0} onCantidad={onCantidad} />
          ))}
        </div>
        {puede.der && <button type="button" className="of-flecha der" aria-label="Ver más ofertas" onClick={() => mover(1)}>›</button>}
      </div>
    </section>
  );
}
