import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { clientDashboard } from "../controllers/dashboardController.js";
import { crearPedido } from "../controllers/pedidosController.js";
import { showPedidosClient } from '../controllers/pedidosController.js';

const router = express.Router();

router.get("/dashboard", authMiddleware, clientDashboard);

router.get("/misPedidos", authMiddleware, showPedidosClient);

 router.post("/crearpedido",authMiddleware,crearPedido);


 router.get('/contact', authMiddleware, (req, res) => {
     res.render('contact', {
         title: 'Contacto',
         usuario: req.user
     });
 });

 router.get('/about-us', authMiddleware, (req, res) => {
    res.render('about-us', {
        title: 'Sobre nosotros',
        usuario: req.user
    });
});
 
export default router;
