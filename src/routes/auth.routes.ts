import { Router } from "express";
import { limitAPI } from '../libs/functions';
import {
  signIn,
  enviarSMS,
  recibirSMS,
  signUp,
  update,
  updateStatus,
  verifySendEmail,
  verifyRecibirEmail,
  cambiarContrasenia,
  verifySendEmailCambioPassword,
  verifyRecibirEmailCambioPassword,
  verificarCorreo
} from "../controllers/user.controller";

import upload from "../libs/multer";

import passport from "passport";

const router = Router();

/** Verificacion ENVIAR SMS */
router.get("/sendverify", enviarSMS);
/** Verificacion RECIBIR SMS */
router.get("/comprobarverify", recibirSMS);
/** Registro :: La foto es opcional */
router.route("/signup").post(
  upload.fields([
    { name: "documentos", maxCount: 3 },
    { name: "foto", maxCount: 1 },
    { name: "dui", maxCount: 1 },
  ]),
  signUp
);
/** Login :: Email & Password */
router.post("/signin", signIn);
/** Update perfil */
router.post("/perfil/update/:id", passport.authenticate("jwt", { session: false }), update);

/** Cambiar estado */
router.put("/perfil/update/status/:id", updateStatus);
/** Enviar email */
router.post("/enviarmail", verifySendEmail);
/** Recibir email */
router.post("/recibirmail", verifyRecibirEmail);
/** Verificar existencia de correo */
router.post("/verificar", verificarCorreo);


/** Cambio de contraseña */
router.put("/cambio-contrasenia", passport.authenticate("jwt", { session: false }), cambiarContrasenia);
/** Enviar email cambio de contraseña */
router.post("/enviarmail/cambiopass", limitAPI, verifySendEmailCambioPassword);
/** Recibir email cambio de contraseña */
router.post("/recibirmail/cambiopass", verifyRecibirEmailCambioPassword);

export default router;
