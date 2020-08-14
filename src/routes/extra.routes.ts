import { Router } from "express";

const router = Router();

import { cargarData } from "../controllers/data.controller";
import { generarCodigo, generarCodigoRevision } from "../controllers/code.controller";

router.get("/data", cargarData);

router.get("/codeg", generarCodigo);
router.get("/coder", generarCodigoRevision);



export default router;
//56369037
