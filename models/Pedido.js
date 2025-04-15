import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Pedido = sequelize.define(
  "pedidos",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    precioTotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    imagen: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    categoria_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "categorias", // Nombre de la tabla relacionada
        key: "id",
      },
    },
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "usuarios", // Nombre de la tabla relacionada
        key: "id",
      },
    },
    producto_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "productos", // Nombre de la tabla relacionada
        key: "id",
      },
    },
    status: {
      type: DataTypes.ENUM("pendiente", "en proceso", "completado"),
      allowNull: false,
      defaultValue: "pendiente",
    },
  },
  {
    tableName: "pedidos", // Nombre exacto de la tabla
    freezeTableName: true, // Desactiva pluralización automática
    timestamps: true, // Desactiva los timestamps automáticos
  }
);

export default Pedido;