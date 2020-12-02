import { Router } from "express";
import passport from "passport";
import { bugs } from '../libs/multer'

const router = Router();

import { getAll, nuevo, eliminar, actualizar } from "../controllers/emergencia.controller";

/** Todas los números de emergencia */
router.get("/bugs", passport.authenticate("jwt", { session: false }), getAll);
/** Registro de números de emergencia */
router.route('/bugs').post(bugs.fields([{ name: "fotos", maxCount: 6 }]), passport.authenticate("jwt", { session: false }), nuevo);
/** Update de números de emergencia */
router.route('/bugs/:id').put(bugs.fields([{ name: "fotos", maxCount: 6 }]), passport.authenticate("jwt", { session: false }), actualizar);
/** Eliminar números de emergencia */
router.delete("/bugs/:id", passport.authenticate("jwt", { session: false }), eliminar);

export default router;
