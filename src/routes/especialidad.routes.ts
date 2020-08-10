import { Router } from "express";
import passport from "passport";

const router = Router();

import { getAll, nuevo, eliminar, actualizar } from "../controllers/especialidades.controller";

/** Todas las especialidades */
router.get("/especialidades", getAll);
/** Registro de especialidad */
router.post("/especialidades", passport.authenticate("jwt", { session: false }), nuevo);
/** Update de especialidad */
router.put("/especialidades/:id", passport.authenticate("jwt", { session: false }), actualizar);
/** Eliminar especialidad */
router.delete("/especialidades/:id", passport.authenticate("jwt", { session: false }), eliminar);

export default router;
