export function cartKey(product, size = '', color = '') { return JSON.stringify([String(product.id), size, color]); }
export function addCartItem(items, product, size = '', color = '') {
  if (!product.id || !Number.isFinite(product.precio) || product.precio < 0 || product.stock_total <= 0) return items;
  const used = items.filter((item) => item.product.id === product.id).reduce((sum, item) => sum + item.quantity, 0);
  if (used >= product.stock_total) return items;
  const key = cartKey(product, size, color);
  return items.some((item) => item.key === key) ? items.map((item) => item.key === key ? { ...item, quantity: item.quantity + 1 } : item)
    : [...items, { key, product, size, color, quantity: 1 }];
}
export function changeCartQuantity(items, key, quantity) {
  if (!Number.isInteger(quantity) || quantity < 1) return items;
  const target = items.find((item) => item.key === key);
  if (!target) return items;
  const otherUnits = items.filter((item) => item.product.id === target.product.id && item.key !== key).reduce((sum, item) => sum + item.quantity, 0);
  if (quantity + otherUnits > target.product.stock_total) return items;
  return items.map((item) => item.key === key ? { ...item, quantity } : item);
}
