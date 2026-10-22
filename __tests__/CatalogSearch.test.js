
/* global jest, describe, test, expect, beforeEach */

import {
  act,
  fireEvent,
  render,
  waitFor,
} from '@testing-library/react-native';

import CatalogScreen from '../src/screens/CatalogScreen';
import { productApi } from '../src/services/api';

jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
  },
}));

jest.mock('../src/services/api', () => ({
  productApi: {
    list: jest.fn(),
    categories: jest.fn(),
  },
  resolveApiAssetUrl: jest.fn((url) => url),
}));

describe('HU4 #10 - Búsqueda en la pantalla del catálogo', () => {
  const products = [
    {
      id: 1,
      nombre: 'Tenis Nike Air',
      marca: 'Nike',
      categoria: 'Calzado',
      precio: 1299,
      stock_total: 10,
    },
    {
      id: 2,
      nombre: 'Playera Adidas',
      marca: 'Adidas',
      categoria: 'Ropa',
      precio: 499,
      stock_total: 8,
    },
    {
      id: 3,
      nombre: 'Balón Wilson',
      marca: 'Wilson',
      categoria: 'Accesorios',
      precio: 350,
      stock_total: 6,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();

    productApi.list.mockResolvedValue(products);

    productApi.categories.mockResolvedValue([
      'Calzado',
      'Ropa',
      'Accesorios',
    ]);
  });

  test('CP-08: escribir Nike filtra los productos visibles', async () => {
    const screen = await render(<CatalogScreen />);

    await screen.findByText('Tenis Nike Air');

    await act(async () => {
      fireEvent.changeText(
        screen.getByTestId('catalog-search-input'),
        'Nike'
      );
    });

    await waitFor(() => {
      expect(screen.getByText('Tenis Nike Air')).toBeTruthy();
      expect(screen.queryByText('Playera Adidas')).toBeNull();
      expect(screen.queryByText('Balón Wilson')).toBeNull();
      expect(screen.getByText('1 productos')).toBeTruthy();
    });
  });

  test('CP-09: informa cuando no hay coincidencias', async () => {
    const screen = await render(<CatalogScreen />);

    await screen.findByText('Tenis Nike Air');

    await act(async () => {
      fireEvent.changeText(
        screen.getByTestId('catalog-search-input'),
        'Producto inexistente'
      );
    });

    await waitFor(() => {
      expect(
        screen.getByText('No encontramos productos')
      ).toBeTruthy();

      expect(screen.getByText('0 productos')).toBeTruthy();
      expect(screen.queryByText('Tenis Nike Air')).toBeNull();
    });
  });

  test('CP-10: borrar la búsqueda restaura los productos', async () => {
    const screen = await render(<CatalogScreen />);

    await screen.findByText('Tenis Nike Air');

    const input = screen.getByTestId('catalog-search-input');

    // Primero buscar Nike.
    await act(async () => {
      fireEvent.changeText(input, 'Nike');
    });

    await waitFor(() => {
      expect(screen.queryByText('Playera Adidas')).toBeNull();
      expect(screen.getByText('1 productos')).toBeTruthy();
    });

    // Borrar el texto del buscador.
    await act(async () => {
      fireEvent.changeText(input, '');
    });

    // Verificar que regresen todos los productos.
    await waitFor(() => {
      expect(screen.getByText('Tenis Nike Air')).toBeTruthy();
      expect(screen.getByText('Playera Adidas')).toBeTruthy();
      expect(screen.getByText('Balón Wilson')).toBeTruthy();
      expect(screen.getByText('3 productos')).toBeTruthy();
    });
  });

  test('CP-11: reinicia la paginación al realizar una búsqueda', async () => {
    // Preparar 20 productos para comprobar dos páginas.
    const manyProducts = Array.from({ length: 20 }, (_, index) => ({
      id: index + 1,
      nombre: `Producto ${index + 1}`,
      marca: index < 12 ? 'Nike' : 'Adidas',
      categoria: 'Deportes',
      precio: 500,
      stock_total: 10,
    }));

    productApi.list.mockResolvedValue(manyProducts);
    productApi.categories.mockResolvedValue(['Deportes']);

    const screen = await render(<CatalogScreen />);

    // Esperar a que termine la carga.
    await screen.findByText('20 productos');

    // Localizar la lista principal que maneja la paginación.
    function buscarLista(nodo) {
      if (!nodo) return null;

      if (Array.isArray(nodo)) {
        for (const hijo of nodo) {
          const resultado = buscarLista(hijo);
          if (resultado) return resultado;
        }
        return null;
      }

      if (typeof nodo.props?.onEndReached === 'function') {
        return nodo;
      }

      return buscarLista(nodo.children);
    }

    // Al inicio solo se muestran los primeros 8 productos.
    expect(buscarLista(screen.toJSON()).props.data).toHaveLength(8);

    // Simular desplazamiento hasta el final del catálogo.
    await act(async () => {
      buscarLista(screen.toJSON()).props.onEndReached();
    });

    // Después del desplazamiento deben existir 16 productos.
    await waitFor(() => {
      expect(buscarLista(screen.toJSON()).props.data).toHaveLength(16);
    });

    // Escribir Nike en el buscador.
    await act(async () => {
      fireEvent.changeText(
        screen.getByTestId('catalog-search-input'),
        'Nike'
      );
    });

    // Existen 12 productos Nike, pero solo deben aparecer
    // los 8 correspondientes a la primera página.
    await waitFor(() => {
      expect(screen.getByText('12 productos')).toBeTruthy();
      expect(buscarLista(screen.toJSON()).props.data).toHaveLength(8);
    });

    // Confirmar que los productos paginados son de Nike.
    const productosVisibles = buscarLista(screen.toJSON()).props.data;

    expect(productosVisibles).toHaveLength(8);
    expect(
      productosVisibles.every((product) => product.marca === 'Nike')
    ).toBe(true);
  });
});
