export function filterCatalog(products, filters = {}) {
  if (!Array.isArray(products) || !filters || typeof filters !== 'object') return [];

  const {
    categoria = '',
    marca = '',
    precioMin = '',
    precioMax = '',
    talla = '',
  } = filters;

  const min = precioMin === '' ? null : Number(precioMin);
  const max = precioMax === '' ? null : Number(precioMax);

  if (
    (min !== null && (!Number.isFinite(min) || min < 0)) ||
    (max !== null && (!Number.isFinite(max) || max < 0)) ||
    (min !== null && max !== null && min > max)
  ) {
    return [];
  }

  return products.filter((product) => {
    if (
      categoria &&
      String(product?.categoria ?? '') !== String(categoria)
    ) {
      return false;
    }

    if (
      marca &&
      String(product?.marca ?? '').toLocaleLowerCase() !==
        String(marca).toLocaleLowerCase()
    ) {
      return false;
    }

    const precio = Number(product?.precio);

    if (!Number.isFinite(precio) || precio < 0) {
      return false;
    }

    if (min !== null && Number.isFinite(min) && precio < min) {
      return false;
    }

    if (max !== null && Number.isFinite(max) && precio > max) {
      return false;
    }

    if (talla) {
      const tallas = Array.isArray(product?.tallas)
        ? product.tallas
        : [];

      if (!tallas.map(String).includes(String(talla))) {
        return false;
      }
    }

    return true;
  });
}
