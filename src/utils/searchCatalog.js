
export function searchCatalog(products, query) {
  if (!Array.isArray(products)) {
    return [];
  }

  const search = String(query ?? '')
    .trim()
    .toLocaleLowerCase();

  if (!search) {
    return products;
  }

  return products.filter((product) => {
    const name = String(product.nombre ?? '').toLocaleLowerCase();
    const brand = String(product.marca ?? '').toLocaleLowerCase();

    return name.includes(search) || brand.includes(search);
  });
}
