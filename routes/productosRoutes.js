const express = require("express");
const productosController = require("../controllers/productosController");
const router = express.Router();

router.get("/", productosController.listarProductos);
router.get("/:id", productosController.listarProductosId);
router.post("/", productosController.agregarProducto);
router.put("/:id", productosController.actualizarProducto);
router.delete("/:id", productosController.eliminarProducto);


module.exports = router;