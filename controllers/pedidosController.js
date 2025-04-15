import Pedido from "../models/Pedido.js";
import Producto from "../models/Producto.js";
import { Categorias, Pedidos, Productos, Usuarios } from "../models/index.js"
import sequelize from "../config/db.js";
import {format, parse} from "date-fns"
import { Op } from "sequelize";

// Crear pedido
export const crearPedido = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    console.log("Datos recibidos del frontend:", req.body);

    if (!req.body || !Array.isArray(req.body) || req.body.length === 0) {
      return res.status(400).json({ error: "No se recibieron productos para el pedido" });
    }

    const productos = req.body;
    const usuarioId = req.user?.id;

    if (!usuarioId) {
      return res.status(401).json({ error: "Usuario no autenticado" });
    }

    for (const producto of productos) {
      const { nombre, cantidad, precio, imagen, categoriaId, idProducto } = producto;

      if (!nombre || !cantidad || !precio || !imagen || !categoriaId || !idProducto) {
        await t.rollback();
        return res.status(400).json({ error: "Datos de producto incompletos" });
      }

      const productoEnDB = await Producto.findByPk(idProducto, { transaction: t });

      if (!productoEnDB) {
        await t.rollback();
        return res.status(404).json({ error: `Producto con ID ${idProducto} no encontrado` });
      }

      if (productoEnDB.cantidad_actual <= 0) {
        await t.rollback();
        return res.status(400).json({ error: `El producto "${nombre}" no tiene stock disponible` });
      }

      if (productoEnDB.cantidad_actual < cantidad) {
        await t.rollback();
        return res.status(400).json({ error: `Stock insuficiente para el producto "${nombre}". Solo quedan ${productoEnDB.cantidad_actual}` });
      }

      // Actualizar stock
      productoEnDB.cantidad_actual -= cantidad;
      await productoEnDB.save({ transaction: t });

      // Crear pedido
      await Pedido.create({
        nombre,
        cantidad,
        precioTotal: precio * cantidad,
        imagen,
        categoria_id: categoriaId,
        usuario_id: usuarioId,
        producto_id: idProducto,
        status: "pendiente",
      }, { transaction: t });
    }

    await t.commit();
    return res.status(200).json({ mensaje: "Pedido creado exitosamente" });

  } catch (error) {
    await t.rollback();
    console.error("Error al crear pedido:", error);
    return res.status(500).json({
      error: "Error interno del servidor al crear el pedido",
      details: error.message,
    });
  }
};



export const showPedidos = async (req, res) => {
  try {
    const pedidos = await Pedidos.findAll({
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: Productos,
          attributes: ["nombre", "precio_venta", "imagen"],
        },
        {
          model: Usuarios,
          attributes: ["Nombre", "Telefono"],
        },
        {
          model: Categorias,
          attributes: ["nombre"],
        },
      ],
    });

    const pedidosAgrupados = {};

    pedidos.forEach(pedido => {
      const clave = format(new Date(pedido.createdAt), "yyyy-MM-dd HH:mm:ss");

      if (!pedidosAgrupados[clave]) {
        pedidosAgrupados[clave] = {
          pedidos: [],
          totalPrecio: 0,
          totalCantidad: 0,
        };
      }

      pedidosAgrupados[clave].pedidos.push(pedido);
      pedidosAgrupados[clave].totalPrecio += parseFloat(pedido.precioTotal);
      pedidosAgrupados[clave].totalCantidad += parseInt(pedido.cantidad);
    });

    const erroresFlash = req.flash('errores');
    const successFlash = req.flash('successMessage');

    res.render("pedidos", {
      title: "Pedidos Admin",
      pedidosAgrupados,
      errores: erroresFlash.length ? JSON.parse(erroresFlash[0]) : [],
      successMessage: successFlash.length ? successFlash[0] : null,
      usuario: req.user,
    });

  } catch (error) {
    console.error("Error al obtener pedidos:", error);
    return res.status(500).json({ error: "Error interno al obtener los pedidos" });
  }
};





