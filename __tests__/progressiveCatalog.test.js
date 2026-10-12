import { describe, expect, it } from '@jest/globals';
import {
  PAGE_SIZE,
  getPagedItems,
  hasMorePages,
  isCloudinaryUrl,
  optimizeImageUrl,
  placeholderImageUrl,
} from '../src/utils/progressiveCatalog';

const cloud =
  'https://res.cloudinary.com/demo/image/upload/v1/sportlike/tenis.jpg';

const items = Array.from(
  { length: 20 },
  (_, index) => ({ id: String(index) })
);

describe('Paginación del catálogo', () => {
  it('muestra 8 productos inicialmente', () => {
    expect(getPagedItems(items, 1)).toHaveLength(PAGE_SIZE);
  });

  it('muestra 16 productos en la segunda página', () => {
    expect(getPagedItems(items, 2)).toHaveLength(16);
  });

  it('no supera el total de productos', () => {
    expect(getPagedItems(items, 10)).toHaveLength(20);
  });

  it('detecta cuando existen más productos', () => {
    expect(hasMorePages(20, 1)).toBe(true);
    expect(hasMorePages(20, 3)).toBe(false);
  });

  it('controla números de página inválidos', () => {
    expect(getPagedItems(items, 0)).toHaveLength(8);
  });
});

describe('Optimización de imágenes Cloudinary', () => {
  it('reconoce una URL de Cloudinary', () => {
    expect(isCloudinaryUrl(cloud)).toBe(true);
  });

  it('optimiza las imágenes', () => {
    expect(optimizeImageUrl(cloud, 400)).toContain(
      'f_auto,q_auto,w_400'
    );
  });

  it('genera una miniatura de baja calidad', () => {
    expect(placeholderImageUrl(cloud)).toContain(
      'f_auto,q_10,w_30'
    );
  });

  it('conserva las URL externas', () => {
    const url = 'https://ejemplo.com/producto.jpg';

    expect(optimizeImageUrl(url)).toBe(url);
    expect(placeholderImageUrl(url)).toBe('');
  });
});
