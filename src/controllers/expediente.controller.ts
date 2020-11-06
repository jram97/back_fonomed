import { Request, Response } from 'express'

import User from "../models/user";
import Cita from "../models/cita";

import { response, sendNotification } from '../libs/functions';

export const actualizarExpediente = async (
    req: Request,
    res: Response
): Promise<Response> => {
    try {
        const user = await User.findById(req.body.usuario);

        if (user) {
            if (req.body["Enfermedades Diagnosticadas"]) {
                user.expediente["Enfermedades Diagnosticadas"] = user.expediente["Enfermedades Diagnosticadas"].concat(req.body["Enfermedades Diagnosticadas"]);
            }

            if (req.body["Alérgico a"]) {
                user.expediente["Alérgico a"] = user.expediente["Alérgico a"].concat(req.body["Alérgico a"]);
            }

            if (req.body["Medicinas permanentes"]) {
                user.expediente["Medicinas permanentes"] = user.expediente["Medicinas permanentes"].concat(req.body["Medicinas permanentes"]);
            }

            if (req.body["Medicinas recetadas"]) {
                user.expediente["Medicinas recetadas"] = user.expediente["Medicinas recetadas"].concat(req.body["Medicinas recetadas"]);
            }

            await user.save();
            return res.status(200).json(
                response(200, "Ejecutado con exito", true, null, null));
        } else {
            return res.status(200).json(
                response(200, null, true, "No existe el usuario", null));
        }

    } catch (error) {
        return res.status(404).json(
            response(404, null, false, 'Algo salio mal: ' + error, null));
    }
}

export const expedientePaciente = async (
    req: Request,
    res: Response
): Promise<Response> => {
    try {
        const user = await User.findById(req.params.id);

        if (user) {
            return res.status(200).json(
                response(200, "Ejecutado con exito", true, null, user.expediente));
        }

    } catch (error) {
        return res.status(404).json(
            response(404, null, false, 'Algo salio mal: ' + error, null));
    }
}

export const expediente = async (
    req: Request,
    res: Response
): Promise<Response> => {
    try {
        const user = await User.findById(req.user["id"]);

        if (user) {
            return res.status(200).json(
                response(200, "Ejecutado con exito", true, null, user.expediente));
        }

    } catch (error) {
        return res.status(404).json(
            response(404, null, false, 'Algo salio mal: ' + error, null));
    }
}

export const notificacionSolicitud = async (
    req: Request,
    res: Response
): Promise<Response> => {
    try {
        const cita = await Cita.findById(req.params.id).populate("usuario").populate("doctor");

        if (cita) {
            if (cita.cont_shareExp > 0) {
                cita.cont_shareExp = cita.cont_shareExp - 1;
                cita.save();

                const fechaCita = cita.fecha;

                const payload = {
                    notification: {
                        title: "Solicitud de expediente",
                        body: `El doctor ${cita.doctor.nombre_completo} está solicitando que le compartas tu expediente en la cita del ${fechaCita.getDate()}-${fechaCita.getMonth() + 1}-${fechaCita.getFullYear()}. Ve y comparte el expediente desde el detalle de tu cita.`
                    }
                }

                const notificationResponse = await sendNotification(cita.usuario.firebaseTokens, payload);

                if (notificationResponse.successCount >= 1) {
                    return res.status(200).json(
                        response(200, "Solicitud realizada con exito", true, null, null));
                }

            }
        } else {
            return res.status(400).json(
                response(400, "No se ha encontrado la cita", false, null, null));
        }
    } catch (error) {
        return res.status(404).json(
            response(404, null, false, 'Algo salio mal: ' + error, null));
    }
}