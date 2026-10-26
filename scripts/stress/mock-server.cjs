
const http = require('node:http');

const HOST = '127.0.0.1';
const PORT = 3100;

const products = Array.from({ length: 100 }, (_, index) => ({
  id: String(index + 1),
  nombre: `Producto deportivo ${index + 1}`,
  marca: index % 2 === 0 ? 'Nike' : 'Adidas',
  precio: 500 + index * 10,
  stock_total: 20,
}));

const server = http.createServer((req, res) => {
  const start = performance.now();

  if (req.method !== 'GET' || req.url !== '/productos') {
    res.writeHead(404, {
      'Content-Type': 'application/json',
    });

    res.end(JSON.stringify({ error: 'Ruta no encontrada' }));
    return;
  }

  const response = JSON.stringify(products);

  res.writeHead(200, {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-store',
  });

  res.end(response);

  const duration = performance.now() - start;

  if (duration > 1000) {
    console.log(`Solicitud lenta: ${duration.toFixed(2)} ms`);
  }
});

server.listen(PORT, HOST, () => {
  console.log(`Servidor de prueba disponible en http://${HOST}:${PORT}/productos`);
  console.log('Entorno local aislado. Presiona Ctrl+C para detenerlo.');
});
