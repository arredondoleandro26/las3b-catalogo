import type { Ajustes, Producto } from "../api";
import type { Carrito } from "../hooks/useCarrito";
import { fmt } from "../lib/formato";
import { useToast } from "../hooks/useToast";
import { textoPedido } from "./Carrito";

type Props = { lineas: Producto[]; carrito: Carrito; ajustes: Ajustes };

/** Botón flotante de WhatsApp: muestra cuántos productos hay en el pedido y lo envía por wa.me. */
export function BotonWhatsApp({ lineas, carrito, ajustes }: Props) {
  const toast = useToast();
  const numero = (ajustes.whatsapp || "").replace(/\D/g, "");
  if (!numero) return null;

  const unidades = lineas.reduce((s, p) => s + carrito[p._id], 0);
  const total = lineas.reduce((s, p) => s + p.precio * carrito[p._id], 0);

  function abrir() {
    const texto = unidades
      ? textoPedido(lineas, carrito, ajustes)
      : `Hola ${ajustes.nombre}! Quisiera hacer una consulta sobre el catálogo${ajustes.periodo ? ` de ${ajustes.periodo}` : ""}.`;
    if (!unidades) toast("Tu pedido está vacío: se abrirá el chat para consultar.", 2200);
    window.open(`https://wa.me/${numero}?text=${encodeURIComponent(texto)}`, "_blank", "noopener");
  }

  return (
    <button
      type="button"
      className={`wa-flot${unidades ? " con-pedido" : ""}`}
      onClick={abrir}
      aria-label={unidades ? `Enviar pedido por WhatsApp: ${unidades} productos, ${fmt(total)}` : "Consultar por WhatsApp"}
      title={unidades ? `Enviar pedido (${unidades}) · ${fmt(total)}` : "Consultar por WhatsApp"}
    >
      <svg viewBox="0 0 32 32" width="30" height="30" aria-hidden="true">
        <path fill="currentColor" d="M16 3C9.1 3 3.5 8.6 3.5 15.5c0 2.4.7 4.7 1.9 6.7L3.3 29l7-1.9c1.9 1 4 1.6 6.1 1.6h.1c6.9 0 12.5-5.6 12.5-12.5S22.9 3 16 3zm0 22.8h-.1c-1.9 0-3.8-.5-5.4-1.5l-.4-.2-4.1 1.1 1.1-4-.3-.4c-1.1-1.7-1.6-3.6-1.6-5.6C5.3 9.8 10.1 5.1 16 5.1s10.7 4.8 10.7 10.6S21.9 25.8 16 25.8zm5.9-7.9c-.3-.2-1.9-.9-2.2-1-.3-.1-.5-.2-.7.2-.2.3-.8 1-1 1.2-.2.2-.4.2-.7.1-.3-.2-1.4-.5-2.6-1.6-1-.9-1.6-1.9-1.8-2.3-.2-.3 0-.5.1-.7l.5-.6c.2-.2.2-.3.3-.5.1-.2.1-.4 0-.6-.1-.2-.7-1.8-1-2.4-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.2 1.1-1.2 2.8s1.2 3.3 1.4 3.5c.2.2 2.4 3.6 5.7 5 .8.3 1.4.5 1.9.7.8.3 1.5.2 2.1.1.6-.1 1.9-.8 2.2-1.6.3-.8.3-1.4.2-1.6-.1-.1-.3-.2-.6-.4z" />
      </svg>
      {unidades > 0 && <b className="wa-n">{unidades}</b>}
      {unidades > 0 && <span className="wa-t">{fmt(total)}</span>}
    </button>
  );
}
