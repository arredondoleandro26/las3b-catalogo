import { useCallback, useEffect, useState } from "react";

const KEY = "las3b:carrito";
export type Carrito = Record<string, number>;

function leer(): Carrito {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) || "{}");
    return v && typeof v === "object" ? v : {};
  } catch {
    return {};
  }
}

/** Cantidades por producto, recordadas en este navegador. */
export function useCarrito() {
  const [carrito, setCarrito] = useState<Carrito>(leer);
  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(carrito)); } catch {}
  }, [carrito]);

  const setCantidad = useCallback((id: string, n: number) => {
    n = Math.max(0, Math.min(99, Math.round(n)));
    setCarrito((c) => {
      const next = { ...c };
      if (n) next[id] = n; else delete next[id];
      return next;
    });
  }, []);
  const vaciar = useCallback(() => setCarrito({}), []);

  return { carrito, setCantidad, vaciar };
}
