import { Request, Response } from 'express'

import Emergencia from "../models/emergencia";

/** TODAS LAS EMERGENCIAS */
export const getAll = async (req: Request, res: Response): Promise<Response> => {
    const emergencias = await Emergencia.find({});
    return res.json({
        errorCode: "0",
        errorMsg: "Servicio ejecutado con exito.",
        data: emergencias
    });
};

/** REGISTRO DE EMERGENCIAS */
export const nuevo = async (
    req: Request,
    res: Response
): Promise<Response> => {
    if (!req.body) {
        return res
            .status(400)
            .json({ errorCode: "404", errorMsg: "Completa los campos." });
    }

    if (req.file) {
        const { descripcion } = req.body;
        const emergenciaNew = new Emergencia({ descripcion, foto: req.file.path, usuario: req.user["id"]})
        await emergenciaNew.save();
    }else{
        const { descripcion } = req.body;
        const emergenciaNew = new Emergencia({ descripcion, usuario: req.user["id"]})
        await emergenciaNew.save();
    }
    return res.status(201).json({
        errorCode: "0",
        errorMsg: "Servicio ejecutado con exito."
    });
};

/** ACTUALIZACION DE EMERGENCIA :: RECIBE EL ID */
export const actualizar = async (
    req: Request,
    res: Response
): Promise<Response> => {
    if (!req.body || !req.params.id) {
        return res
            .status(400)
            .json({ errorCode: "404", errorMsg: "Campos incompletos o falta parametros en la URL." });
    }

    if (req.file) {
        const { descripcion } = req.body;
        await Emergencia.findByIdAndUpdate(req.params.id, { descripcion, foto: req.file.path });
    }else{
        const { descripcion } = req.body;
        await Emergencia.findByIdAndUpdate(req.params.id, { descripcion });
    }
    
    return res.status(201).json({
        errorCode: "0",
        errorMsg: "Servicio ejecutado con exito."
    });
};

/** ELIMINACION DE EMERGENCIA :: RECIBE EL ID */
export const eliminar = async (
    req: Request,
    res: Response
): Promise<Response> => {
    if (!req.params.id) {
        return res
            .status(400)
            .json({ errorCode: "404", errorMsg: "Faltan parametros en URL." });
    }
    await Emergencia.findByIdAndDelete(req.params.id);

    return res.status(201).json({
        errorCode: "0",
        errorMsg: "Servicio ejecutado con exito."
    });
};