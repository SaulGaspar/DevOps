
export const MAX_SEARCH_LENGTH = 120;

export function normalizeSearchTerm(value) {
  try {
    return String(value ?? '')
      .normalize('NFKC')
      .trim()
      .slice(0, MAX_SEARCH_LENGTH)
      .toLocaleLowerCase('es-MX');
  } catch {
    return '';
  }
}

export function searchCatalog(products, query) {
  if (!Array.isArray(products)) {
    return [];
  }

  const search = normalizeSearchTerm(query);

  if (!search) {
    return products;
  }

  return products.filter((product) => {
    const name = normalizeSearchTerm(product?.nombre);
    const brand = normalizeSearchTerm(product?.marca);

    return name.includes(search) || brand.includes(search);
  });
}
