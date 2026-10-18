import { fireEvent, render, waitFor } from '@testing-library/react-native';
import ProductCard from '../src/components/ProductCard';

const producto = {
  id: 'producto-qa-01',
  nombre: 'Tenis deportivos',
  marca: 'Nike',
  categoria: 'Calzado',
  precio: 1299,
  stock_total: 5,
  imagenUrl: 'https://ejemplo.com/tenis.jpg',
};

describe('HU3 #9 - Tarjeta de producto', () => {
  test('CP-07: muestra el nombre del producto', async () => {
    const { getByText } = await render(
      <ProductCard product={producto} onPress={() => {}} />
    );

    expect(getByText('Tenis deportivos')).toBeTruthy();
    expect(getByText('Nike')).toBeTruthy();
  });

  test('CP-08: muestra el precio formateado', async () => {
    const { getByText } = await render(
      <ProductCard product={producto} onPress={() => {}} />
    );

    expect(
      getByText('$1,299.00')
    ).toBeTruthy();
  });

  test('CP-09: muestra la cantidad disponible', async () => {
    const { getByText } = await render(
      <ProductCard product={producto} onPress={() => {}} />
    );

    expect(getByText('5 disponibles')).toBeTruthy();
  });

  test('CP-10: identifica productos agotados', async () => {
    const agotado = {
      ...producto,
      stock_total: 0,
    };

    const { getByText } = await render(
      <ProductCard product={agotado} onPress={() => {}} />
    );

    expect(getByText('Agotado')).toBeTruthy();
    expect(getByText('Sin existencias')).toBeTruthy();
  });

  test('CP-11: ejecuta la accion al seleccionar producto', async () => {
    const onPress = jest.fn();

    const { getByLabelText } = await render(
      <ProductCard product={producto} onPress={onPress} />
    );

    fireEvent.press(getByLabelText('Ver Tenis deportivos'));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  test('CP-12: integra la imagen del producto', async () => {
    const { getByLabelText } = await render(
      <ProductCard product={producto} onPress={() => {}} />
    );

    const imagen = getByLabelText('Imagen de Tenis deportivos');

    expect(imagen).toBeTruthy();
    expect(imagen.props.source.uri).toBe(producto.imagenUrl);
  });

    
test('CP-13: muestra la categoria cuando no existe marca', async () => {
  const productoSinMarca = {
    ...producto,
    marca: '',
    categoria: 'Ropa deportiva',
  };

  const { getByText } = await render(
    <ProductCard
      product={productoSinMarca}
      onPress={() => {}}
    />
  );

  expect(getByText('Ropa deportiva')).toBeTruthy();
});
  
test('CP-14: muestra SportLike cuando no hay marca ni categoria', async () => {
  const productoSinMarcaNiCategoria = {
    ...producto,
    marca: '',
    categoria: '',
  };

  const { getByText } = await render(
    <ProductCard
      product={productoSinMarcaNiCategoria}
      onPress={() => {}}
    />
  );

  expect(getByText('SportLike')).toBeTruthy();
});
  

  




});
