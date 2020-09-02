import { Router } from "express";
import passport from "passport";

const router = Router();

import { getAllByDoctor, getAllByUser, nuevo, eliminar, actualizar, getAllEstados,concretar, getAllByDoctorHistory, getAllByUserHistory  } from "../controllers/cita.controller";

/** Todos los citas */
router.get("/citas", passport.authenticate("jwt", { session: false }), getAllByDoctor);
/** Todos los citas hostorial*/
router.get("/citas/historial", passport.authenticate("jwt", { session: false }), getAllByDoctorHistory);
/** Todos los citas */
router.get("/citas/me", passport.authenticate("jwt", { session: false }), getAllByUser);
/** Todos los citas historial*/
router.get("/citas/me/historial", passport.authenticate("jwt", { session: false }), getAllByUserHistory);
/** Registro de citas */
router.post("/citas", passport.authenticate("jwt", { session: false }), nuevo);
/** Buscar por estado */
router.get("/citas", passport.authenticate("jwt", { session: false }), getAllEstados);

/** Update de citas */
router.put("/citas/:id", passport.authenticate("jwt", { session: false }), actualizar);
/**Actualizar estado de pago de cita */
router.put("/citas/concretar/:id",passport.authenticate("jwt", { session: false }),concretar);
/** Eliminar citas */
router.delete("/citas/:id", passport.authenticate("jwt", { session: false }), eliminar);

export default router;
