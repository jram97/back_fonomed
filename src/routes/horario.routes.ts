import { Router } from "express";
import passport from "passport";

const router = Router();

import { getAllByDoctor, nuevo, eliminar, actualizar, getAllByDoctorAndDay, getAllByDoctorAndDayID, getAllByDoctorID , eliminarPorDia} from "../controllers/horario.controller";

/** Todos los horarios */
router.get("/horario", passport.authenticate("jwt", { session: false }), getAllByDoctor);
/** Todos los horarios */
router.get("/horario/:fecha", passport.authenticate("jwt", { session: false }), getAllByDoctorAndDay);
/** Todos los horarios */
router.get("/horario/doctor/:id", passport.authenticate("jwt", { session: false }), getAllByDoctorID);
/** Todos los horarios */
router.get("/horario/doctor/fecha/:fecha", passport.authenticate("jwt", { session: false }), getAllByDoctorAndDayID);
/** Registro de horarios */
router.post("/horario", passport.authenticate("jwt", { session: false }), nuevo);
/** Update de horarios */
router.put("/horario/:id", passport.authenticate("jwt", { session: false }), actualizar);
/** Eliminar horarios */
router.delete("/horario/dia", passport.authenticate("jwt", { session: false }), eliminarPorDia);
router.delete("/horario/:id", passport.authenticate("jwt", { session: false }), eliminar);

export default router;
