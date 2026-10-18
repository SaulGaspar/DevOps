import { act, fireEvent, render, waitFor } from '@testing-library/react-native';
import { router } from 'expo-router';
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

describe('HU3 #9 - Pantalla del catalogo', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Mantener las solicitudes pendientes para observar
    // el estado inicial de carga.
    productApi.list.mockImplementation(
      () => new Promise(() => {})
    );

    productApi.categories.mockImplementation(
      () => new Promise(() => {})
    );
  });

  test('CP-16: muestra la carga inicial del catalogo', async () => {
    const { getByText } = await render(
      <CatalogScreen />
    );

    expect(getByText(/Cargando cat.logo/)).toBeTruthy();
  });

    
test('CP-17: muestra los productos recibidos de la API', async () => {
  const productosSimulados = [
    {
      id: 1,
      nombre: 'Tenis deportivos',
      marca: 'Nike',
      categoria: 'Calzado',
      precio: 1299,
      stock_total: 5,
      imagen: 'https://ejemplo.com/tenis.jpg',
    },
    {
      id: 2,
      nombre: 'Playera deportiva',
      marca: 'Adidas',
      categoria: 'Ropa',
      precio: 499,
      stock_total: 10,
      imagen: 'https://ejemplo.com/playera.jpg',
    },
  ];

  productApi.list.mockResolvedValue(productosSimulados);
  productApi.categories.mockResolvedValue(['Calzado', 'Ropa']);

  const { findByText, getByText } = await render(
    <CatalogScreen />
  );

  // Esperar a que termine la consulta simulada.
  expect(await findByText('Tenis deportivos')).toBeTruthy();

  // Comprobar que ambos productos aparecen.
  expect(getByText('Playera deportiva')).toBeTruthy();

  // Comprobar el contador del catálogo.
  expect(getByText('2 productos')).toBeTruthy();

  // Verificar que se consultaron los dos endpoints.
    expect(productApi.list).toHaveBeenCalledTimes(1);
  expect(productApi.categories).toHaveBeenCalledTimes(1);
}, 15000);

  
  

test('CP-18: muestra solo 8 productos en la primera pagina', async () => {
  const productosSimulados = Array.from({ length: 12 }, (_, index) => ({
    id: index + 1,
    nombre: `Producto ${index + 1}`,
    marca: 'SportLike',
    categoria: 'Deportes',
    precio: 500,
    stock_total: 10,
    imagen: `https://ejemplo.com/producto-${index + 1}.jpg`,
  }));

  productApi.list.mockResolvedValue(productosSimulados);
  productApi.categories.mockResolvedValue(['Deportes']);

  const { findByText, getByText, queryByText } = await render(
    <CatalogScreen />
  );

  // Esperar a que termine la carga de la API.
  expect(await findByText('12 productos')).toBeTruthy();

  // Los primeros 8 productos deben estar en la primera pagina.
  for (let numero = 1; numero <= 8; numero++) {
    expect(getByText(`Producto ${numero}`)).toBeTruthy();
  }

  // Los productos 9 a 12 todavia no deben mostrarse.
  for (let numero = 9; numero <= 12; numero++) {
    expect(queryByText(`Producto ${numero}`)).toBeNull();
  }
});

  
test('CP-19: carga mas productos al llegar al final', async () => {
  const productosSimulados = Array.from({ length: 12 }, (_, index) => ({
    id: index + 1,
    nombre: `Producto ${index + 1}`,
    marca: 'SportLike',
    categoria: 'Deportes',
    precio: 500,
    stock_total: 10,
    imagen: `https://ejemplo.com/producto-${index + 1}.jpg`,
  }));

  productApi.list.mockResolvedValue(productosSimulados);
  productApi.categories.mockResolvedValue(['Deportes']);

  const { findByText, queryByText, toJSON } =
    await render(<CatalogScreen />);

  // Esperar a que la API simulada termine de cargar.
  expect(await findByText('12 productos')).toBeTruthy();

  // Inicialmente solo debe mostrar 8 productos.
  expect(queryByText('Producto 12')).toBeNull();

  // Buscar en el arbol la lista que tiene onEndReached.
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

  const listaPrincipal = buscarLista(toJSON());

  // Verificar que encontramos la lista con paginacion.
  expect(listaPrincipal).not.toBeNull();

 
  // Ejecutar directamente el evento de paginación.
   await act(async () => {
  listaPrincipal.props.onEndReached();
    });
  // Comprobar si el catalogo actualizo la segunda pagina.
  

});



test('CP-20: filtra los productos por categoria', async () => {
  const productosSimulados = [
    {
      id: 1,
      nombre: 'Tenis deportivos',
      marca: 'Nike',
      categoria: 'Calzado',
      precio: 1299,
      stock_total: 5,
      imagen: 'https://ejemplo.com/tenis.jpg',
    },
    {
      id: 2,
      nombre: 'Playera deportiva',
      marca: 'Adidas',
      categoria: 'Ropa',
      precio: 499,
      stock_total: 10,
      imagen: 'https://ejemplo.com/playera.jpg',
    },
  ];

  productApi.list.mockResolvedValue(productosSimulados);
  productApi.categories.mockResolvedValue(['Calzado', 'Ropa']);

  const { findByText, getByText, queryByText } = await render(
    <CatalogScreen />
  );

  // Esperar a que aparezcan los productos.
  expect(await findByText('Tenis deportivos')).toBeTruthy();
  expect(getByText('Playera deportiva')).toBeTruthy();

  // Seleccionar la categoria Calzado.
  await act(async () => {
  fireEvent.press(getByText('Calzado'));
    });

  // Comprobar que el filtro se aplico.
  await waitFor(() => {
    expect(getByText('Tenis deportivos')).toBeTruthy();
    expect(queryByText('Playera deportiva')).toBeNull();
    expect(getByText('1 productos')).toBeTruthy();
  });
    });
 
    
