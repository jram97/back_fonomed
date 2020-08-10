import { Router } from "express";

const router = Router();

import { cargarData } from "../controllers/data.controller";
import { generarCodigo } from "../controllers/code.controller";

router.get("/data", cargarData);
router.get("/codeg", generarCodigo);



export default router;
//56369037