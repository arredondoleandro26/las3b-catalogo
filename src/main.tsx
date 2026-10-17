import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import App from "./App";
import { ToastProvider } from "./hooks/useToast";
import "./styles.css";

const url = import.meta.env.VITE_CONVEX_URL as string | undefined;
const root = createRoot(document.getElementById("root")!);

if (!url) {
  root.render(
    <div className="error">
      <b>Falta configurar la conexión.</b> Define la variable <code>VITE_CONVEX_URL</code> con la URL del deployment de Convex (ver <code>.env.example</code>).
    </div>,
  );
} else {
  const convex = new ConvexReactClient(url);
  root.render(
    <StrictMode>
      <ConvexProvider client={convex}>
        <ToastProvider>
          <App />
        </ToastProvider>
      </ConvexProvider>
    </StrictMode>,
  );
}
