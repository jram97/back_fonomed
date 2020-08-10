import { Request, Response } from 'express'

import Especialidad from "../models/especialidad";

/** TODAS LAS ESPECIALIDES */
export const getAll = async (req: Request, res: Response): Promise<Response> => {
    const especialidad = await Especialidad.find({});
    return res.json({
        errorCode: "0",
        errorMsg: "Servicio ejecutado con exito.",
        data: especialidad
    });
};

/** REGISTRO DE ESPECIALIDADES */
export const nuevo = async (
    req: Request,
    res: Response
): Promise<Response> => {
    if (!req.body) {
        return res
            .status(400)
            .json({ errorCode: "404", errorMsg: "Completa los campos." });
    }
    const especialidad = await Especialidad.findOne({ nombre: req.body.nombre });
    if (especialidad) {
        return res.status(400).json({ errorCode: "404", errorMsg: "Esta especialidad ya a sido creada." });
    }

    const newEspecialidad = new Especialidad(req.body);
    await newEspecialidad.save();
    return res.status(201).json({
        errorCode: "0",
        errorMsg: "Servicio ejecutado con exito."
    });
};

/** ACTUALIZACION DE ESPECIALIDADES :: RECIBE EL ID */
export const actualizar = async (
    req: Request,
    res: Response
): Promise<Response> => {
    if (!req.body || !req.params.id) {
        return res
            .status(400)
            .json({ errorCode: "404", errorMsg: "Campos incompletos o falta parametros en la URL." });
    }
    const especialidad = await Especialidad.findOne({ nombre: req.body.nombre });
    if (especialidad) {
        return res.status(400).json({ errorCode: "404", errorMsg: "Esta especialidad ya a sido creada." });
    }

    const { nombre } = req.body;
    await Especialidad.findByIdAndUpdate(req.params.id, { nombre });

    return res.status(201).json({
        errorCode: "0",
        errorMsg: "Servicio ejecutado con exito."
    });
};

/** ELIMINACION DE ESPECIALIDADES :: RECIBE EL ID */
export const eliminar = async (
    req: Request,
    res: Response
): Promise<Response> => {
    if (!req.params.id) {
        return res
            .status(400)
            .json({ errorCode: "404", errorMsg: "Faltan parametros en URL." });
    }

    await Especialidad.findByIdAndDelete(req.params.id);
    return res.status(201).json({
        errorCode: "0",
        errorMsg: "Servicio ejecutado con exito."
    });
};