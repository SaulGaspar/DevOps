import { addCartItem, changeCartQuantity } from '../src/utils/cart';
import { hasErrors, validateLogin } from '../src/utils/authValidation';
import { getPagedItems, hasMorePages } from '../src/utils/progressiveCatalog';
import { loginCases, products } from './fixtures/scenarios';

describe('QA / autenticación - datos de prueba estandarizados', () => {
  test.each(loginCases)('$name genera error en $field', ({ input, field }) => {
    const errors = validateLogin(input);
    expect(hasErrors(errors)).toBe(true);
    expect(errors[field]).toEqual(expect.any(String));
  });
  test('un correo correcto y contraseña no vacía pasan validación de formato', () => {
    expect(validateLogin({ correo: 'qa@example.com', password: 'Segura123' })).toEqual({});
  });
});

describe('QA / carrito - límites e inventario', () => {
  test('admite un producto disponible', () => {
    const result = addCartItem([], products[0]);
    expect(result).toHaveLength(1);
    expect(result[0].quantity).toBe(1);
  });
  test('rechaza productos sin existencias', () => {
    expect(addCartItem([], products[1])).toEqual([]);
  });
  test('impide agregar más unidades que el stock', () => {
    const once = addCartItem([], products[0]);
    const twice = addCartItem(once, products[0]);
    expect(addCartItem(twice, products[0])).toEqual(twice);
    expect(changeCartQuantity(twice, twice[0].key, 3)).toEqual(twice);
  });
});

describe('QA / catálogo - paginación y casos límite', () => {
  const items = Array.from({ length: 19 }, (_, i) => ({ id: i }));
  test.each([[1, 8, true], [2, 16, true], [3, 19, false]])(
    'página %i: %i artículos visibles; hay más: %s',
    (page, length, more) => {
      expect(getPagedItems(items, page)).toHaveLength(length);
      expect(hasMorePages(items.length, page)).toBe(more);
    },
  );
});
