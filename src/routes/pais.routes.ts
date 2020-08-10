import { Router } from "express";
import passport from "passport";

const router = Router();

import { getAll, nuevo, eliminar, actualizar } from "../controllers/paises.controller";

/** Todos los pais */
router.get("/pais", getAll);
/** Registro de pais */
router.post("/pais", passport.authenticate("jwt", { session: false }), nuevo);
//router.post("/pais", nuevo);
/** Update de pais */
router.put("/pais/:id", passport.authenticate("jwt", { session: false }), actualizar);
/** Eliminar pais */
router.delete("/pais/:id", passport.authenticate("jwt", { session: false }), eliminar);

export default router;
