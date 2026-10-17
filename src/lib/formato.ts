export const num = (n: number) =>
  Math.round(n)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");

export const fmt = (n: number) => "$" + num(n);

/** Minúsculas y sin acentos, para buscar. */
export const norm = (s: string) =>
  String(s)
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
