import User from "../models/Users.js";
import Categoria from "../models/Categoria.js";
import Producto from "../models/Producto.js";

export const adminDashboard = async (req, res) => {
  try {
    const users = await User.findAll();
    const categorias = await Categoria.findAll();  
    const productos = await Producto.findAll();   

    res.render("indexAdmin", {
      categorias,
      productos,
      usuario: users,
      title: "Inicio Admin",
      successMessage: null,
    });
  } catch (error) {
    res.status(500).send("Error al cargar dashboard");
  }
};

// Página de inventario
export const inventarioPage = async (req, res) => {
  try {
    const categorias = await Categoria.findAll();  // Obtener categorías
    const productos = await Producto.findAll();   // Obtener productos

    res.render("inventario", {
      title: "Inventario",
      categorias,
      productos,
      usuario: req.user || null, 
      errores: [],
      successMessage: "", 
    });
  } catch (error) {
    console.error("Error en inventarioPage:", error);
    res.status(500).send("Error al cargar inventario");
  }
};



export const clientDashboard = async (req, res) => {
  try {
    const categorias = await Categoria.findAll();  
    const productos = await Producto.findAll();   
    const user = await User.findByPk(req.user.id);
    res.render("index", {
      usuario: user,
      categorias,
      productos,

      title: "Inicio",
      successMessage: null,
    });
  } catch (error) {
    res.status(500).send("Error al cargar dashboard");
  }
};
