import { Request, Response } from 'express'

import Cita from "../models/cita";
import User from "../models/user";

import { response } from '../libs/functions';

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