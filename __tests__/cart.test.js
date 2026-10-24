
import { describe, expect, test } from '@jest/globals';
import {
  cartKey,
  addCartItem,
  changeCartQuantity,
} from '../src/utils/cart';

const producto = {
  id: '1',
  nombre: 'Tenis Nike Air',
  precio: 1200,
  stock_total: 3,
};

const otroProducto = {
  id: '2',
  nombre: 'Playera Adidas',
  precio: 500,
  stock_total: 5,
};

describe('HU5 #12 - Lógica del carrito de compras', () => {
  test('CP-01: agrega un producto al carrito', () => {
    const resultado = addCartItem([], producto, '26', 'Negro');

    expect(resultado).toHaveLength(1);
    expect(resultado[0].quantity).toBe(1);
    expect(resultado[0].size).toBe('26');
    expect(resultado[0].color).toBe('Negro');
  });

  test('CP-02: suma cantidad al agregar el mismo producto y variante', () => {
    const primero = addCartItem([], producto, '26', 'Negro');
    const resultado = addCartItem(primero, producto, '26', 'Negro');

    expect(resultado).toHaveLength(1);
    expect(resultado[0].quantity).toBe(2);
  });

  test('CP-03: separa productos con diferente talla', () => {
    const primero = addCartItem([], producto, '26', 'Negro');
    const resultado = addCartItem(primero, producto, '27', 'Negro');

    expect(resultado).toHaveLength(2);
  });

  test('CP-04: respeta el stock al agregar productos', () => {
    let carrito = [];

    for (let i = 0; i < 4; i += 1) {
      carrito = addCartItem(carrito, producto, '26', 'Negro');
    }

    expect(carrito[0].quantity).toBe(3);
  });

  test('CP-05: permite aumentar la cantidad', () => {
    const carrito = addCartItem([], producto, '26', 'Negro');
    const key = cartKey(producto, '26', 'Negro');

    const resultado = changeCartQuantity(carrito, key, 2);

    expect(resultado[0].quantity).toBe(2);
  });

  test('CP-06: permite disminuir la cantidad', () => {
    let carrito = addCartItem([], producto, '26', 'Negro');
    const key = cartKey(producto, '26', 'Negro');

    carrito = changeCartQuantity(carrito, key, 3);
    const resultado = changeCartQuantity(carrito, key, 2);

    expect(resultado[0].quantity).toBe(2);
  });

  test('CP-07: impide superar el stock', () => {
    const carrito = addCartItem([], producto, '26', 'Negro');
    const key = cartKey(producto, '26', 'Negro');

    const resultado = changeCartQuantity(carrito, key, 5);

    expect(resultado[0].quantity).toBe(1);
  });

  test('CP-08: rechaza cantidades menores a uno', () => {
    const carrito = addCartItem([], producto, '26', 'Negro');
    const key = cartKey(producto, '26', 'Negro');

    const resultado = changeCartQuantity(carrito, key, 0);

    expect(resultado[0].quantity).toBe(1);
  });

  test('CP-09: no agrega productos sin existencias', () => {
    const agotado = { ...producto, stock_total: 0 };

    expect(addCartItem([], agotado)).toEqual([]);
  });

  test('CP-10: permite agregar productos diferentes', () => {
    const primero = addCartItem([], producto, '26', 'Negro');
    const resultado = addCartItem(primero, otroProducto, 'M', 'Azul');

    expect(resultado).toHaveLength(2);
  });

  test('CP-11: permite eliminar un artículo por su clave', () => {
    let carrito = addCartItem([], producto, '26', 'Negro');
    carrito = addCartItem(carrito, otroProducto, 'M', 'Azul');

    const key = cartKey(producto, '26', 'Negro');
    const resultado = carrito.filter((item) => item.key !== key);

    expect(resultado).toHaveLength(1);
    expect(resultado[0].product.id).toBe('2');
  });

  test('CP-12: calcula correctamente el subtotal', () => {
    let carrito = addCartItem([], producto, '26', 'Negro');
    carrito = addCartItem(carrito, otroProducto, 'M', 'Azul');

    const key = cartKey(producto, '26', 'Negro');
    carrito = changeCartQuantity(carrito, key, 2);

    const subtotal = carrito.reduce(
      (sum, item) => sum + item.product.precio * item.quantity,
      0
    );

    expect(subtotal).toBe(2900);
  });

  test('CP-13: respeta el stock compartido entre tallas', () => {
    let carrito = addCartItem([], producto, '26', 'Negro');
    carrito = addCartItem(carrito, producto, '27', 'Negro');

    const key = cartKey(producto, '26', 'Negro');
    carrito = changeCartQuantity(carrito, key, 3);

    expect(carrito.find((item) => item.key === key).quantity).toBe(1);
  });
});
