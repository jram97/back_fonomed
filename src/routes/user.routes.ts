import { Router } from 'express';
import passport from "passport";
import { getSearch, getAll, getById, cuentaPagadito, nuevoRating, eliminar, getByToken, } from '../controllers/doctores.controller'
import { actualizarExpediente, expedientePaciente, expediente } from '../controllers/expediente.controller'
import { sendTokenForCall, doctorDisponible, agregarTokenFirebase, eliminarTokenFirebase, notificar } from '../controllers/user.controller';
import { nuevaMembresia, cancelarMembresia, verificarMembresia } from '../controllers/membresia.controller';

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
/**Obtener primer doctor disponible */
router.post('/doctores/getDoctor', doctorDisponible);

/** Send token call and videocall */
router.get('/doctores/videocall', passport.authenticate("jwt", { session: false }), sendTokenForCall);

/** USERS FUNCTIONS */
//router.get("user/me", passport.authenticate("jwt", { session: false }), getByTokenUser);
router.delete('/user/delete/:id', passport.authenticate("jwt", { session: false }), eliminar);
router.put('/user/me/update', passport.authenticate("jwt", { session: false }), cuentaPagadito);
router.put('/user/expediente', passport.authenticate("jwt", { session: false }), actualizarExpediente);

/** Firebase */
router.put('/user/agregarTokenFirebase', passport.authenticate("jwt", { session: false }), agregarTokenFirebase);
router.put('/user/eliminarTokenFirebase', passport.authenticate("jwt", { session: false }), eliminarTokenFirebase);

/**Membresia */
router.post('/user/membresia', passport.authenticate("jwt", { session: false }), nuevaMembresia);
router.post('/user/membresia/verificar', passport.authenticate("jwt", { session: false }), verificarMembresia);
router.put('/user/membresia/cancelar', passport.authenticate("jwt", { session: false }), cancelarMembresia);

/** Expediente */
router.get('/user/expediente/me', passport.authenticate("jwt", { session: false }), expediente);
router.get('/user/expediente/:id', passport.authenticate("jwt", { session: false }), expedientePaciente);

/**Notificar reprogramacion */
router.post('/user/notificar', passport.authenticate("jwt", { session: false }), notificar);

/** RATINGS */
/** Agregar Rating */
router.put('/doctores/comentarios/agregar', passport.authenticate("jwt", { session: false }), nuevoRating);

export default router;
