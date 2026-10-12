import { createContext, useContext, useMemo, useState } from 'react';
import { addCartItem, changeCartQuantity } from '../utils/cart';
const CartContext = createContext(null);
export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const value = useMemo(() => ({
    items, count: items.reduce((sum, item) => sum + item.quantity, 0),
    subtotal: items.reduce((sum, item) => sum + item.product.precio * item.quantity, 0),
    add: (product, size, color) => setItems((current) => addCartItem(current, product, size, color)),
    setQuantity: (key, quantity) => setItems((current) => changeCartQuantity(current, key, quantity)),
    remove: (key) => setItems((current) => current.filter((item) => item.key !== key)), clear: () => setItems([]),
  }), [items]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
export function useCart() { return useContext(CartContext); }