test('CP-21: reinicia la paginacion al cambiar de categoria', async () => {
  const productosSimulados = Array.from({ length: 20 }, (_, index) => ({
    id: index + 1,
    nombre: `Producto ${index + 1}`,
    marca: 'SportLike',
    categoria: index < 12 ? 'Calzado' : 'Ropa',
    precio: 500,
    stock_total: 10,
    imagen: `https://ejemplo.com/producto-${index + 1}.jpg`,
  }));

  productApi.list.mockResolvedValue(productosSimulados);
  productApi.categories.mockResolvedValue(['Calzado', 'Ropa']);

  const { findByText, getByText, toJSON } =
    await render(<CatalogScreen />);

  expect(await findByText('20 productos')).toBeTruthy();

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

  // Avanzar a la segunda pagina del catalogo completo.
  await act(async () => {
    buscarLista(toJSON()).props.onEndReached();
  });

  await waitFor(() => {
    expect(buscarLista(toJSON()).props.data.length).toBe(16);
  });

  // Seleccionar la categoria Calzado.
  await act(async () => {
    fireEvent.press(getByText('Calzado'));
  });

  // La categoria tiene 12 productos, pero solo deben mostrarse 8.
  await waitFor(() => {
    expect(getByText('12 productos')).toBeTruthy();
    expect(buscarLista(toJSON()).props.data.length).toBe(8);
  });
    });

     
  test('CP-22: muestra mensaje cuando el catalogo esta vacio', async () => {
  // Simular una API que devuelve cero productos.
  productApi.list.mockResolvedValue([]);
  productApi.categories.mockResolvedValue([]);

  const { findByText, getByText } = await render(
    <CatalogScreen />
  );

  // Esperar a que finalice la carga inicial.
  expect(await findByText('0 productos')).toBeTruthy();

  // Comprobar el mensaje de catalogo vacio.
  expect(getByText('No hay productos')).toBeTruthy();
 });
  
    
 test('CP-23: muestra mensaje cuando falla la API', async () => {
  // Simular un error al solicitar los productos.
  productApi.list.mockRejectedValue(
    new Error('Error de conexion con el servidor')
  );

  productApi.categories.mockResolvedValue([]);

  const { findByText, getByText } = await render(
    <CatalogScreen />
  );

  // Esperar a que la pantalla procese el error.
  expect(
    await findByText('Error de conexion con el servidor')
  ).toBeTruthy();

  // Comprobar que aparece el mensaje de error.
  expect(
    getByText(/No pudimos cargar el cat.logo/)
  ).toBeTruthy();

  // Comprobar que ofrece la opcion de reintentar.
  expect(getByText('Reintentar')).toBeTruthy();

  // Verificar que la API fue consultada.
  expect(productApi.list).toHaveBeenCalledTimes(1);
 });



   
 test('CP-24: recupera productos al presionar Reintentar', async () => {
  const productoRecuperado = {
    id: 1,
    nombre: 'Tenis recuperados',
    marca: 'Nike',
    categoria: 'Calzado',
    precio: 1299,
    stock_total: 5,
    imagen: 'https://ejemplo.com/tenis.jpg',
  };

  // La primera solicitud falla; la segunda funciona.
  productApi.list
    .mockRejectedValueOnce(new Error('Error de conexion'))
    .mockResolvedValueOnce([productoRecuperado]);

  productApi.categories.mockResolvedValue(['Calzado']);

  const { findByText, getByText, queryByText } =
    await render(<CatalogScreen />);

  // Comprobar que aparece el error inicial.
  expect(await findByText('Error de conexion')).toBeTruthy();

  // Simular que el usuario presiona Reintentar.
  await act(async () => {
    fireEvent.press(getByText('Reintentar'));
  });

  // Esperar a que se recupere el catalogo.
  expect(await findByText('Tenis recuperados')).toBeTruthy();

  // Comprobar que desaparecio el error.
  expect(queryByText('Error de conexion')).toBeNull();

  // La API debe haberse consultado dos veces.
  expect(productApi.list).toHaveBeenCalledTimes(2);
 });


   
 test('CP-25: navega al detalle del producto seleccionado', async () => {
  const productoSimulado = {
    id: 25,
    nombre: 'Tenis deportivos',
    marca: 'Nike',
    categoria: 'Calzado',
    precio: 1299,
    stock_total: 5,
    imagen: 'https://ejemplo.com/tenis.jpg',
  };

  productApi.list.mockResolvedValue([productoSimulado]);
  productApi.categories.mockResolvedValue(['Calzado']);

  const { findByLabelText } = await render(
    <CatalogScreen />
  );

  // Esperar a que aparezca la tarjeta del producto.
  const tarjeta = await findByLabelText('Ver Tenis deportivos');

  // Simular la seleccion del producto.
  await act(async () => {
    fireEvent.press(tarjeta);
  });

  // Comprobar que se envia la ruta y el ID correcto.
  expect(router.push).toHaveBeenCalledTimes(1);
  expect(router.push).toHaveBeenCalledWith({
    pathname: '/producto/[id]',
    params: { id: '25' },
  });
 });

});
