import { Request, Response } from 'express'

import Pais from "../models/pais";

/** TODOS LAS PAISES */
export const getAll = async (req: Request, res: Response): Promise<Response> => {
    const paises = await Pais.find({});
    return res.json({
        errorCode: "0",
        errorMsg: "Servicio ejecutado con exito.",
        data: paises
    });
};

/** REGISTRO DE PAISES */
export const nuevo = async (
    req: Request,
    res: Response
): Promise<Response> => {
    if (!req.body) {
        return res
            .status(400)
            .json({ errorCode: "404", errorMsg: "Completa los campos." });
    }
    const paises = await Pais.findOne({ nombre: req.body.nombre });
    if (paises) {
        return res.status(400).json({ errorCode: "404", errorMsg: "Esta pais ya a sido creada." });
    }

    const newpaises = new Pais(req.body);
    await newpaises.save();
    return res.status(201).json({
        errorCode: "0",
        errorMsg: "Servicio ejecutado con exito."
    });
};

/** ACTUALIZACION DE PAISES :: RECIBE EL ID */
export const actualizar = async (
    req: Request,
    res: Response
): Promise<Response> => {
    if (!req.body || !req.params.id) {
        return res
            .status(400)
            .json({ errorCode: "404", errorMsg: "Campos incompletos o falta parametros en la URL." });
    }
    const paises = await Pais.findOne({ nombre: req.body.nombre });
    if (paises) {
        return res.status(400).json({ errorCode: "404", errorMsg: "Esta pais ya a sido creada." });
    }

    const { nombre } = req.body;
    await Pais.findByIdAndUpdate(req.params.id, { nombre });

    return res.status(201).json({
        errorCode: "0",
        errorMsg: "Servicio ejecutado con exito."
    });
};

/** ELIMINACION DE PAISES :: RECIBE EL ID */
export const eliminar = async (
    req: Request,
    res: Response
): Promise<Response> => {
    if (!req.params.id) {
        return res
            .status(400)
            .json({ errorCode: "404", errorMsg: "Faltan parametros en URL." });
    }

    await Pais.findByIdAndDelete(req.params.id);
    return res.status(201).json({
        errorCode: "0",
        errorMsg: "Servicio ejecutado con exito."
    });
};