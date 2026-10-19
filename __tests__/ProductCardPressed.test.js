
import { render } from '@testing-library/react-native';
import ProductCard from '../src/components/ProductCard';

jest.mock('react-native/Libraries/Components/Pressable/Pressable', () => {
  const React = require('react');
  const { View } = require('react-native');

  function MockPressable({ style, children, ...props }) {
    const estilo = typeof style === 'function'
      ? style({ pressed: true })
      : style;

    return React.createElement(
      View,
      {
        ...props,
        testID: 'tarjeta-presionada',
        style: estilo,
      },
      children
    );
  }

  return {
    __esModule: true,
    default: MockPressable,
  };
});

const producto = {
  id: 'producto-qa-01',
  nombre: 'Tenis deportivos',
  marca: 'Nike',
  categoria: 'Calzado',
  precio: 1299,
  stock_total: 5,
  imagenUrl: 'https://ejemplo.com/tenis.jpg',
};

test('CP-15: aplica estilo visual cuando la tarjeta esta presionada', async () => {
  const { getByTestId } = await render(
    <ProductCard product={producto} onPress={() => {}} />
  );

  const tarjeta = getByTestId('tarjeta-presionada');

  expect(tarjeta.props.style).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        opacity: 0.78,
        transform: [{ scale: 0.99 }],
      }),
    ])
  );
});
