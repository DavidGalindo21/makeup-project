import Pedidos from "./Pedido.js";
import Productos from "./Producto.js";
import Usuarios from "./Users.js";
import Categorias from "./Categoria.js";

// Relacionar pedidos con productos, usuarios y categorías
Pedidos.belongsTo(Productos, { foreignKey: "producto_id"});
Pedidos.belongsTo(Usuarios, { foreignKey: "usuario_id" });
Pedidos.belongsTo(Categorias, { foreignKey: "categoria_id" });

// (opcional) relaciones inversas
Productos.hasMany(Pedidos, { foreignKey: "producto_id" });
Usuarios.hasMany(Pedidos, { foreignKey: "usuario_id" });
Categorias.hasMany(Pedidos, { foreignKey: "categoria_id" });

export { Pedidos, Productos, Usuarios, Categorias };
