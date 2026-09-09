import { products } from "./commerce-products.js";

export const CATALOG_PAGE_SIZE = 24;
export const CATALOG_PAGE_COUNT = Math.ceil(
  products.length / CATALOG_PAGE_SIZE,
);

export function catalogPageProducts(page) {
  const number = Number(page);
  if (!Number.isInteger(number) || number < 1 || number > CATALOG_PAGE_COUNT)
    return null;
  const start = (number - 1) * CATALOG_PAGE_SIZE;
  return products.slice(start, start + CATALOG_PAGE_SIZE);
}

export const catalogPagePath = (page) =>
  Number(page) === 1 ? "/catalogo" : `/catalogo/pagina/${page}`;
