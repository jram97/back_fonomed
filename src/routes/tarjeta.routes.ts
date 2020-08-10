import { Router } from "express";
import passport from "passport";

const router = Router();

import { getAllByUsuario, nuevo, eliminar, actualizar } from "../controllers/tarjeta.controller";

/** Todos las tarjetas */
router.get("/tarjetas", passport.authenticate("jwt", { session: false }), getAllByUsuario);
/** Registro de tarjetas */
router.post("/tarjetas", passport.authenticate("jwt", { session: false }), nuevo);
/** Update de tarjetas */
router.put("/tarjetas/:id", passport.authenticate("jwt", { session: false }), actualizar);
/** Eliminar tarjetas */
router.delete("/tarjetas/:id", passport.authenticate("jwt", { session: false }), eliminar);

export default router;
