import { Router } from "express";
import passport from "passport";
import {factura,receta} from "../libs/multer";

const router = Router();

import { getAllByDoctor, getAllByUser, nuevo, eliminar, actualizar, getAllEstados,concretar, getAllByDoctorHistory, getAllByUserHistory, agregarFactura , agregarReceta } from "../controllers/cita.controller";

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
/** Agregar factura a cita */
router.route("/citas/factura/:id").put(factura.single('foto'),passport.authenticate("jwt", { session: false }),agregarFactura);
/** Agregar receta a cita */
router.route("/citas/receta/:id").put(receta.single('foto'),passport.authenticate("jwt", { session: false }),agregarReceta);
/**Actualizar estado de pago de cita */
router.put("/citas/concretar/:id",passport.authenticate("jwt", { session: false }),concretar);

/** Eliminar citas */
router.delete("/citas/:id", passport.authenticate("jwt", { session: false }), eliminar);

export default router;
