import { resolveApiAssetUrl } from '../services/api';

export function parseProductOptions(value) {
  if (Array.isArray(value)) return value.map(String).map((item) => item.trim()).filter(Boolean);
  if (!value) return [];
  return String(value)
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

export function formatPrice(value) {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return '$0.00';
  return `$${amount.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function normalizeProduct(product = {}) {
  const images = Array.isArray(product.images)
    ? product.images.map((image) => image?.url || image).filter(Boolean)
    : [];
  const primaryImage = product.imagen || images[0] || '';

  return {
    ...product,
    id: String(product.id ?? ''),
    precio: Number(product.precio) || 0,
    stock_total: Number(product.stock_total) || 0,
    tallas: parseProductOptions(product.talla),
    coloresLista: parseProductOptions(product.colores),
    imagenUrl: primaryImage ? resolveApiAssetUrl(primaryImage) : '',
    imagenes: [...new Set([primaryImage, ...images].filter(Boolean))].map(resolveApiAssetUrl),
  };
}
