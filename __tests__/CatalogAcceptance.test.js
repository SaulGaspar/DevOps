
/* global jest, describe, test, expect, beforeEach */

import {
  act,
  cleanup,
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

const products = [
  {
    id: 1,
    nombre: 'Tenis Nike Air',
    marca: 'Nike',
    categoria: 'Calzado',
    precio: 2500,
    stock_total: 10,
  },
  {
    id: 2,
    nombre: 'Tenis Adidas',
    marca: 'Adidas',
    categoria: 'Calzado',
    precio: 1800,
    stock_total: 8,
  },
  {
    id: 3,
    nombre: 'Playera Nike',
    marca: 'Nike',
    categoria: 'Ropa',
    precio: 800,
    stock_total: 6,
  },
];

async function press(screen, testID) {
  await act(async () => {
    fireEvent.press(screen.getByTestId(testID));
  });
}

async function typeText(screen, testID, value) {
  await act(async () => {
    fireEvent.changeText(screen.getByTestId(testID), value);
  });
}

describe('HU4 - Pruebas de aceptación del catálogo', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    productApi.list.mockResolvedValue(products);
    productApi.categories.mockResolvedValue(['Calzado', 'Ropa']);
  });

  test('PA-02: combinar búsqueda y filtros de marca', async () => {
    const screen = await render(<CatalogScreen />);

    // 1. El catálogo carga tres productos.
    await screen.findByText('Tenis Nike Air');

    expect(screen.getByText('3 productos')).toBeTruthy();

    // 2. Buscar tenis.
    await typeText(screen, 'catalog-search-input', 'Tenis');

    await waitFor(() => {
      expect(screen.getByText('2 productos')).toBeTruthy();
      expect(screen.getByText('Tenis Nike Air')).toBeTruthy();
      expect(screen.getByText('Tenis Adidas')).toBeTruthy();
    });

    // 3. Aplicar la marca Nike.
    await press(screen, 'catalog-open-filters');
    await press(screen, 'filter-marca-Nike');
    await press(screen, 'filter-apply');

    // 4. Confirmar coincidencia de ambos criterios.
    await waitFor(() => {
      expect(screen.getByText('1 productos')).toBeTruthy();
      expect(screen.getByText('Tenis Nike Air')).toBeTruthy();
      expect(screen.queryByText('Tenis Adidas')).toBeNull();
      expect(screen.queryByText('Playera Nike')).toBeNull();
    });

    await act(async () => {
      cleanup();
    });
  });

  test('PA-03: rechaza un rango de precios incorrecto', async () => {
    const screen = await render(<CatalogScreen />);

    // 1. El catálogo carga tres productos.
    await screen.findByText('Tenis Nike Air');

    expect(screen.getByText('3 productos')).toBeTruthy();

    // 2. Abrir el panel de filtros.
    await press(screen, 'catalog-open-filters');

    // 3. Introducir un rango inválido.
    await typeText(screen, 'filter-price-min', '3000');
    await typeText(screen, 'filter-price-max', '500');

    // 4. Intentar aplicar los filtros.
    await press(screen, 'filter-apply');

    // 5. Verificar que se informa el error.
    expect(screen.getByTestId('filter-error')).toBeTruthy();

    // 6. El panel debe permanecer abierto.
    expect(screen.getByText('Filtros de productos')).toBeTruthy();

    // 7. No deben modificarse los resultados.
    expect(screen.getByText('3 productos')).toBeTruthy();

    await act(async () => {
      cleanup();
    });
  });
});
