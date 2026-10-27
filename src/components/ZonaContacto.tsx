import { forwardRef, type Ref } from "react";
import type { Contacto } from "../api";
import { FormularioContacto } from "./FormularioContacto";
import { InfoContacto } from "./InfoContacto";

type Props = { contacto: Contacto; refNombre: Ref<HTMLInputElement> };

/** Sección «Contáctanos» al final del catálogo: formulario a la izquierda, datos del negocio a la derecha. */
export const ZonaContacto = forwardRef<HTMLElement, Props>(function ZonaContacto({ contacto, refNombre }, ref) {
  return (
    <section className="wrap contacto" id="contacto" aria-labelledby="ct-titulo" ref={ref}>
      <div className="ct-box">
        <div className="ct-head">
          <h2 id="ct-titulo">✉️ Contáctanos</h2>
          <p>Llena el formulario y te contactaremos a la brevedad.</p>
        </div>
        <div className="ct-grid">
          <FormularioContacto ref={refNombre} telefonoNegocio={contacto.telefono} />
          <InfoContacto c={contacto} />
        </div>
      </div>
    </section>
  );
});
