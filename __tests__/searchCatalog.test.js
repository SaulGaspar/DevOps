
import { describe, expect, test } from '@jest/globals';
import { searchCatalog } from '../src/utils/searchCatalog';

describe('HU4 #10 - Búsqueda de productos', () => {
  const products = [
    { id: '1', nombre: 'Tenis Nike Air', marca: 'Nike' },
    { id: '2', nombre: 'Playera Adidas', marca: 'Adidas' },
    { id: '3', nombre: 'Balón deportivo', marca: 'Wilson' },
    { id: '4', nombre: 'Mochila deportiva', marca: 'Nike' },
  ];

  test('CP-01: busca productos por nombre', () => {
    const results = searchCatalog(products, 'Tenis');

    expect(results).toHaveLength(1);
    expect(results[0].id).toBe('1');
  });

  test('CP-02: busca productos por marca', () => {
    const results = searchCatalog(products, 'Nike');

    expect(results).toHaveLength(2);
    expect(results.map((product) => product.id)).toEqual(['1', '4']);
  });

  test('CP-03: no distingue mayúsculas y minúsculas', () => {
    const results = searchCatalog(products, 'adidas');

    expect(results).toHaveLength(1);
    expect(results[0].id).toBe('2');
  });

  test('CP-04: elimina espacios adicionales de la búsqueda', () => {
    const results = searchCatalog(products, '  Wilson  ');

    expect(results).toHaveLength(1);
    expect(results[0].id).toBe('3');
  });

  test('CP-05: devuelve todos los productos si la búsqueda está vacía', () => {
    const results = searchCatalog(products, '');

    expect(results).toEqual(products);
  });

  test('CP-06: devuelve una lista vacía si no existen coincidencias', () => {
    const results = searchCatalog(products, 'Puma');

    expect(results).toEqual([]);
  });

  test('CP-07: maneja una lista de productos inválida', () => {
    const results = searchCatalog(null, 'Nike');

    expect(results).toEqual([]);
  });
});
