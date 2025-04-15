import Producto from "../models/Producto.js";
import Categoria from "../models/Categoria.js";

export const registerProd = async (req, res) => {
  console.log('Controlador registerProd invocado');
    try {
    const { categoriaP, nombre, cantidad, precioC, precioV,  } = req.body;
    const imagen = req.file ? req.file.filename : null;
      console.log(req.body)
    let erroresBack = [];

    // Validaciones
    if (!nombre || nombre.trim() === "") {
      erroresBack.push({ mensaje: "El nombre del producto es obligatorio." });
    }

    if (!categoriaP || isNaN(categoriaP)) {
      erroresBack.push({ mensaje: "Debes seleccionar una categoría válida." });
    } else {
      const categoriaExiste = await Categoria.findByPk(categoriaP);
      if (!categoriaExiste) {
        erroresBack.push({ mensaje: "La categoría seleccionada no existe." });
      }
    }

    if (!imagen) {
      erroresBack.push({ mensaje: "Debes subir una imagen del producto." });
    }

    if (!cantidad || cantidad <= 0) {
      erroresBack.push({ mensaje: "La cantidad debe ser mayor a cero." });
    }

    if (!precioC || precioC <= 0) {
      erroresBack.push({ mensaje: "El precio de compra debe ser mayor a cero." });
    }

    if (!precioV || precioV <= 0) {
      erroresBack.push({ mensaje: "El precio de venta debe ser mayor a cero." });
    }

    // Si hay errores, redirigir con flash
    if (erroresBack.length > 0) {
      req.flash('errores', JSON.stringify(erroresBack));
      return res.redirect("/admin/inventario");
    }

    // Crear producto
    await Producto.create({
      nombre,
      precio_compra: precioC,
      precio_venta: precioV,
      ganancia: 0, 
      cantidad_vendida: 0,
      cantidad_actual: cantidad,
      total: 0,
      status: "disponible", 
      categoria_id: categoriaP, // Relación con la categoría
      imagen,
    });

    req.flash('successMessage', 'Producto agregado exitosamente.');
    res.redirect("/admin/inventario");

  } catch (error) {
    console.error("Error al registrar producto:", error);
    res.status(500).send("Error interno del servidor al registrar producto");
  }
};

// Editar producto
export const editProducto = async (req, res) => {
  try {
    const {id,nombre, cantidad, precioC, precioV, categoriaP } = req.body;
    const imagen = req.file ? req.file.filename : null;

    let erroresBack = [];

    // Validaciones
    if (!id || isNaN(id)) {
      erroresBack.push({ mensaje: "ID del producto no válido." });
    }

    if (nombre && nombre.trim() === "") {
      erroresBack.push({ mensaje: "El campo nombre está vacío" });
    } else if (nombre && !/^[a-zA-Z0-9\sáéíóúÁÉÍÓÚñÑ]+$/.test(nombre)) {
      erroresBack.push({ mensaje: "El nombre solo debe contener letras, números y espacios" });
    }

    if (cantidad && (isNaN(cantidad) || cantidad <= 0)) {
      erroresBack.push({ mensaje: "La cantidad debe ser un número mayor a cero" });
    }

    if (precioC && (isNaN(precioC) || precioC <= 0)) {
      erroresBack.push({ mensaje: "El precio de compra debe ser un número mayor a cero" });
    }

    if (precioV && (isNaN(precioV) || precioV <= 0)) {
      erroresBack.push({ mensaje: "El precio de venta debe ser un número mayor a cero" });
    }

    if (categoriaP && isNaN(categoriaP)) {
      erroresBack.push({ mensaje: "Debes seleccionar una categoría válida." });
    }

    if (erroresBack.length) {
      req.flash("errores", JSON.stringify(erroresBack));
      return res.redirect("/admin/inventario");
    }

    // Buscar el producto
    const producto = await Producto.findByPk(id);
    if (!producto) {
      console.error(`Producto con ID ${id} no encontrado.`);
      req.flash("errores", JSON.stringify([{ mensaje: "El producto no existe." }]));  
      return res.redirect("/admin/inventario");
    }

    // Verificar la categoría
    if (categoriaP) {
      const categoriaExiste = await Categoria.findByPk(categoriaP);
      if (!categoriaExiste) {
        req.flash("errores", JSON.stringify([{ mensaje: "La categoría seleccionada no existe." }]));  
        return res.redirect("/admin/inventario");
      }
    }

    // Actualización
    const datosActualizados = {
      nombre: nombre?.trim() || producto.nombre,
      cantidad_actual: cantidad || producto.cantidad_actual,
      precio_compra: precioC || producto.precio_compra,
      precio_venta: precioV || producto.precio_venta,
      categoria_id: categoriaP || producto.categoria_id,
      imagen: imagen || producto.imagen,
    };

    // Actualizamos el producto
    await producto.update(datosActualizados);

    req.flash("successMessage", "Producto actualizado correctamente.");
    return res.redirect("/admin/inventario");
  } catch (error) {
    console.error("Error en editProducto:", error);
    res.status(500).send("Error al editar producto");
  }
};


export const eliminarProducto = async (req, res) => {
  try {
    const { id } = req.params;

    const producto = await Producto.findByPk(id);
    if (!producto) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }

    await producto.destroy();

    res.status(200).json({ mensaje: 'Producto eliminado correctamente' });
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    res.status(500).json({ mensaje: 'Error al eliminar producto' });
  }
};