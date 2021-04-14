import { Router } from "express";
import passport from "passport";

const router = Router();

import { getAllByUsuario, nuevo, eliminar, actualizar, actualizarPredeterminada } from "../controllers/tarjeta.controller";

/** Todos las tarjetas */
router.get("/tarjetas", passport.authenticate("jwt", { session: false }), getAllByUsuario);
/** Registro de tarjetas */
router.post("/tarjetas", passport.authenticate("jwt", { session: false }), nuevo);
/** Update de tarjetas */
router.put("/tarjetas/:id", passport.authenticate("jwt", { session: false }), actualizar);
/** Update de tarjetas predeterminada */
router.put("/tarjetas/predeterminada/:id", passport.authenticate("jwt", { session: false }), actualizarPredeterminada);
/** Eliminar tarjetas */
router.delete("/tarjetas/:id", passport.authenticate("jwt", { session: false }), eliminar);

export default router;
