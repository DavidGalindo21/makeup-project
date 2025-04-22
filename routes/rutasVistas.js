import express from "express";
import Categoria from "../models/Categoria.js";
import Producto from "../models/Producto.js";

const router = express.Router();

router.get("/", async (req, res) => {
    try {
      const categorias = await Categoria.findAll();
      const productos = await Producto.findAll();
  console.log(req.user)
      res.render("index", {
        title: "Inicio",
        categorias,
        productos,
        errores: [],
        successMessage: null,
        usuario: req.user || null,
      });
    } catch (error) {
      console.error("Error al cargar página de inicio:", error);
      res.status(500).send("Error al cargar la página de inicio");
    }
  });

router.get("/account-login", (req, res) => {
  res.render("account-login", {
    title: "Register",
    errores: [],
    successMessage: null,
    usuario: null,
  });
});

router.get('/about-us',(req,res)=>{
    res.render('about-us',{
        title:'Sobre Nostros',
        usuario:null
    })
})

router.get('/product',(req,res)=>{
    res.render('product',{
        title:'Productos',
        usuario:null
    })
})

router.get('/contact',(req,res)=>{
    res.render('contact',{
        title:'contact',
        usuario:null
    })
})

export default router;
