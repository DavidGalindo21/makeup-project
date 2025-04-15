import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const User = sequelize.define(
  "usuarios",
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
    Correo: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    Telefono: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Contrasena: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Rol: {
      type: DataTypes.ENUM("admin", "client"),
    },
  },
  {
    tableName: "usuarios", // Nombre exacto de la tabla
    freezeTableName: true, // Desactiva pluralización automática
    timestamps: false, // Desactiva los timestamps automáticos
  }
);

export default User;