// Pedidos Controller (showPedidos)
// Pedidos Controller (showPedidos)
export const showPedidosClient = async (req, res) => {
  try {
    const usuarioId = req.user?.id;

    if (!usuarioId) {
      return res.status(401).json({ error: "No autenticado" });
    }

    const pedidos = await Pedidos.findAll({
      order: [["createdAt", "DESC"]],
      where: { usuario_id: usuarioId },
      include: [
        {
          model: Productos,
          attributes: ["nombre", "precio_venta", "imagen"],
        },
        {
          model: Usuarios,
          attributes: ["Nombre", "Telefono"],
        },
        {
          model: Categorias,
          attributes: ["nombre"],
        },
      ],
    });

    if (!pedidos.length) {
      return res.status(404).json({ error: "No se encontraron pedidos para este usuario." });
    }

    // Agrupar por fecha formateada
    const pedidosAgrupados = {};

    pedidos.forEach(pedido => {
      const fecha = new Date(pedido.createdAt).toLocaleDateString("es-ES");
      if (!pedidosAgrupados[fecha]) {
        pedidosAgrupados[fecha] = [];
      }
      pedidosAgrupados[fecha].push(pedido);
    });

    res.render("misPedidos", {
      title: "Mis Pedidos",
      pedidosAgrupados, // pasamos el objeto agrupado
      usuario: req.user,
    });

  } catch (error) {
    console.error("Error al obtener pedidos:", error);
    return res.status(500).json({ error: "Error interno al obtener los pedidos" });
  }
};

export const actualizarEstadoPedido = async (req, res) => {
  const { idPedido, nuevoEstado } = req.body;

  try {
    const pedido = await Pedidos.findByPk(idPedido, {
      include: {
        model: Usuarios,
        as: 'usuario',
        attributes: ['Telefono']
      }
    });

    if (!pedido) {
      return res.status(404).json({ success: false, message: "Pedido no encontrado" });
    }

    const producto = await Productos.findByPk(pedido.producto_id);

    // Si el estado cambia a 'completado', actualizamos la cantidad vendida y la ganancia
    if (nuevoEstado === 'completado' && producto) {
      // Actualizamos cantidad vendida y total
      producto.cantidad_vendida += pedido.cantidad;
      producto.total = producto.cantidad_vendida * producto.precio_venta;

      // Calculamos la ganancia: (precio_venta - precio_compra) * cantidad_vendida
      const gananciaUnit = producto.precio_venta - producto.precio_compra;
      producto.ganancia = gananciaUnit * producto.cantidad_vendida;

      await producto.save();
    }

    pedido.status = nuevoEstado;
    await pedido.save();

    return res.json({
      success: true,
      message: "Estado actualizado correctamente",
      telefono: pedido.usuario?.Telefono || null,
      nuevoEstado,
    });

  } catch (error) {
    console.error("Error al actualizar el estado del pedido:", error);
    return res.status(500).json({ success: false, message: "Error al actualizar el estado del pedido" });
  }
};

export const eliminarPedido = async (req, res) => {
  const { id } = req.params;

  try {
    const pedido = await Pedidos.findByPk(id);
    if (!pedido) {
      return res.status(404).json({
        success: false,
        message: "Pedido no encontrado"
      });
    }

    // Usamos la fecha exacta de creación para encontrar todos los pedidos creados en ese momento
    const fecha = pedido.createdAt;

    const pedidosMismoMomento = await Pedidos.findAll({
      where: { createdAt: fecha }
    });

    // Actualizamos la cantidad_actual de los productos
  if(pedido.status != "completado"){
    for (const p of pedidosMismoMomento) {
      const producto = await Productos.findByPk(p.producto_id);
      if (producto) {
        producto.cantidad_actual += p.cantidad;
        await producto.save();
      }
    }
  }

    // Eliminamos todos los pedidos en esa fecha
    await Pedidos.destroy({
      where: { createdAt: fecha }
    });

    return res.status(200).json({
      success: true,
      message: "Pedidos eliminados correctamente"
    });
  } catch (error) {
    console.error("Error al eliminar pedidos:", error);
    return res.status(500).json({
      success: false,
      message: "Error al eliminar los pedidos"
    });
  }
};
