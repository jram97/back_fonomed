import { Request, Response } from 'express'

import Medio from "../models/medios";
import User from "../models/user";

export const getAllByDoctor = async (req: Request, res: Response): Promise<Response> => {
    const medio = await Medio.find({ doctor: req.user["id"] });
    return res.json({
        errorCode: "0",
        errorMsg: "Servicio ejecutado con exito.",
        data: medio
    });
};

export const getAllByDoctorID = async (req: Request, res: Response): Promise<Response> => {
    const doctor = await User.findOne({ _id: req.params.id })
    const medio = await Medio.find({ doctor: doctor._id });
    return res.json({
        errorCode: "0",
        errorMsg: "Servicio ejecutado con exito.",
        data: medio
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

    const existeMedio = await Medio.findOne({ nombre: req.body.nombre });

    if(!existeMedio){
        const nuevoMedio = new Medio({
            nombre: req.body.nombre,
            precio: req.body.precio,
            doctor: req.user['id']
        });
        await nuevoMedio.save();

        const medios = await Medio.find({ doctor: req.user['id'] });
        
        const precios:Array<number> = medios.map( (medio) => {
            return medio.precio
        })
        
        await User.findByIdAndUpdate( req.user['id'], {
            tarifa_g: Math.min(...precios)
        });

        return res.status(201).json({
            errorCode: "0",
            errorMsg: "Servicio ejecutado con exito."
        });
    }else{
        await Medio.findByIdAndUpdate(existeMedio._id, { ...req.body })
        const medios = await Medio.find({ doctor: req.user['id'] });        

        const precios:Array<number> = medios.map( (medio) => {
            return medio.precio
        })

        await User.findByIdAndUpdate( req.user['id'], {
            tarifa_g: Math.min(...precios)
        });

        return res.status(201).json({
            errorCode: "0",
            errorMsg: "Servicio ejecutado con exito."
        });
    }
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

    await Medio.findByIdAndUpdate(req.params.id, { ...req.body });

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

    await Medio.findByIdAndDelete(req.params.id);
    return res.status(201).json({
        errorCode: "0",
        errorMsg: "Servicio ejecutado con exito."
    });
};