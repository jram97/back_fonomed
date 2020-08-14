import { Router } from "express";
import passport from "passport";
import upload from '../libs/multer'

const router = Router();

import { getAll, nuevo, eliminar, actualizar } from "../controllers/emergencia.controller";

/** Todas los números de emergencia */
router.get("/bugs", passport.authenticate("jwt", { session: false }), getAll);
/** Registro de números de emergencia */
router.route('/bugs').post(upload.single('foto'), passport.authenticate("jwt", { session: false }), nuevo);
/** Update de números de emergencia */
router.route('/bugs/:id').put(upload.single('foto'), passport.authenticate("jwt", { session: false }), actualizar);
/** Eliminar números de emergencia */
router.delete("/bugs/:id", passport.authenticate("jwt", { session: false }), eliminar);

export default router;
