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

router.get('/blog-right-sidebar',(req,res)=>{
    res.render('blog-right-sidebar',{
        title:'Blog-right',
        usuario:null
    })
})


router.get('/faq',(req,res)=>{
    res.render('faq',{
        title:'faq',
        usuario:null
    })
})

router.get('/page-not-found',(req,res)=>{
    res.render('page-not-found',{
        title:'page-not-found',
        usuario:null
    })
})

router.get('/product-cart',(req,res)=>{
    res.render('product-cart',{
        title:'product-cart',
        usuario:null
    })
})
router.get('/product-checkout',(req,res)=>{
    res.render('product-checkout',{
        title:'product-checkout',
        usuario:null
    })
})

router.get('/product-compare',(req,res)=>{
    res.render('product-compare',{
        title:'product-compare',
        usuario:null
    })
})

router.get('/product-details-affiliate',(req,res)=>{
    res.render('product-details-affiliate',{
        title:'product-details-affiliate',
        usuario:null
    })
})

router.get('/product-details-group',(req,res)=>{
    res.render('product-details-group',{
        title:'product-details-group',
        usuario:null
    })
})

router.get('/product-details-normal',(req,res)=>{
    res.render('product-details-normal',{
        title:'product-details-normal',
        usuario:null
    })
})

router.get('/product-details',(req,res)=>{
    res.render('product-details',{
        title:'product-details',
        usuario:null
    })
})

router.get('/product-left-sidebars',(req,res)=>{
    res.render('product-left-sidebar',{
        title:'product-left-sidebar',
        usuario:null
    })
})

router.get('/product-wishlist',(req,res)=>{
    res.render('product-wishlist',{
        title:'product-wishlist',
        usuario:null
    })
})



export default router;
