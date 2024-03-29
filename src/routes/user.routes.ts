import { Router } from 'express';
import passport from "passport";
import { getSearch, getAllActive, getAll, getById, cuentaPagadito, nuevoRating, eliminar, getByToken, } from '../controllers/doctores.controller'
import { actualizarExpediente, expedientePaciente, expediente, notificacionSolicitud } from '../controllers/expediente.controller'
import { sendTokenForCall, doctorDisponible, agregarTokenFirebase, eliminarTokenFirebase, notificar, updateUserById, contacto, removeAllFirebaseTokens, quitarRecurrentes, cambiarEstadoDoctores, cambiarImagen, miId } from '../controllers/user.controller';
import { nuevaMembresia, cancelarMembresia, verificarMembresia } from '../controllers/membresia.controller';

import upload from "../libs/multer";

const router = Router();

/** DOCTORES FILTRADO */
/** Usuarios :: ASC | DESC :: Default DESC */
router.get('/doctores', getAllActive);

router.get('/doctoresAll', getAll);
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
router.put('/user/update', passport.authenticate("jwt", { session: false }), updateUserById);
router.put('/user/expediente', passport.authenticate("jwt", { session: false }), actualizarExpediente);

/** Firebase */
router.put('/user/agregarTokenFirebase', passport.authenticate("jwt", { session: false }), agregarTokenFirebase);
router.put('/user/eliminarTokenFirebase', passport.authenticate("jwt", { session: false }), eliminarTokenFirebase);
router.put('/user/eliminarTokensFirebase', passport.authenticate("jwt", { session: false }), removeAllFirebaseTokens);

/**Membresia */
router.post('/user/membresia', passport.authenticate("jwt", { session: false }), nuevaMembresia);
router.post('/user/membresia/verificar', passport.authenticate("jwt", { session: false }), verificarMembresia);
router.put('/user/membresia/cancelar', passport.authenticate("jwt", { session: false }), cancelarMembresia);
router.put('/user/quitarRecurrentes', passport.authenticate("jwt", { session: false }), quitarRecurrentes);
router.put('/user/cambiarEstadoDoctores', passport.authenticate("jwt", { session: false }), cambiarEstadoDoctores);

/** Expediente */
router.get('/user/expediente/me', passport.authenticate("jwt", { session: false }), expediente);
router.get('/user/expediente/:id', passport.authenticate("jwt", { session: false }), expedientePaciente);
router.get('/user/expediente/solicitar/:id', passport.authenticate("jwt", { session: false }), notificacionSolicitud);


/**Notificar reprogramacion */
router.post('/user/notificar', passport.authenticate("jwt", { session: false }), notificar);
router.post('/user/contacto', contacto);

/** Agregar Rating */
router.put('/doctores/comentarios/agregar', passport.authenticate("jwt", { session: false }), nuevoRating);

/** Cambiar/Actualizar Imagen */
router.route('/user/imagen').put(upload.fields([{ name: "foto", maxCount: 1 }]), passport.authenticate("jwt", { session: false }), cambiarImagen);

/**Obtener mi id */
router.post('/me', passport.authenticate("jwt", { session: false }), miId);


export default router;
