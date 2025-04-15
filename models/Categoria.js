import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Categoria = sequelize.define(
  "categorias",
  {
    Id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    Nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Imagen: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
  
  },
  {
    tableName: "categorias", // Nombre exacto de la tabla
    freezeTableName: true, // Desactiva pluralización automática
    timestamps: false, // Desactiva los timestamps automáticos
  }
);

export default Categoria;