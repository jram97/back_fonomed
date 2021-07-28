import { Router } from "express";

const router = Router();

import { cargarData, responseLogs } from "../controllers/data.controller";
import { generarCodigo, generarCodigoRevision } from "../controllers/code.controller";

router.get("/data", cargarData);

router.get("/codeg", generarCodigo);
router.get("/coder", generarCodigoRevision);

router.post("/logs", responseLogs)



export default router;
//56369037
