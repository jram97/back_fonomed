import { Request, Response } from 'express'

import Tarjeta from "../models/tarjeta";

export const getAllByUsuario = async (req: Request, res: Response): Promise<Response> => {
    const tarjetas = await Tarjeta.find({ usuario: req.user["id"] });

    return res.json({
        errorCode: "0",
        errorMsg: "Servicio ejecutado con exito.",
        data: tarjetas
    });
};

/** REGISTRO DE TARJETA */
export const nuevo = async (
    req: Request,
    res: Response
): Promise<Response> => {
    if (!req.body) {
        return res
            .status(400)
            .json({ errorCode: "404", errorMsg: "Completa los campos." });
    }

    const nuevaTarjeta = new Tarjeta(req.body);
    nuevaTarjeta.usuario = req.user['id']

    await nuevaTarjeta.save();
    return res.status(201).json({
        errorCode: "0",
        errorMsg: "Servicio ejecutado con exito.",
        data: nuevaTarjeta
    });
};

/** ACTUALIZACION DE TARJETA :: RECIBE EL ID */
export const actualizar = async (
    req: Request,
    res: Response
): Promise<Response> => {
    if (!req.body || !req.params.id) {
        return res
            .status(400)
            .json({ errorCode: "404", errorMsg: "Campos incompletos o falta parametros en la URL." });
    }

    await Tarjeta.findByIdAndUpdate(req.params.id, { ...req.body });

    return res.status(201).json({
        errorCode: "0",
        errorMsg: "Servicio ejecutado con exito."
    });
};

/** ELIMINACION DE TARJETA :: RECIBE EL ID */
export const eliminar = async (
    req: Request,
    res: Response
): Promise<Response> => {
    if (!req.params.id) {
        return res
            .status(400)
            .json({ errorCode: "404", errorMsg: "Faltan parametros en URL." });
    }

    await Tarjeta.findByIdAndDelete(req.params.id);
    return res.status(201).json({
        errorCode: "0",
        errorMsg: "Servicio ejecutado con exito."
    });
};