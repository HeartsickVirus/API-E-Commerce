const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const categoriaRoutes = require('./routes/categoriaRoutes');
const estadosRoutes = require('./routes/estadosRoutes');
const marcasRoutes = require('./routes/marcasRoutes');
const productosRoutes = require('./routes/productosRoutes');
const rolesRoutes = require('./routes/rolesRoutes');
const usuariosRoutes = require('./routes/usuariosRoutes');
const ventasRoutes = require('./routes/ventasRoutes');
const exceljs = require('exceljs'); // Importa la biblioteca exceljs
const mysql = require('mysql2/promise');

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use('/categoria', categoriaRoutes);
app.use('/estados', estadosRoutes);
app.use('/marcas', marcasRoutes);
app.use('/productos', productosRoutes);
app.use('/roles', rolesRoutes);
app.use('/usuarios', usuariosRoutes);
app.use('/ventas', ventasRoutes);

const PORT = 3001;

app.get('/exportProductosToExcel', async (req, res) => {
    try {
      // Crea una conexión a tu base de datos en la nube
      const connection = await mysql.createConnection({
        host: 'mysql-aaron.alwaysdata.net',
        user: 'aaron_iriyc',
        password: '0fftheMolly',
        database: 'aaron_iriyc71',
      });
  
      // Realiza una consulta para obtener los datos de la tabla de productos
      const [rows] = await connection.query('SELECT id_producto, nombre_producto, precio, descripcion, imagen, stock, id_categoria, id_marca, id_estado FROM productos');
  
      // Crea un nuevo libro Excel y hoja de cálculo
      const workbook = new exceljs.Workbook();
      const worksheet = workbook.addWorksheet('Productos');
  
      // Define las columnas en el archivo Excel
      worksheet.columns = [
        { header: 'ID Producto', key: 'id_producto', width: 10 },
        { header: 'Nombre Producto', key: 'nombre_producto', width: 20 },
        { header: 'Precio', key: 'precio', width: 10 },
        { header: 'Descripción', key: 'descripcion', width: 30 },
        { header: 'Imagen', key: 'imagen', width: 20 },
        { header: 'Stock', key: 'stock', width: 10 },
        { header: 'ID Categoría', key: 'id_categoria', width: 10 },
        { header: 'ID Marca', key: 'id_marca', width: 10 },
        { header: 'ID Estado', key: 'id_estado', width: 10 },
      ];
  
      // Agrega los datos de productos a la hoja de cálculo
      worksheet.addRows(rows);
  
      // Genera un archivo Excel en memoria
      const buffer = await workbook.xlsx.writeBuffer();
  
      // Define el tipo de respuesta como un archivo Excel
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=productos.xlsx');
  
      // Envía el archivo Excel al cliente
      res.send(buffer);
  
      // Cierra la conexión a la base de datos
      await connection.end();
    } catch (error) {
      console.error(error);
      res.status(500).send('Error al exportar los datos a Excel');
    }
  });
  
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });