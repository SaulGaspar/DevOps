
import { describe, expect, test } from '@jest/globals';
import { filterCatalog } from '../src/utils/filterCatalog';

const productos = [
  {
    id: '1',
    nombre: 'Tenis Nike',
    categoria: 'Calzado',
    marca: 'Nike',
    precio: 2500,
    tallas: ['25', '26'],
  },
  {
    id: '2',
    nombre: 'Tenis Adidas',
    categoria: 'Calzado',
    marca: 'Adidas',
    precio: 1800,
    tallas: ['27'],
  },
  {
    id: '3',
    nombre: 'Playera Nike',
    categoria: 'Ropa',
    marca: 'Nike',
    precio: 800,
    tallas: ['M', 'L'],
  },
  {
    id: '4',
    nombre: 'Balón Puma',
    categoria: 'Accesorios',
    marca: 'Puma',
    precio: 500,
    tallas: [],
  },
];

describe('HU4 #11 - Filtros avanzados del catálogo', () => {
  test('CP-01: filtra por categoría', () => {
    const resultado = filterCatalog(productos, {
      categoria: 'Calzado',
    });

    expect(resultado).toHaveLength(2);
    expect(resultado.map((p) => p.id)).toEqual(['1', '2']);
  });

  test('CP-02: filtra por marca', () => {
    const resultado = filterCatalog(productos, {
      marca: 'Nike',
    });

    expect(resultado.map((p) => p.id)).toEqual(['1', '3']);
  });

  test('CP-03: filtra por precio mínimo', () => {
    const resultado = filterCatalog(productos, {
      precioMin: '2000',
    });

    expect(resultado.map((p) => p.id)).toEqual(['1']);
  });

  test('CP-04: filtra por precio máximo', () => {
    const resultado = filterCatalog(productos, {
      precioMax: '1000',
    });

    expect(resultado.map((p) => p.id)).toEqual(['3', '4']);
  });

  test('CP-05: filtra por talla', () => {
    const resultado = filterCatalog(productos, {
      talla: '26',
    });

    expect(resultado.map((p) => p.id)).toEqual(['1']);
  });

  test('CP-06: combina categoría, marca, precio y talla', () => {
    const resultado = filterCatalog(productos, {
      categoria: 'Calzado',
      marca: 'Nike',
      precioMin: '2000',
      precioMax: '3000',
      talla: '26',
    });

    expect(resultado.map((p) => p.id)).toEqual(['1']);
  });

  test('CP-07: devuelve todos los productos sin filtros', () => {
    expect(filterCatalog(productos)).toHaveLength(4);
  });

  test('CP-08: devuelve lista vacía sin coincidencias', () => {
    const resultado = filterCatalog(productos, {
      marca: 'Reebok',
    });

    expect(resultado).toEqual([]);
  });

  test('CP-09: permite precios exactamente en el límite', () => {
    const resultado = filterCatalog(productos, {
      precioMin: '2500',
      precioMax: '2500',
    });

    expect(resultado.map((p) => p.id)).toEqual(['1']);
  });

  test('CP-10: maneja una lista de productos inválida', () => {
    expect(filterCatalog(null)).toEqual([]);
  });
});
