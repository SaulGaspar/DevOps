function validItems(items) {
  return Array.isArray(items) ? items : [];
}

function validProduct(product) {
  return Boolean(
    product &&
    typeof product === 'object' &&
    product.id !== undefined &&
    product.id !== null &&
    String(product.id).trim() &&
    Number.isFinite(product.precio) &&
    product.precio >= 0 &&
    Number.isInteger(product.stock_total) &&
    product.stock_total > 0,
  );
}

function itemQuantity(item) {
  return Number.isInteger(item?.quantity) && item.quantity > 0 ? item.quantity : 0;
}

export function cartKey(product, size = '', color = '') {
  if (!validProduct(product)) return '';
  return JSON.stringify([String(product.id), String(size), String(color)]);
}

export function addCartItem(items, product, size = '', color = '') {
  const safeItems = validItems(items);
  if (!validProduct(product)) return safeItems;
  const used = safeItems
    .filter((item) => item?.product?.id === product.id)
    .reduce((sum, item) => sum + itemQuantity(item), 0);
  if (used >= product.stock_total) return safeItems;
  const key = cartKey(product, size, color);
  return safeItems.some((item) => item?.key === key)
    ? safeItems.map((item) => item?.key === key
      ? { ...item, quantity: itemQuantity(item) + 1 }
      : item)
    : [...safeItems, { key, product, size: String(size), color: String(color), quantity: 1 }];
}

export function changeCartQuantity(items, key, quantity) {
  const safeItems = validItems(items);
  if (!Number.isInteger(quantity) || quantity < 1) return safeItems;
  const target = safeItems.find((item) => item?.key === key);
  if (!target || !validProduct(target.product)) return safeItems;
  const otherUnits = safeItems
    .filter((item) => item?.product?.id === target.product.id && item?.key !== key)
    .reduce((sum, item) => sum + itemQuantity(item), 0);
  if (quantity + otherUnits > target.product.stock_total) return safeItems;
  return safeItems.map((item) => item?.key === key ? { ...item, quantity } : item);
}
