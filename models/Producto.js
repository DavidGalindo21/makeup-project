import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Producto = sequelize.define(
  "productos",
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
      precio_compra: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      precio_venta: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      ganancia: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      cantidad_vendida: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      cantidad_actual: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      total: {
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
          model: "categorias", // nombre de la tabla relacionada
          key: "id",
        },
      },
  
    status: {
      type: DataTypes.ENUM("disponible", "agotado"),
      allowNull: false,
      defaultValue: "disponible",
    },
  
    
  },
  {
    tableName: "productos", // Nombre exacto de la tabla
    freezeTableName: true, // Desactiva pluralización automática
    timestamps: false, // Desactiva los timestamps automáticos
  }
);

//actualizar el status antes de guardar o actualizar
Producto.beforeSave((producto) => {
  if (producto.cantidad_actual > 0) {
    producto.status = "disponible";
  } else {
    producto.status = "agotado";
  }
});

export default Producto;
