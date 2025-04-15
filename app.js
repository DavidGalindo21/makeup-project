import express from 'express';
import cookieParser from 'cookie-parser';
import sequelize from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import rutasVistas from './routes/rutasVistas.js';
import adminRoutes from './routes/adminRoutes.js';
import clientRoutes from './routes/clientRoutes.js';
import session from 'express-session';
import flash from 'connect-flash';
import methodOverride from 'method-override';

const app = express();
app.use(methodOverride('_method'));
app.use(session({
  secret: 'mi_secreto',
  resave: false,
  saveUninitialized: true
}));

app.use(flash());


// Configuración
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.set('view engine', 'ejs');

app.use(express.static('public'));


// Rutas
app.use('/', rutasVistas);
app.use('/', authRoutes);
app.use('/admin', adminRoutes);
app.use('/client', clientRoutes);



// Iniciar servidor
const PORT = 4000;
app.listen(PORT, async () => {
  console.log(`Servidor en http://localhost:${PORT}`);
  try {
    await sequelize.authenticate();
    console.log('Conexión a BD exitosa');
  } catch (error) {
    console.error('Error de conexión:', error);
  }
});