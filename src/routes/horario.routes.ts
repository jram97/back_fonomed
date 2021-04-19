import { Router } from "express";
import passport from "passport";

const router = Router();

import { getAllByDoctor, nuevo, eliminar, actualizar, getAllByDoctorAndDay, getAllByDoctorAndDayID, getAllByDoctorID , eliminarPorDia, getTime} from "../controllers/horario.controller";

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
router.delete("/horario/dia/:dia", passport.authenticate("jwt", { session: false }), eliminarPorDia);
router.delete("/horario/:id", passport.authenticate("jwt", { session: false }), eliminar);

/** Get time for date */
router.get("/horario/time/get-time/:id/:fecha", passport.authenticate("jwt", { session: false }), getTime);

export default router;
