
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

const products = [
  {
    id: 1,
    nombre: 'Tenis Nike Air',
    marca: 'Nike',
    categoria: 'Calzado',
    precio: 2500,
    talla: '25,26',
    stock_total: 10,
  },
  {
    id: 2,
    nombre: 'Tenis Adidas',
    marca: 'Adidas',
    categoria: 'Calzado',
    precio: 1800,
    talla: '27',
    stock_total: 8,
  },
  {
    id: 3,
    nombre: 'Playera Nike',
    marca: 'Nike',
    categoria: 'Ropa',
    precio: 800,
    talla: 'M,L',
    stock_total: 6,
  },
  {
    id: 4,
    nombre: 'Balon Puma',
    marca: 'Puma',
    categoria: 'Accesorios',
    precio: 500,
    stock_total: 5,
  },
];

describe('HU4 #11 - Interacción con filtros avanzados', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    productApi.list.mockResolvedValue(products);

    productApi.categories.mockResolvedValue([
      'Calzado',
      'Ropa',
      'Accesorios',
    ]);
  });

  async function openCatalog() {
  const screen = await render(<CatalogScreen />);

  await screen.findByText('Tenis Nike Air');

  await act(async () => {
    fireEvent.press(
      screen.getByTestId('catalog-open-filters')
    );
  });

  return screen;
    }

  async function press(screen, testID) {
    await act(async () => {
      fireEvent.press(screen.getByTestId(testID));
    });
  }

  async function enterText(screen, testID, value) {
    await act(async () => {
      fireEvent.changeText(
        screen.getByTestId(testID),
        value
      );
    });
  }

  test('CP-23: abre el panel inferior', async () => {
    const screen = await openCatalog();

    expect(
      screen.getByText('Filtros de productos')
    ).toBeTruthy();

    expect(
      screen.getByTestId('filter-price-min')
    ).toBeTruthy();

    expect(
      screen.getByTestId('filter-price-max')
    ).toBeTruthy();
  });

  test('CP-24: aplica filtro por marca', async () => {
    const screen = await openCatalog();

    await press(screen, 'filter-marca-Nike');
    await press(screen, 'filter-apply');

    await waitFor(() => {
      expect(screen.getByText('2 productos')).toBeTruthy();
      expect(screen.getByText('Tenis Nike Air')).toBeTruthy();
      expect(screen.getByText('Playera Nike')).toBeTruthy();
      expect(screen.queryByText('Tenis Adidas')).toBeNull();
    });
  });

  test('CP-25: aplica un rango de precios', async () => {
    const screen = await openCatalog();

    await enterText(
      screen,
      'filter-price-min',
      '1000'
    );

    await enterText(
      screen,
      'filter-price-max',
      '2000'
    );

    await press(screen, 'filter-apply');

    await waitFor(() => {
      expect(screen.getByText('1 productos')).toBeTruthy();
      expect(screen.getByText('Tenis Adidas')).toBeTruthy();
      expect(screen.queryByText('Tenis Nike Air')).toBeNull();
    });
  });

  test('CP-26: limpia los filtros aplicados', async () => {
    const screen = await openCatalog();

    // Aplicar Nike.
    await press(screen, 'filter-marca-Nike');
    await press(screen, 'filter-apply');

    await waitFor(() => {
      expect(screen.getByText('2 productos')).toBeTruthy();
    });

    // Reabrir y limpiar.
    await press(screen, 'catalog-open-filters');
    await press(screen, 'filter-clear');
    await press(screen, 'filter-apply');

    await waitFor(() => {
      expect(screen.getByText('4 productos')).toBeTruthy();
      expect(screen.getByText('Tenis Adidas')).toBeTruthy();
      expect(screen.getByText('Balon Puma')).toBeTruthy();
    });
  });

  test('CP-27: rechaza un rango de precios incorrecto', async () => {
    const screen = await openCatalog();

    await enterText(
      screen,
      'filter-price-min',
      '3000'
    );

    await enterText(
      screen,
      'filter-price-max',
      '500'
    );

    await press(screen, 'filter-apply');

    expect(
      screen.getByTestId('filter-error')
    ).toBeTruthy();

    // El panel permanece abierto.
    expect(
      screen.getByText('Filtros de productos')
    ).toBeTruthy();

    // El catálogo no debe aplicar el rango inválido.
    expect(
      screen.getByText('4 productos')
    ).toBeTruthy();
  });

  test('CP-28: cerrar descarta cambios sin aplicar', async () => {
    const screen = await openCatalog();

    await press(screen, 'filter-marca-Nike');
    await press(screen, 'filter-close');

    await waitFor(() => {
      expect(screen.getByText('4 productos')).toBeTruthy();
    });

    // Reabrir: todavía no debe estar aplicado Nike.
    await press(screen, 'catalog-open-filters');
    await press(screen, 'filter-apply');

    await waitFor(() => {
      expect(screen.getByText('4 productos')).toBeTruthy();
      expect(screen.getByText('Tenis Adidas')).toBeTruthy();
    });
  });

  test('CP-29: combina filtros con búsqueda', async () => {
    const screen = await openCatalog();

    await press(screen, 'filter-marca-Nike');
    await press(screen, 'filter-apply');

    await enterText(
      screen,
      'catalog-search-input',
      'Playera'
    );

    await waitFor(() => {
      expect(screen.getByText('1 productos')).toBeTruthy();
      expect(screen.getByText('Playera Nike')).toBeTruthy();
      expect(screen.queryByText('Tenis Nike Air')).toBeNull();
    });
  });
});
