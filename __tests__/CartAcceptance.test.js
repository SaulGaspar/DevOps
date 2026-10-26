
/* global describe, test, expect */

import {
  act,
  fireEvent,
  render,
  waitFor,
  cleanup,
} from '@testing-library/react-native';

import { Pressable, Text } from 'react-native';

import CartScreen from '../src/screens/CartScreen';
import { CartProvider, useCart } from '../src/context/CartContext';
import { cartKey } from '../src/utils/cart';

const product = {
  id: '100',
  nombre: 'Tenis Nike Air',
  marca: 'Nike',
  precio: 1200,
  stock_total: 3,
  imagenUrl: '',
};

const key = cartKey(product, '26', 'Negro');

function CartSetup() {
  const { add } = useCart();

  return (
    <Pressable
      testID="acceptance-add-product"
      onPress={() => add(product, '26', 'Negro')}
    >
      <Text>Agregar producto de prueba</Text>
    </Pressable>
  );
}

async function press(screen, testID) {
  await act(async () => {
    fireEvent.press(screen.getByTestId(testID));
  });
}

describe('HU5 - Pruebas de aceptación del carrito', () => {
  test('PA-01: agregar, modificar cantidades y eliminar', async () => {
    const screen = await render(
      <CartProvider>
        <CartSetup />
        <CartScreen />
      </CartProvider>
    );

    // 1. Estado inicial.
    expect(
      screen.getByText('Tu carrito está vacío')
    ).toBeTruthy();

    // 2. Agregar producto mediante CartProvider real.
    await press(screen, 'acceptance-add-product');

    await waitFor(() => {
      expect(screen.getByText('Tenis Nike Air')).toBeTruthy();
      expect(
        screen.getByTestId(`cart-quantity-${key}`).props.children
      ).toBe(1);
      expect(
        screen.getByTestId('cart-subtotal').props.children
      ).toContain('1,200');
    });

    // 3. Aumentar cantidad.
    await press(screen, `cart-increase-${key}`);

    await waitFor(() => {
      expect(
        screen.getByTestId(`cart-quantity-${key}`).props.children
      ).toBe(2);
      expect(
        screen.getByTestId('cart-subtotal').props.children
      ).toContain('2,400');
    });

    // 4. Disminuir cantidad.
    await press(screen, `cart-decrease-${key}`);

    await waitFor(() => {
      expect(
        screen.getByTestId(`cart-quantity-${key}`).props.children
      ).toBe(1);
      expect(
        screen.getByTestId('cart-subtotal').props.children
      ).toContain('1,200');
    });

    // 5. Eliminar producto.
    await press(screen, `cart-remove-${key}`);

    await waitFor(() => {
      expect(
        screen.getByText('Tu carrito está vacío')
      ).toBeTruthy();

      expect(
        screen.queryByText('Tenis Nike Air')
      ).toBeNull();
    });

    // Liberar la pantalla dentro de act.
    await act(async () => {
      cleanup();
    });
  });
});
