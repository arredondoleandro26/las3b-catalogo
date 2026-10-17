import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from "react";

const ToastCtx = createContext<(msg: string, ms?: number) => void>(() => {});

export function ToastProvider({ children }: { children: ReactNode }) {
  const [msg, setMsg] = useState("");
  const [show, setShow] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  const toast = useCallback((m: string, ms = 2800) => {
    setMsg(m); setShow(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setShow(false), ms);
  }, []);
  const value = useMemo(() => toast, [toast]);
  return (
    <ToastCtx.Provider value={value}>
      {children}
      <div className={`toast${show ? " show" : ""}`} role="status">{msg}</div>
    </ToastCtx.Provider>
  );
}

export const useToast = () => useContext(ToastCtx);
