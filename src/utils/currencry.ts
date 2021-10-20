export const toBrl = (quantity: number = 0.0): string =>
  quantity.toLocaleString("pt-br", { style: "currency", currency: "BRL" });
