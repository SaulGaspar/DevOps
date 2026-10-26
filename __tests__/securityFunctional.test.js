import { securityCases } from './fixtures/scenarios';
import {
  MAX_SEARCH_LENGTH,
  normalizeSearchTerm,
  searchCatalog,
} from '../src/utils/searchCatalog';
import { filterCatalog } from '../src/utils/filterCatalog';
import { addCartItem, cartKey, changeCartQuantity } from '../src/utils/cart';
import { hasErrors, validateLogin, validateRegister } from '../src/utils/authValidation';

const catalog = [
  {
    id: 'sku-seguro',
    nombre: 'Tenis QA',
    marca: 'SportLike',
    categoria: 'Calzado',
    precio: 499,
    stock_total: 2,
    tallas: ['26'],
  },
];

describe('Seguridad funcional HU1 - autenticación y registro', () => {
  test('SEG-HU1-01: datos ausentes o de tipo incorrecto se rechazan sin cerrar la app', () => {
    expect(hasErrors(validateRegister())).toBe(true);
    expect(hasErrors(validateRegister(securityCases.malformedRegistration))).toBe(true);
    expect(validateLogin()).toEqual(expect.objectContaining({
      correo: expect.any(String),
      password: expect.any(String),
    }));
  });

  test('SEG-HU1-02: entradas excesivas se rechazan antes de enviarse a la API', () => {
    expect(validateLogin({
      correo: `qa@${securityCases.oversizedText}.com`,
      password: securityCases.oversizedText,
    })).toEqual(expect.objectContaining({
      correo: expect.any(String),
      password: expect.any(String),
    }));
  });
});

describe('Seguridad funcional HU2/HU3/HU4 - catálogo, búsqueda y filtros', () => {
  test('SEG-HU4-01: normaliza Unicode y limita el tamaño de la búsqueda', () => {
    const normalized = normalizeSearchTerm(`  ＴＥＮＩＳ${securityCases.oversizedText}  `);
    expect(normalized).toHaveLength(MAX_SEARCH_LENGTH);
    expect(normalized.startsWith('tenis')).toBe(true);
  });

  test('SEG-HU4-02: objetos malformados no provocan una excepción', () => {
    const throwingValue = { toString: () => { throw new Error('entrada hostil'); } };
    expect(() => searchCatalog([null, ...catalog], throwingValue)).not.toThrow();
    expect(searchCatalog([null, ...catalog], throwingValue)).toEqual([null, ...catalog]);
  });

  test.each(securityCases.invalidPrices)(
    'SEG-HU4-03: rechaza el filtro de precio inválido %s',
    (precioMin) => {
      expect(filterCatalog(catalog, { precioMin })).toEqual([]);
    },
  );

  test('SEG-HU4-04: rechaza rangos invertidos y productos con precio corrupto', () => {
    expect(filterCatalog(catalog, { precioMin: '500', precioMax: '100' })).toEqual([]);
    expect(filterCatalog([{ ...catalog[0], precio: Number.NaN }])).toEqual([]);
  });
});

describe('Seguridad funcional HU5 - carrito e inventario', () => {
  test.each(securityCases.invalidProducts)(
    'SEG-HU5-01: rechaza productos incompletos o manipulados %#',
    (product) => {
      expect(() => addCartItem([], product)).not.toThrow();
      expect(addCartItem([], product)).toEqual([]);
      expect(cartKey(product)).toBe('');
    },
  );

  test('SEG-HU5-02: rechaza cantidades decimales, infinitas o mayores al stock', () => {
    const product = catalog[0];
    const items = addCartItem([], product, '26', 'Negro');
    const key = cartKey(product, '26', 'Negro');

    expect(changeCartQuantity(items, key, 1.5)).toEqual(items);
    expect(changeCartQuantity(items, key, Number.POSITIVE_INFINITY)).toEqual(items);
    expect(changeCartQuantity(items, key, 3)).toEqual(items);
  });

  test('SEG-HU5-03: un carrito o un artículo corrupto no provoca una excepción', () => {
    expect(addCartItem(null, catalog[0])).toHaveLength(1);
    expect(changeCartQuantity(null, 'inexistente', 1)).toEqual([]);
    expect(changeCartQuantity([{ key: 'x', product: null, quantity: 1 }], 'x', 1))
      .toEqual([{ key: 'x', product: null, quantity: 1 }]);
  });
});
