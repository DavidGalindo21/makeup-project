import Categoria from "../models/Categoria.js";
import Producto from "../models/Producto.js";


export const registerCat = async (req, res) => {
  try {
    const { nombre } = req.body;
    const imagen = req.file ? req.file.filename : null;

    let erroresBack = [];

    if (nombre.trim() === "") {
      erroresBack.push({ mensaje: "El campo nombre está vacío" });
    } else if (!/^[a-zA-Z\sáéíóúÁÉÍÓÚñÑ]+$/.test(nombre)) {
      erroresBack.push({ mensaje: "El nombre solo debe contener letras y espacios" });
    }

    if (!imagen) {
      erroresBack.push({ mensaje: "Debes subir una imagen" });
    }

    
    if (erroresBack.length) {
      console.log('Errores:', erroresBack); // Asegúrate de que los errores están llegando correctamente
      req.flash('errores', JSON.stringify(erroresBack));
      return res.redirect("/admin/inventario");
    }

    const categoriaExistente = await Categoria.findOne({
      where: { Nombre: nombre },
    });

    if (categoriaExistente) {
      console.log('Error: La categoría ya está registrada'); // Verifica que el error se pasa correctamente
      req.flash('errores', JSON.stringify([{ mensaje: "La categoría ya está registrada" }]));
      return res.redirect("/admin/inventario");
    }

    await Categoria.create({
      Nombre: nombre,
      Imagen: imagen,
    });

    console.log('Categoría agregada exitosamente');
    req.flash('successMessage', 'Categoría agregada exitosamente.');
    return res.redirect("/admin/inventario");
  } catch (error) {
    console.error("Error en registerCat:", error);
    res.status(500).send("Error en el registro");
  }
};

//Editar categoria
export const editCategoria = async (req, res) => {
  try {
    const { id, nombre } = req.body;
    const imagen = req.file ? req.file.filename : null;

    let erroresBack = [];

    // Validación del campo nombre
    if (nombre && nombre.trim() === "") {
      erroresBack.push({ mensaje: "El campo nombre está vacío" });
    } else if (!/^[a-zA-Z\sáéíóúÁÉÍÓÚñÑ]+$/.test(nombre)) {
      erroresBack.push({ mensaje: "El nombre solo debe contener letras y espacios" });
    }

    if (erroresBack.length) {
      req.flash("errores", JSON.stringify(erroresBack));
      return res.redirect("/admin/inventario");
    }

    const categoria = await Categoria.findByPk(id);

    if (!categoria) {
      req.flash("errores", JSON.stringify([{ mensaje: "La categoría no existe" }]));
      return res.redirect("/admin/inventario");
    }

    // Actualización 
    const datosActualizados = {
      Nombre: nombre?.trim() || categoria.Nombre, 
      Imagen: imagen || categoria.Imagen,
    };

    await categoria.update(datosActualizados);



    req.flash("successMessage", "Categoría actualizada correctamente.");
    return res.redirect("/admin/inventario");
  } catch (error) {
    console.error("Error en editCategoria:", error);
    res.status(500).send("Error al editar categoría");
  }
};



// Mostrar categorías y productos en inventario
export const showCategorias = async (req, res) => {
  try {
    const categorias = await Categoria.findAll();
    const productos = await Producto.findAll();

    const erroresFlash = req.flash('errores');
    const successFlash = req.flash('successMessage');

    res.render("inventario", {
      title: "Inventario",
      categorias,
      productos,
      errores: erroresFlash.length ? JSON.parse(erroresFlash[0]) : [],
      successMessage: successFlash.length ? successFlash[0] : null,
      usuario: req.user,
    });
  } catch (error) {
    console.error("Error al obtener categorías:", error);
    res.status(500).send("Error al obtener categorías");
  }
};

// Mostrar categorías y productos en la página del admin
export const showCategoriasI = async (req, res) => {
  try {
    const categorias = await Categoria.findAll();
    const productos = await Producto.findAll();

    const erroresFlash = req.flash('errores');
    const successFlash = req.flash('successMessage');

    res.render("indexAdmin", {
      title: "Inicio Admin",
      categorias,
      productos,
      errores: erroresFlash.length ? JSON.parse(erroresFlash[0]) : [],
      successMessage: successFlash.length ? successFlash[0] : null,
      usuario: req.user,
    });
  } catch (error) {
    console.error("Error al obtener categorías:", error);
    res.status(500).send("Error al obtener categorías");
  }
};


export const showCategoriasIC = async (req, res) => {
  try {
    const categorias = await Categoria.findAll();
    const productos = await Producto.findAll();

    const erroresFlash = req.flash('errores');
    const successFlash = req.flash('successMessage');

    res.render("index", {
      title: "Inicio",
      categorias,
      productos,
      errores: erroresFlash.length ? JSON.parse(erroresFlash[0]) : [],
      successMessage: successFlash.length ? successFlash[0] : null,
      usuario: req.user,
    });
  } catch (error) {
    console.error("Error al obtener categorías:", error);
    res.status(500).send("Error al obtener categorías");
  }
};


export const showCategoriasIn = async (req, res) => {
  try {
    const categorias = await Categoria.findAll();
    const productos = await Producto.findAll();

    const erroresFlash = req.flash('errores');
    const successFlash = req.flash('successMessage');

    res.render("product", {
      title: "Productos",
      categorias,
      productos,
      errores: erroresFlash.length ? JSON.parse(erroresFlash[0]) : [],
      successMessage: successFlash.length ? successFlash[0] : null,
      usuario: req.user,
    });
  } catch (error) {
    console.error("Error al obtener categorías:", error);
    res.status(500).send("Error al obtener categorías");
  }
};


export const eliminarCategoria = async (req, res) => {
  try {
    const { id } = req.params;

    const categoria = await Categoria.findByPk(id);
    if (!categoria) {
      return res.status(404).json({ mensaje: 'Categoría no encontrada' });
    }

    await categoria.destroy();

    res.status(200).json({ mensaje: 'Categoría eliminada correctamente' });
  } catch (error) {
    console.error("Error al eliminar categoría:", error);
    res.status(500).json({ mensaje: 'Error al eliminar categoría' });
  }
};



export const showProductosPorCategoria = async (req, res) => {
  try {
    const { categoriaId } = req.params;

    // Verifica que categoriaId esté definido
    if (!categoriaId) {
      return res.status(400).send("ID de categoría no proporcionado");
    }

    // Filtra productos por categoría
    const productos = await Producto.findAll({
      where: { categoriaId }, // Asegúrate de que `categoriaId` exista en la base de datos
    });

    if (!productos.length) {
      return res.status(404).send("No se encontraron productos para esta categoría");
    }

    res.render("productosPorCategoria", {
      title: "Productos por Categoría",
      productos,
    });
  } catch (error) {
    console.error("Error al obtener productos por categoría:", error);
    res.status(500).send("Error interno del servidor");
  }
};

