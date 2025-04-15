import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('makeup', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  port: 3306,
  define: {
    timestamps: false // Deshabilitar timestamps automáticos
  },
});

export default sequelize;