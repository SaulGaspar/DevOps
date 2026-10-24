export function filterCatalog(products, filters = {}) {
  if (!Array.isArray(products)) return [];

  const {
    categoria = '',
    marca = '',
    precioMin = '',
    precioMax = '',
    talla = '',
  } = filters;

  const min = precioMin === '' ? null : Number(precioMin);
  const max = precioMax === '' ? null : Number(precioMax);

  return products.filter((product) => {
    if (
      categoria &&
      product.categoria !== categoria
    ) {
      return false;
    }

    if (
      marca &&
      String(product.marca ?? '').toLocaleLowerCase() !==
        String(marca).toLocaleLowerCase()
    ) {
      return false;
    }

    const precio = Number(product.precio);

    if (min !== null && Number.isFinite(min) && precio < min) {
      return false;
    }

    if (max !== null && Number.isFinite(max) && precio > max) {
      return false;
    }

    if (talla) {
      const tallas = Array.isArray(product.tallas)
        ? product.tallas
        : [];

      if (!tallas.map(String).includes(String(talla))) {
        return false;
      }
    }

    return true;
  });
}