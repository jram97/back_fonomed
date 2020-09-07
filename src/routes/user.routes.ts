import { Router } from 'express';
import passport from "passport";
import { getSearch, getAll, getById, cuentaPagadito, nuevoRating, eliminar, getByToken } from '../controllers/doctores.controller'
import { actualizarExpediente, expedientePaciente, expediente } from '../controllers/expediente.controller'
import { sendTokenForCall } from '../controllers/user.controller';

const router = Router();

/** DOCTORES FILTRADO */
/** Usuarios :: ASC | DESC :: Default DESC */
router.get('/doctores', getAll);
/** Usuario por ID */
router.get('/doctores/id/:id', getById);
/** Usuario por TOKEN */
router.get('/doctores/me', passport.authenticate("jwt", { session: false }), getByToken);
/** Usuario buscar */
router.get('/doctores/search', getSearch);

/** Send token call and videocall */
router.get('/doctores/videocall', passport.authenticate("jwt", { session: false }), sendTokenForCall);

/** USERS FUNCTIONS */
router.delete('/user/delete/:id', passport.authenticate("jwt", { session: false }), eliminar);
router.put('/user/me/update', passport.authenticate("jwt", { session: false }), cuentaPagadito);
router.put('/user/expediente', passport.authenticate("jwt", { session: false }), actualizarExpediente);

/** Expediente */
router.get('/user/expediente/me', passport.authenticate("jwt", { session: false }), expediente);
router.get('/user/expediente/:id', passport.authenticate("jwt", { session: false }), expedientePaciente);

/** RATINGS */
/** Agregar Rating */
router.put('/doctores/comentarios/agregar', passport.authenticate("jwt", { session: false }), nuevoRating);

export default router;
