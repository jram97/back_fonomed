import { Router } from "express";
import passport from "passport";

const router = Router();

import { getAllByDoctor, nuevo, eliminar, actualizar, getAllByDoctorID, cancelar } from "../controllers/pago.controller";

/** Todos los pagos */
router.get("/pago", passport.authenticate("jwt", { session: false }), getAllByDoctor);
/** Todos los pagos */
router.get("/pago/doctor/:id", passport.authenticate("jwt", { session: false }), getAllByDoctorID);
/** Registro de pagos */
router.post("/pago", passport.authenticate("jwt", { session: false }), nuevo);
/** Update de pagos */
router.put("/pago/:id", passport.authenticate("jwt", { session: false }), actualizar);
/** Cancelar de pagos */
router.put("/pagos/cancelar", passport.authenticate("jwt", { session: false }), cancelar);
/** Eliminar pagos */
router.delete("/pago/:id", passport.authenticate("jwt", { session: false }), eliminar);

export default router;
