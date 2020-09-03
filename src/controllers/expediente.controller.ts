import { Request, Response } from 'express'

import Cita from "../models/cita";
import User from "../models/user";

import { response } from '../libs/functions';

export const actualizarExpediente = async (
    req: Request,
    res: Response
): Promise<Response> => {
    try {
        const prueba = {
            "hola": ["Hola1", "adios"]
        }

        return res.status(200).json(
            response(200, "Ejecutado con exito", true, null, prueba));
    } catch (error) {
        return res.status(404).json(
            response(404, null, false, 'Algo salio mal: ' + error, null));
    }
}