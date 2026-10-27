import { forwardRef, useEffect, useState, type FormEvent } from "react";
import { useMutation } from "convex/react";
import { ConvexError } from "convex/values";
import { enviarContacto } from "../api";
import { LIMITES, validarContacto, type DatosContacto, type ErroresContacto } from "../lib/contacto";

const KEY = "las3b:contacto";
const VACIO: DatosContacto = { nombre: "", telefono: "", correo: "", mensaje: "" };
const GRACIAS = "✅ ¡Gracias! Recibimos tu solicitud y te contactaremos a la brevedad.";

/** Nombre, teléfono y correo se recuerdan en este navegador (el mensaje no). */
function leerGuardado(): DatosContacto {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) || "{}");
    return { ...VACIO, nombre: String(v.nombre ?? ""), telefono: String(v.telefono ?? ""), correo: String(v.correo ?? "") };
  } catch {
    return VACIO;
  }
}

type Campo = keyof DatosContacto;
const CAMPOS: { k: Campo; label: string; full?: boolean; tipo?: string; modo?: "tel" | "email"; auto: string; ph: string }[] = [
  { k: "nombre", label: "Nombre", full: true, auto: "name", ph: "Tu nombre" },
  { k: "telefono", label: "Teléfono", tipo: "tel", modo: "tel", auto: "tel", ph: "+56 9 1234 5678" },
  { k: "correo", label: "Correo electrónico", tipo: "email", modo: "email", auto: "email", ph: "tucorreo@ejemplo.cl" },
];

type Props = { telefonoNegocio: string };

/** Formulario «Contáctanos»: valida en el navegador y envía a `contacto:enviar`, que vuelve a validar. */
export const FormularioContacto = forwardRef<HTMLInputElement, Props>(function FormularioContacto({ telefonoNegocio }, refNombre) {
  const enviar = useMutation(enviarContacto);
  const [datos, setDatos] = useState<DatosContacto>(leerGuardado);
  const [web, setWeb] = useState(""); // campo trampa para robots
  const [errores, setErrores] = useState<ErroresContacto>({});
  const [aviso, setAviso] = useState<{ t: string; tipo: "ok" | "fail" } | null>(null);
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify({ nombre: datos.nombre, telefono: datos.telefono, correo: datos.correo })); } catch { /* sin almacenamiento */ }
  }, [datos.nombre, datos.telefono, datos.correo]);

  const cambiar = (k: Campo, v: string) => {
    setDatos((d) => ({ ...d, [k]: v }));
    setErrores((e) => ({ ...e, [k]: undefined }));
  };

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (enviando) return;
    setAviso(null);
    const r = validarContacto(datos);
    setErrores(r.errores);
    const primero = (Object.keys(r.errores) as Campo[])[0];
    if (primero) {
      e.currentTarget.querySelector<HTMLElement>(`[name="${primero}"]`)?.focus();
      return;
    }
    setEnviando(true);
    try {
      await enviar({ ...r.datos, web });
      setDatos((d) => ({ ...d, mensaje: "" }));
      setAviso({ t: GRACIAS, tipo: "ok" });
    } catch (err) {
      const data = err instanceof ConvexError ? (err.data as unknown) : null;
      if (data && typeof data === "object" && "campos" in data) {
        setErrores((data as { campos: ErroresContacto }).campos);
      } else {
        // un ConvexError con texto (p. ej. demasiados envíos) se muestra tal cual; un fallo de red, el aviso genérico
        const t = typeof data === "string" ? data
          : `No pudimos enviar tu solicitud en este momento. Inténtalo de nuevo en unos minutos${telefonoNegocio ? ` o llámanos al ${telefonoNegocio}` : ""}.`;
        setAviso({ t, tipo: "fail" });
      }
    } finally {
      setEnviando(false);
    }
  }

  const campo = (k: Campo) => ({
    id: `ct-${k}`,
    name: k,
    value: datos[k],
    maxLength: LIMITES[k],
    "aria-required": true,
    "aria-invalid": !!errores[k],
    "aria-describedby": `ct-err-${k}`,
    className: errores[k] ? "bad" : undefined,
  });
  const error = (k: Campo) => <span className="ct-err" id={`ct-err-${k}`} role="alert">{errores[k]}</span>;

  return (
    <form className="ct-form" noValidate onSubmit={(e) => void onSubmit(e)}>
      {CAMPOS.map((c) => (
        <div key={c.k} className={`ct-f${c.full ? " full" : ""}`}>
          <label htmlFor={`ct-${c.k}`}>{c.label}</label>
          <input {...campo(c.k)} ref={c.k === "nombre" ? refNombre : undefined} type={c.tipo ?? "text"} inputMode={c.modo} autoComplete={c.auto} placeholder={c.ph}
            onChange={(e) => cambiar(c.k, e.target.value)} />
          {error(c.k)}
        </div>
      ))}
      <div className="ct-f full">
        <label htmlFor="ct-mensaje">Mensaje</label>
        <textarea {...campo("mensaje")} rows={5} placeholder="Escribe tu mensaje aquí…" onChange={(e) => cambiar("mensaje", e.target.value)} />
        {error("mensaje")}
      </div>
      <div className="ct-hp" aria-hidden="true">
        <label>No llenar este campo<input tabIndex={-1} autoComplete="off" value={web} onChange={(e) => setWeb(e.target.value)} /></label>
      </div>
      <div className="ct-actions">
        <button type="submit" className="ct-send" disabled={enviando}>{enviando ? "Enviando…" : "Enviar solicitud"}</button>
      </div>
      <p className={`ct-note${aviso ? " " + aviso.tipo : ""}`} role="status">{aviso?.t}</p>
    </form>
  );
});
