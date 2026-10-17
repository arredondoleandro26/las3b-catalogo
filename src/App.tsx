import { useEffect, useMemo, useState } from "react";
import { useQuery } from "convex/react";
import { obtenerCatalogo, type Catalogo } from "./api";
import { Tarjeta } from "./components/Tarjeta";
import { Carrito } from "./components/Carrito";
import { useCarrito } from "./hooks/useCarrito";
import { fmt, norm } from "./lib/formato";

export default function App() {
  const datos = useQuery(obtenerCatalogo, {});
  if (datos === undefined) {
    return <div className="cargando"><span className="sp" /><br />Cargando catálogo…</div>;
  }
  return <Catalogo datos={datos} />;
}

function Catalogo({ datos }: { datos: Catalogo }) {
  const { ajustes, categorias, productos } = datos;
  const { carrito, setCantidad, vaciar } = useCarrito();
  const [busqueda, setBusqueda] = useState("");
  const [soloStock, setSoloStock] = useState(false);
  const [carritoAbierto, setCarritoAbierto] = useState(false);
  const [mostrarArriba, setMostrarArriba] = useState(false);

  useEffect(() => {
    document.documentElement.style.setProperty("--brand", ajustes.color || "#0b7f80");
    document.title = `${ajustes.titulo} ${ajustes.nombre}` + (ajustes.periodo ? ` – ${ajustes.periodo}` : "");
  }, [ajustes.color, ajustes.titulo, ajustes.nombre, ajustes.periodo]);

  useEffect(() => {
    const h = () => setMostrarArriba(window.scrollY > 700);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") setCarritoAbierto(false); };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, []);

  const palabras = useMemo(() => norm(busqueda).split(/\s+/).filter(Boolean), [busqueda]);
  const buscando = palabras.length > 0;
  useEffect(() => { document.body.classList.toggle("searching", buscando); }, [buscando]);

  const catPorId = useMemo(() => new Map(categorias.map((c) => [c._id, c])), [categorias]);

  /** Productos visibles agrupados por categoría (ya vienen sin descontinuados). */
  const secciones = useMemo(() => {
    return categorias
      .map((c) => {
        const lista = productos.filter((p) => {
          if (p.catId !== c._id) return false;
          if (soloStock && p.estado !== "disponible") return false;
          if (!buscando) return true;
          const hay = norm(p.nombre + " " + c.nombre);
          return palabras.every((w) => hay.includes(w));
        });
        return { cat: c, lista };
      })
      .filter((s) => s.lista.length > 0);
  }, [categorias, productos, soloStock, buscando, palabras]);

  const conteo = (catId: string) => productos.filter((p) => p.catId === catId).length;
  const tiles = categorias.filter((c) => conteo(c._id) > 0);

  const lineas = productos.filter((p) => carrito[p._id] && p.estado === "disponible");
  const unidades = lineas.reduce((s, p) => s + carrito[p._id], 0);
  const total = lineas.reduce((s, p) => s + p.precio * carrito[p._id], 0);

  const irA = (id: string) => { document.getElementById(`cat-${id}`)?.scrollIntoView(); };

  // Los filtros se repiten: en la barra superior (escritorio) y bajo la portada (móvil)
  const filtros = (extra: string) => (
    <>
      <select className={`jump ${extra}`} aria-label="Ir a departamento" value="" onChange={(e) => irA(e.target.value)}>
        <option value="">Ir a departamento…</option>
        {tiles.map((c) => <option key={c._id} value={c._id}>{c.icono} {c.nombre}</option>)}
      </select>
      <label className={`chk ${extra}`}><input type="checkbox" className="avail" checked={soloStock} onChange={(e) => setSoloStock(e.target.checked)} /><span>Solo con stock</span></label>
    </>
  );

  return (
    <>
      <header className="topbar">
        <div className="wrap bar">
          <a className="brand" href="#top"><span className="brand-ico">🫧</span><span id="brandName">{ajustes.nombre}</span></a>
          <div className="search"><span className="sico">🔍</span>
            <input type="search" placeholder="Buscar producto…" aria-label="Buscar producto" autoComplete="off" value={busqueda}
              onChange={(e) => { setBusqueda(e.target.value); if (e.target.value.trim()) setTimeout(() => document.getElementById("secciones")?.scrollIntoView(), 150); }} />
          </div>
          {filtros("desk")}
          <span className="grow" />
          <button type="button" className="cartbtn" aria-label="Ver mi pedido" onClick={() => setCarritoAbierto(true)}>
            🛒 <b>{unidades}</b> <span id="cartTotal">{unidades ? fmt(total) : ""}</span>
          </button>
        </div>
      </header>

      <main id="top">
        <section className="hero wrap">
          {ajustes.bannerUrl && <img className="banner" src={ajustes.bannerUrl} alt={ajustes.nombre} />}
          <h1>{ajustes.titulo}</h1>
          <div className="pills">
            {ajustes.periodo && <span className="pill y">📅 Actualizado a la fecha: {ajustes.periodo}</span>}
            {ajustes.precioNota && <span className="pill b">{ajustes.precioNota}</span>}
          </div>
          {ajustes.aviso && <p className="aviso">{ajustes.aviso}</p>}
        </section>

        <section className="wrap filters">{filtros("")}</section>

        <section className="wrap tiles-wrap">
          <h2 className="sec-title">Departamentos</h2>
          <nav className="tiles">
            {tiles.map((c, i) => {
              const n = conteo(c._id);
              return (
                <a key={c._id} className="tile" href={`#cat-${c._id}`} style={{ ["--h" as string]: (i * 47 + 175) % 360 }}
                  onClick={(e) => { e.preventDefault(); irA(c._id); }}>
                  <span className="ti">{c.icono}</span><span className="tn">{c.nombre}</span><span className="tc">{n} producto{n === 1 ? "" : "s"}</span>
                </a>
              );
            })}
          </nav>
        </section>

        <div className="wrap" id="secciones">
          {secciones.length === 0 && (
            <div className="empty">😕 No encontramos productos{buscando ? ` para “${busqueda}”` : ""}.</div>
          )}
          {secciones.map(({ cat, lista }) => (
            <section className="cat" id={`cat-${cat._id}`} key={cat._id}>
              <div className="cat-head">
                <span className="cat-icon">{cat.icono}</span>
                <h2>{cat.nombre}</h2>
                <span className="count">{lista.length} producto{lista.length === 1 ? "" : "s"}</span>
              </div>
              <div className="grid">
                {lista.map((p) => (
                  <Tarjeta key={p._id} p={p} icono={catPorId.get(p.catId)?.icono ?? "🛍️"} cantidad={carrito[p._id] || 0} onCantidad={setCantidad} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>

      <footer className="pie">
        <div className="t">{ajustes.nombre}</div>
        <p>{ajustes.pie}</p>
        {ajustes.periodo && <small>Catálogo actualizado a {ajustes.periodo}</small>}
      </footer>

      <Carrito abierto={carritoAbierto} onCerrar={() => setCarritoAbierto(false)} lineas={lineas} carrito={carrito} onCantidad={setCantidad} onVaciar={vaciar} ajustes={ajustes} />

      <button type="button" className={`totop${mostrarArriba ? " show" : ""}`} aria-label="Subir" onClick={() => window.scrollTo({ top: 0 })}>↑</button>
    </>
  );
}
