import { formatPrice, normalizeProduct, parseProductOptions } from '../src/utils/productCatalog';

describe('utilidades del catálogo', () => {
  test('convierte tallas y colores separados por coma', () => {
    expect(parseProductOptions('XS, S, M, L')).toEqual(['XS', 'S', 'M', 'L']);
    expect(parseProductOptions('Negro, Blanco')).toEqual(['Negro', 'Blanco']);
  });

  test('ignora opciones vacías', () => {
    expect(parseProductOptions('M, , L,')).toEqual(['M', 'L']);
    expect(parseProductOptions(null)).toEqual([]);
  });

  test('normaliza precio, stock y variantes del backend', () => {
    const product = normalizeProduct({
      id: 8,
      nombre: 'Tenis de prueba',
      precio: '1499.50',
      stock_total: '4',
      talla: '26, 27',
      colores: 'Negro, Azul',
    });

    expect(product).toMatchObject({
      id: '8',
      precio: 1499.5,
      stock_total: 4,
      tallas: ['26', '27'],
      coloresLista: ['Negro', 'Azul'],
    });
  });

  test('formatea precios en moneda mexicana', () => {
    expect(formatPrice(1499.5)).toContain('1,499.50');
    expect(formatPrice('valor inválido')).toBe('$0.00');
  });
});
