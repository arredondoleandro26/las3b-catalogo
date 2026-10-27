import type { ReactNode } from "react";
import type { Contacto } from "../api";
import { enlaceRed, textoRed } from "../lib/contacto";

const IconoInstagram = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
    <rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.3" cy="6.7" r="1" fill="currentColor" stroke="none" />
  </svg>
);

type Item = { icono: ReactNode; clase?: string; contenido: ReactNode };

function Enlace({ href, externo, children }: { href: string; externo?: boolean; children: ReactNode }) {
  if (!href) return <>{children}</>;
  return <a href={href} {...(externo ? { target: "_blank", rel: "noopener" } : {})}>{children}</a>;
}

function Seccion({ titulo, items }: { titulo: string; items: (Item | false)[] }) {
  const visibles = items.filter((x): x is Item => !!x);
  if (!visibles.length) return null;
  return (
    <div className="ct-sec">
      <h3>{titulo}</h3>
      <ul>
        {visibles.map((it, i) => (
          <li key={i}><span className={`ci${it.clase ? " " + it.clase : ""}`} aria-hidden="true">{it.icono}</span><span className="tx">{it.contenido}</span></li>
        ))}
      </ul>
    </div>
  );
}

/** Panel derecho de «Contáctanos»: teléfono, correo, redes, horario y dirección. Lo vacío no se muestra. */
export function InfoContacto({ c }: { c: Contacto }) {
  const tel = c.telefono.replace(/[^\d+]/g, "");
  const horarios = c.horario.split("\n").map((x) => x.trim()).filter(Boolean);
  if (!c.telefono && !c.correo && !c.instagram && !c.facebook && !horarios.length && !c.direccion) return null;
  return (
    <aside className="ct-info" aria-label="Medios de contacto">
      <Seccion titulo="Llámanos" items={[!!c.telefono && { icono: "📞", contenido: <Enlace href={tel && `tel:${tel}`}>{c.telefono}</Enlace> }]} />
      <Seccion titulo="Escríbenos" items={[!!c.correo && { icono: "✉️", contenido: <Enlace href={`mailto:${c.correo}`}>{c.correo}</Enlace> }]} />
      <Seccion titulo="Síguenos" items={[
        !!c.instagram && { icono: <IconoInstagram />, clase: "ig", contenido: <Enlace href={enlaceRed(c.instagram, "https://www.instagram.com/")} externo>{textoRed(c.instagram)}</Enlace> },
        !!c.facebook && { icono: "f", clase: "fb", contenido: <Enlace href={enlaceRed(c.facebook, "https://www.facebook.com/")} externo>{textoRed(c.facebook)}</Enlace> },
      ]} />
      <Seccion titulo="Horario" items={horarios.map((h) => ({ icono: "🕘", contenido: h }))} />
      <Seccion titulo="Visítanos" items={[!!c.direccion && { icono: "📍", contenido: c.direccion }]} />
    </aside>
  );
}
