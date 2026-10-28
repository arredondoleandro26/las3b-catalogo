import type { Ajustes, Producto } from "../api";
import type { Carrito as Cantidades } from "../hooks/useCarrito";
import { fmt } from "../lib/formato";
import { useToast } from "../hooks/useToast";

type Props = {
  abierto: boolean;
  onCerrar: () => void;
  lineas: Producto[]; // productos disponibles con cantidad > 0
  carrito: Cantidades;
  onCantidad: (id: string, n: number) => void;
  onVaciar: () => void;
  ajustes: Ajustes;
};

/** Texto del pedido que viaja por WhatsApp (wa.me) o al portapapeles. */
export function textoPedido(lineas: Producto[], carrito: Cantidades, ajustes: Ajustes) {
  const total = lineas.reduce((s, p) => s + p.precio * carrito[p._id], 0);
  const items = lineas.map((p) => `• ${carrito[p._id]} x ${p.nombre} (${fmt(p.precio)} c/u) = ${fmt(p.precio * carrito[p._id])}`);
  return `Hola ${ajustes.nombre}! Quisiera hacer este pedido:\n\n${items.join("\n")}\n\nTotal referencial: ${fmt(total)}`;
}

export function Carrito({ abierto, onCerrar, lineas, carrito, onCantidad, onVaciar, ajustes }: Props) {
  const toast = useToast();
  const total = lineas.reduce((s, p) => s + p.precio * carrito[p._id], 0);

  function enviarWhatsApp() {
    if (!lineas.length) return toast("Agrega productos a tu pedido primero.");
    const numero = (ajustes.whatsapp || "").replace(/\D/g, "");
    if (!numero) return toast("Este catálogo aún no tiene número de WhatsApp configurado.");
    window.open(`https://wa.me/${numero}?text=${encodeURIComponent(textoPedido(lineas, carrito, ajustes))}`, "_blank", "noopener");
  }

  async function copiar() {
    if (!lineas.length) return toast("Tu pedido está vacío.");
    const txt = textoPedido(lineas, carrito, ajustes);
    try { await navigator.clipboard.writeText(txt); }
    catch {
      const ta = document.createElement("textarea");
      ta.value = txt; document.body.appendChild(ta); ta.select(); document.execCommand("copy"); ta.remove();
    }
    toast("Pedido copiado. Pégalo donde quieras enviarlo.");
  }

  return (
    <>
      <div className={`backdrop${abierto ? " open" : ""}`} onClick={onCerrar} />
      <aside className={`cart${abierto ? " open" : ""}`} aria-label="Mi pedido" aria-hidden={!abierto}>
        <header>
          <h3>🛒 Mi pedido</h3>
          <button type="button" aria-label="Cerrar" onClick={onCerrar}>✕</button>
        </header>
        <div className="lines">
          {lineas.length ? lineas.map((p) => (
            <div className="line" key={p._id}>
              <div><div className="ln">{p.nombre}</div><div className="lu">{fmt(p.precio)} c/u</div></div>
              <div className="lp">{fmt(p.precio * carrito[p._id])}</div>
              <button type="button" className="btn ghost" style={{ padding: "2px 0", textAlign: "left" }} onClick={() => onCantidad(p._id, 0)}>Quitar</button>
              <div className="step">
                <button type="button" aria-label="Quitar uno" onClick={() => onCantidad(p._id, carrito[p._id] - 1)}>−</button>
                <b>{carrito[p._id]}</b>
                <button type="button" aria-label="Agregar uno" onClick={() => onCantidad(p._id, carrito[p._id] + 1)}>+</button>
              </div>
            </div>
          )) : (
            <div className="emptycart">Tu pedido está vacío.<br />Agrega productos con el botón <b>Agregar</b>.</div>
          )}
        </div>
        <footer>
          <div className="total"><span>Total referencial</span><span>{fmt(total)}</span></div>
          <button type="button" className="btn wa" onClick={enviarWhatsApp}>Enviar pedido por WhatsApp</button>
          <button type="button" className="btn" onClick={() => void copiar()}>Copiar pedido</button>
          <button type="button" className="btn ghost" onClick={() => { if (!lineas.length || confirm("¿Vaciar el pedido?")) onVaciar(); }}>Vaciar pedido</button>
          <small>Precios referenciales: confirmaremos stock y valor final contigo por WhatsApp.</small>
        </footer>
      </aside>
    </>
  );
}
