import { Router } from "express";
import passport from "passport";

const router = Router();

import { getAllByDoctor, getAllByUser, nuevo, eliminar, actualizar } from "../controllers/cita.controller";

/** Todos los citas */
router.get("/citas", passport.authenticate("jwt", { session: false }), getAllByDoctor);
/** Todos los citas */
router.get("/citas/me", passport.authenticate("jwt", { session: false }), getAllByUser);
/** Registro de citas */
router.post("/citas", passport.authenticate("jwt", { session: false }), nuevo);
//router.post("/citas", nuevo);

/** Update de citas */
router.put("/citas/:id", passport.authenticate("jwt", { session: false }), actualizar);
/** Eliminar citas */
router.delete("/citas/:id", passport.authenticate("jwt", { session: false }), eliminar);

export default router;
