import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { ActivityIndicator } from 'react-native';
import ProgressiveImage from '../src/components/ProgressiveImage';

describe('HU3 #9 - Carga progresiva de imagenes', () => {

  test('CP-01: muestra Sin imagen cuando no hay URL', async () => {
    const { getByText } = await render(
      <ProgressiveImage uri="" />
    );

    expect(getByText('Sin imagen')).toBeTruthy();
  });

  test('CP-02: muestra indicador mientras carga la imagen', async () => {
    const imageUrl = 'https://ejemplo.com/tenis.jpg';

    const { toJSON } = await render(
      <ProgressiveImage
        uri={imageUrl}
        label="Imagen de tenis"
      />
    );

    // Buscar el indicador de carga dentro del árbol renderizado.
    function buscarIndicador(nodo) {
      if (!nodo) return false;

      if (Array.isArray(nodo)) {
        return nodo.some(buscarIndicador);
      }

      if (
        nodo.type === 'ActivityIndicator' ||
        nodo.type === ActivityIndicator.displayName
      ) {
        return true;
      }

      return buscarIndicador(nodo.children);
    }

    expect(buscarIndicador(toJSON())).toBe(true);
  });

  
test('CP-03: utiliza la URL optimizada de Cloudinary', async () => {
  const imageUrl =
    'https://res.cloudinary.com/demo/image/upload/v1/sportlike/tenis.jpg';

  const expectedUrl =
    'https://res.cloudinary.com/demo/image/upload/f_auto,q_auto,w_400/v1/sportlike/tenis.jpg';

  const { getByLabelText } = await render(
    <ProgressiveImage
      uri={imageUrl}
      width={400}
      label="Imagen de tenis"
    />
  );

  const imagen = getByLabelText('Imagen de tenis');

  expect(imagen.props.source.uri).toBe(expectedUrl);
});

  
test('CP-04: oculta indicador cuando termina la carga', async () => {
  const imageUrl = 'https://ejemplo.com/tenis.jpg';

  const { getByLabelText, toJSON } = await render(
    <ProgressiveImage
      uri={imageUrl}
      label="Imagen de tenis"
    />
  );

  function tieneIndicador(nodo) {
    if (!nodo) return false;

    if (Array.isArray(nodo)) {
      return nodo.some(tieneIndicador);
    }

    if (nodo.type === 'ActivityIndicator') {
      return true;
    }

    return tieneIndicador(nodo.children);
  }

  // Comprobar el estado inicial.
  expect(tieneIndicador(toJSON())).toBe(true);

  // Simular la finalización de la descarga.
  fireEvent(getByLabelText('Imagen de tenis'), 'load');

  // Esperar a que React actualice el componente.
  await waitFor(() => {
    expect(tieneIndicador(toJSON())).toBe(false);
  });
});

  
test('CP-05: muestra mensaje cuando falla la imagen', async () => {
  const imageUrl = 'https://ejemplo.com/imagen.jpg';

  const { getByLabelText, getByText, queryByLabelText } =
    await render(
      <ProgressiveImage
        uri={imageUrl}
        label="Imagen de prueba"
      />
    );

  // Confirmar que la imagen existe inicialmente.
  expect(getByLabelText('Imagen de prueba')).toBeTruthy();

  // Simular un error de carga.
  fireEvent(getByLabelText('Imagen de prueba'), 'error');

  // Debe mostrar un mensaje visible de error.
  await waitFor(() => {
    expect(getByText('No se pudo cargar')).toBeTruthy();
    expect(queryByLabelText('Imagen de prueba')).toBeNull();
  });
});

   
   
test('CP-06: reinicia la carga cuando cambia la URL', async () => {
  const primeraUrl = 'https://ejemplo.com/tenis.jpg';
  const segundaUrl = 'https://ejemplo.com/playera.jpg';

  const {
    getByLabelText,
    getByText,
    queryByText,
    rerender,
    toJSON,
  } = await render(
    <ProgressiveImage
      uri={primeraUrl}
      label="Imagen de tenis"
    />
  );

  // Simular un error en la primera imagen.
  fireEvent(getByLabelText('Imagen de tenis'), 'error');

  await waitFor(() => {
    expect(getByText('No se pudo cargar')).toBeTruthy();
  });

  // Cambiar a la segunda imagen.
  await rerender(
    <ProgressiveImage
      uri={segundaUrl}
      label="Imagen de playera"
    />
  );

  // El error anterior debe desaparecer.
  await waitFor(() => {
    expect(queryByText('No se pudo cargar')).toBeNull();
    expect(getByLabelText('Imagen de playera')).toBeTruthy();
  });

  // El indicador debe aparecer nuevamente.
  function tieneIndicador(nodo) {
    if (!nodo) return false;

    if (Array.isArray(nodo)) {
      return nodo.some(tieneIndicador);
    }

    return nodo.type === 'ActivityIndicator'
      || tieneIndicador(nodo.children);
  }

  expect(tieneIndicador(toJSON())).toBe(true);
});


});
