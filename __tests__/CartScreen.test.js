
/* global jest, describe, test, expect, beforeEach */

import {
  act,
  fireEvent,
  render,
  waitFor,
} from '@testing-library/react-native';

import CartScreen from '../src/screens/CartScreen';
import { useCart } from '../src/context/CartContext';
import { cartKey } from '../src/utils/cart';

jest.mock('../src/context/CartContext', () => ({
  useCart: jest.fn(),
}));

const product = {
  id: '1',
  nombre: 'Tenis Nike Air',
  marca: 'Nike',
  precio: 1200,
  stock_total: 3,
  imagenUrl: '',
};

const key = cartKey(product, '26', 'Negro');

let cartState;
let setQuantityMock;
let removeMock;

function setCart(quantity = 1) {
  cartState = {
    items: [
      {
        key,
        product,
        size: '26',
        color: 'Negro',
        quantity,
      },
    ],
    count: quantity,
    subtotal: product.precio * quantity,
    setQuantity: setQuantityMock,
    remove: removeMock,
  };
}

describe('HU5 #12 - Pantalla del carrito', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    setQuantityMock = jest.fn();
    removeMock = jest.fn();

    cartState = {
      items: [],
      count: 0,
      subtotal: 0,
      setQuantity: setQuantityMock,
      remove: removeMock,
    };

    useCart.mockImplementation(() => cartState);
  });

  test('CP-14: muestra el carrito vacío', async () => {
    const screen = await render(<CartScreen />);

    expect(
      screen.getByText('Tu carrito está vacío')
    ).toBeTruthy();
  });

  test('CP-15: muestra producto, talla, color y subtotal', async () => {
    setCart(1);

    const screen = await render(<CartScreen />);

    expect(screen.getByText('Tenis Nike Air')).toBeTruthy();
    expect(screen.getByText('Talla: 26')).toBeTruthy();
    expect(screen.getByText('Color: Negro')).toBeTruthy();
    expect(screen.getByTestId('cart-subtotal')).toBeTruthy();
    expect(screen.getByText('Productos seleccionados (1)')).toBeTruthy();
  });

  test('CP-16: aumenta la cantidad solicitada', async () => {
    setCart(1);

    const screen = await render(<CartScreen />);

    await act(async () => {
      fireEvent.press(screen.getByTestId(`cart-increase-${key}`));
    });

    expect(setQuantityMock).toHaveBeenCalledWith(key, 2);
  });

  test('CP-17: disminuye la cantidad solicitada', async () => {
    setCart(2);

    const screen = await render(<CartScreen />);

    await act(async () => {
      fireEvent.press(screen.getByTestId(`cart-decrease-${key}`));
    });

    expect(setQuantityMock).toHaveBeenCalledWith(key, 1);
  });

  test('CP-18: no permite disminuir de una unidad', async () => {
    setCart(1);

    const screen = await render(<CartScreen />);

    await act(async () => {
      fireEvent.press(screen.getByTestId(`cart-decrease-${key}`));
    });

    expect(setQuantityMock).not.toHaveBeenCalled();
  });

  test('CP-19: no permite aumentar cuando alcanza el stock', async () => {
    setCart(3);

    const screen = await render(<CartScreen />);

    await act(async () => {
      fireEvent.press(screen.getByTestId(`cart-increase-${key}`));
    });

    expect(setQuantityMock).not.toHaveBeenCalled();
    expect(
      screen.getByText(/Has alcanzado las unidades disponibles/)
    ).toBeTruthy();
  });

  test('CP-20: solicita eliminar el producto', async () => {
    setCart(1);

    const screen = await render(<CartScreen />);

    await act(async () => {
      fireEvent.press(screen.getByTestId(`cart-remove-${key}`));
    });

    expect(removeMock).toHaveBeenCalledWith(key);
  });

  test('CP-21: muestra el subtotal correspondiente a la cantidad', async () => {
    setCart(2);

    const screen = await render(<CartScreen />);

    await waitFor(() => {
      expect(
        screen.getByTestId('cart-subtotal').props.children
      ).toContain('2,400');
    });
  });
});
