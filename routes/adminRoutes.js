import express from "express";
import {
  registerCat,
  showCategorias,
  eliminarCategoria,
  editCategoria
} from "../controllers/categoriasController.js";

import {
  registerProd,
  eliminarProducto,
  editProducto
} from "../controllers/productosController.js";

import {
  showPedidos,
  actualizarEstadoPedido,
  eliminarPedido,
} from "../controllers/pedidosController.js";

import { roleMiddleware } from "../middlewares/roleMiddleware.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { adminDashboard } from "../controllers/dashboardController.js";
import { generarExcel, generarPDF } from "../controllers/crearDocumentos.js";

// Multer básico sin eliminar imagen anterior
import upload from "../middlewares/multer.js";

const router = express.Router();

// Dashboard
router.get(
  "/dashboard",
  authMiddleware,
  roleMiddleware(["admin"]),
  adminDashboard
);

// Inventario (categorías)
router.get(
  "/inventario",
  authMiddleware,
  roleMiddleware(["admin"]),
  showCategorias
);
router.get('/contact',(req,res)=>{
  res.render('contact',{
      title:'contact',
      usuario:null
  })
})
// Pedidos
router.get("/pedidos", authMiddleware, roleMiddleware(["admin"]), showPedidos);

router.post(
  "/pedidos/actualizarestado",
  authMiddleware,
  roleMiddleware(["admin"]),
  actualizarEstadoPedido
);

router.delete(
  "/pedidos/eliminarpedido/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  eliminarPedido
);

router.post(
  "/inventario/categorias/editar",
  upload.single("fotoC"),
  authMiddleware,
  roleMiddleware(["admin"]),
  editCategoria
);

router.post(
  "/inventario/producto/editar",
  upload.single("fotoP"),
  authMiddleware,
  roleMiddleware(["admin"]),
  editProducto
);

// Eliminar categoría
router.delete(
  "/inventario/eliminar/categoria/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  eliminarCategoria
);

router.route("/inventario/eliminar/producto/:id")
  .delete(
    authMiddleware,
    roleMiddleware(["admin"]),
    eliminarProducto // Función que maneja la eliminación de productos
  );

// Registrar categoría con imagen
router.post("/inventario/categorias", upload.single("fotoC"), registerCat);

// Registrar producto con imagen
router.post("/inventario/producto", upload.single("fotoP"), registerProd);

// GENERAR DOCUMENTOS
router.get(
  "/descargar/excel",
  authMiddleware,
  roleMiddleware(["admin"]),
  generarExcel
);
router.get(
  "/descargar/pdf",
  authMiddleware,
  roleMiddleware(["admin"]),
  generarPDF
);
export default router;
