const db = require("../models/db");

// GET /usuarios

exports.listarUsuarios = async (req, res) => {
  const sql = `
  SELECT usuarios.id_usuario, usuarios.nombre_usuario, usuarios.apellido_usuario, usuarios.email, usuarios.password, roles.nombre_rol
  FROM usuarios
  INNER JOIN roles ON usuarios.id_rol = roles.id_rol
  ORDER BY usuarios.id_usuario ASC;  -- ASC para ordenar de manera ascendente
`;

    
  try{
      const [usuarios, fields] = await db.query(sql);
      res.status(200).json(usuarios);
  } catch(err){
      res.status(500).send({ mensaje: "Error en el servidor"}, {error: err});
    }

};

exports.listarUsuariosId = async (req, res) => {
    const id = req.params.id;
    const sql = `
    SELECT id_usuario, nombre_usuario, apellido_usuario, email, password, nombre_rol
    FROM usuarios
    INNER JOIN roles ON usuarios.id_rol = roles.id_rol
    WHERE id_usuario = ?`;
    //console.log(id);
  
    try {
      const [rows, fields] = await db.query(sql, [id]);
  
      if (rows.length === 0) {
        res.status(404).send({ mensaje: "Usuario no encontrado" });
        return;
      }
      res.status(200).json(rows[0]);
    } catch (err) {
      res
        .status(500)
        .send({ mensaje: "Error al buscar el usuario" }, { error: err });
    }
  };

exports.agregarUsuario = async (req,res) => {
const {nombre_usuario, apellido_usuario, email, password, id_rol} = req.body;
const sql = "INSERT INTO usuarios (nombre_usuario, apellido_usuario, email, password, id_rol) VALUE (?,?,?,?,?)";

try{
    const resultado =await db.query(sql,[nombre_usuario, apellido_usuario, email, password, id_rol]);
    res.status(200).send({id:resultado.idInsertado,...req.body});
}catch{
    res
    .status(500)
    .send({mensaje: "Error al insertar el usuario"}, {error: err});
}
};

exports.actualizarUsuario = async (req, res) => {
    const id = req.params.id;
    const {nombre_usuario, apellido_usuario, email, password, id_rol} = req.body;

    const sql =
    "UPDATE usuarios SET nombre_usuario = ?, apellido_usuario = ?, email = ?, password = ?, id_rol = ? WHERE id_usuario = ?";

    try {
        await db.query(sql,[nombre_usuario, apellido_usuario, email, password, id_rol, id]);
        res.status(200).send({mensaje: "Usuario actualizado"});
    } catch {
        res
        .status(500)
        .send({mensaje: "Error al actualizar el usuario"}, {error: err});
    }
};

exports.eliminarUsuario = async (req, res) => {
    const id = req.params.id;
    const sql = "DELETE FROM usuarios WHERE id_usuario = ?";
  
    try {
      await db.query(sql, [id]);
      res.status(200).send({ mensaje: "Usuario eliminado" });
    } catch (err) {
      res
        .status(500)
        .send({ mensaje: "Error al eliminar el usuario" }, { error: err });
    }
  };