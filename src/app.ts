require('dotenv').config();
import path from 'path';
import express from 'express'
import passport from 'passport'
import passportMiddleware from './middlewares/passport';
import cors from 'cors';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import * as swaggerDocument from './swagger.json';
import authRoutes from './routes/auth.routes';
import especialidadRoutes from './routes/especialidad.routes';
import userRoutes from './routes/user.routes';
import emergenciaRoutes from './routes/emergencia.routes';
import paisesRoutes from './routes/pais.routes';
import horarioRoutes from './routes/horario.routes';
import mediosRoutes from './routes/medio.routes';
import tarjetasRoutes from './routes/tarjeta.routes';
import citasRoutes from './routes/cita.routes';
import pagosRoutes from './routes/pago.routes';
import extraRoutes from './routes/extra.routes';

const app = express();

// settings
app.set('port', process.env.PORT);

// middlewares
app.use(morgan('dev'));
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(passport.initialize());
passport.use(passportMiddleware);

app.get('/', (req, res) => {
  return res.send(`This service web is for FONOMED`);
})

app.use(express.static(path.join('./src/public')));
app.use(authRoutes);
app.use(especialidadRoutes);
app.use(userRoutes);
app.use(emergenciaRoutes);
app.use(paisesRoutes);
app.use(horarioRoutes);
app.use(tarjetasRoutes);
app.use(mediosRoutes);
app.use(citasRoutes);
app.use(pagosRoutes);
app.use(extraRoutes);

app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

export default app;
