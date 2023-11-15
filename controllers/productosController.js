const db = require("../models/db");

// GET /productos

exports.listarProductos = async (req, res) => {
  const sql = `
  SELECT
    productos.id_producto,
    productos.nombre_producto,
    productos.precio,
    productos.descripcion,
    productos.imagen,
    productos.stock,
    categorias.nombre_categoria,
    marcas.nombre_marca,
    estados.nombre_estado
  FROM productos
  INNER JOIN categorias ON productos.id_categoria = categorias.id_categoria
  INNER JOIN marcas ON productos.id_marca = marcas.id_marca
  INNER JOIN estados ON productos.id_estado = estados.id_estado
  ORDER BY productos.id_producto ASC;  -- ASC para ordenar de manera ascendente
`;
    
  try{
      const [productos, fields] = await db.query(sql);
      res.status(200).json(productos);
  } catch(err){
      res.status(500).send({ mensaje: "Error en el servidor"}, {error: err});
    }

};

exports.listarProductosId = async (req, res) => {
    const id = req.params.id;
    const sql = `
    SELECT
      productos.id_producto,
      productos.nombre_producto,
      productos.precio,
      productos.descripcion,
      productos.imagen,
      productos.stock,
      categorias.nombre_categoria,
      marcas.nombre_marca,
      estados.nombre_estado
    FROM productos
    INNER JOIN categorias ON productos.id_categoria = categorias.id_categoria
    INNER JOIN marcas ON productos.id_marca = marcas.id_marca
    INNER JOIN estados ON productos.id_estado = estados.id_estado
   WHERE id_producto = ?
   ORDER BY productos.id_producto ASC;  -- ASC para ordenar de manera ascendente`
   ;
    //console.log(id);
  
    try {
      const [rows, fields] = await db.query(sql, [id]);
  
      if (rows.length === 0) {
        res.status(404).send({ mensaje: "Producto no encontrado" });
        return;
      }
      res.status(200).json(rows[0]);
    } catch (err) {
      res
        .status(500)
        .send({ mensaje: "Error al buscar el producto" }, { error: err });
    }
  };

exports.agregarProducto = async (req,res) => {
const {nombre_producto, precio, descripcion, imagen, stock, id_categoria, id_marca, id_estado} = req.body;
const sql = "INSERT INTO productos (nombre_producto, precio, descripcion, imagen, stock, id_categoria, id_marca, id_estado) VALUE (?,?,?,?,?,?,?,?)";

try{
    const resultado =await db.query(sql,[nombre_producto, precio, descripcion, imagen, stock, id_categoria, id_marca, id_estado]);
    res.status(200).send({id:resultado.idInsertado,...req.body});
}catch{
    res
    .status(500)
    .send({mensaje: "Error al insertar el producto"}, {error: err});
}
};

exports.actualizarProducto = async (req, res) => {
    const id = req.params.id;
    const {nombre_producto, precio, descripcion, imagen, stock, id_categoria, id_marca, id_estado} = req.body;

    const sql =
    "UPDATE productos SET nombre_producto = ?, precio = ?, descripcion = ?, imagen = ?, stock = ?, id_categoria = ?, id_marca = ?, id_estado = ? WHERE id_producto = ?";

    try {
        await db.query(sql,[nombre_producto, precio, descripcion, imagen, stock, id_categoria, id_marca, id_estado, id]);
        res.status(200).send({mensaje: "Producto actualizado"});
    } catch {
        res
        .status(500)
        .send({mensaje: "Error al actualizar el producto"}, {error: err});
    }
};

exports.eliminarProducto = async (req, res) => {
    const id = req.params.id;
    const sql = "DELETE FROM productos WHERE id_producto = ?";
  
    try {
      await db.query(sql, [id]);
      res.status(200).send({ mensaje: "Producto eliminado" });
    } catch (err) {
      res
        .status(500)
        .send({ mensaje: "Error al eliminar el producto" }, { error: err });
    }
  };