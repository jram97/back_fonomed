import { Router } from "express";
import passport from "passport";

const router = Router();

import { getAllByDoctor, nuevo, eliminar, actualizar, getAllByDoctorID } from "../controllers/medio.controller";

/** Todos los medios */
router.get("/medios", passport.authenticate("jwt", { session: false }), getAllByDoctor);
/** Todos los medios by id */
router.get("/medios/doctor/:id", passport.authenticate("jwt", { session: false }), getAllByDoctorID);
/** Registro de medios */
router.post("/medios", passport.authenticate("jwt", { session: false }), nuevo);
/** Update de medios */
router.put("/medios/:id", passport.authenticate("jwt", { session: false }), actualizar);
/** Eliminar medios */
router.delete("/medios/:id", passport.authenticate("jwt", { session: false }), eliminar);

export default router;
