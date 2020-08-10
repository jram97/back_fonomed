import { Request, Response } from 'express'

import Horario from "../models/horario";
import User from "../models/user";

export const getAllByDoctor = async (req: Request, res: Response): Promise<Response> => {
    const horarios = await Horario.find({ doctor: req.user["id"] });
    return res.json({
        errorCode: "0",
        errorMsg: "Servicio ejecutado con exito.",
        data: horarios
    });
};

export const getAllByDoctorAndDay = async (req: Request, res: Response): Promise<Response> => {
    const horarios = await Horario.find({ doctor: req.user["id"], dia: req.params.fecha });

    const horariosFull = horarios.map((horario) => {
        return {
            id: horario._id,
            fecha: horario.fecha,
            entrada: horario.inicio,
            salida: horario.fin,
        }
    })

    return res.json({
        errorCode: "0",
        errorMsg: "Servicio ejecutado con exito.",
        data: horariosFull
    });
};

export const getAllByDoctorID = async (req: Request, res: Response): Promise<Response> => {
    const doctor = await User.findOne({ _id: req.params.id })
    const horarios = await Horario.find({ doctor: doctor._id });
    return res.json({
        errorCode: "0",
        errorMsg: "Servicio ejecutado con exito.",
        data: horarios
    });
};

export const getAllByDoctorAndDayID = async (req: Request, res: Response): Promise<Response> => {
    const doctor = await User.findOne({ _id: req.params.id })
    const horarios = await Horario.find({ doctor: doctor, dia: req.params.fecha });

    const horariosFull = horarios.map((horario) => {
        return {
            id: horario._id,
            fecha: horario.fecha,
            entrada: horario.inicio,
            salida: horario.fin,
        }
    })

    return res.json({
        errorCode: "0",
        errorMsg: "Servicio ejecutado con exito.",
        data: horariosFull
    });
};

/** REGISTRO DE HORARIO */
export const nuevo = async (
    req: Request,
    res: Response
): Promise<Response> => {
    if (!req.body) {
        return res
            .status(400)
            .json({ errorCode: "404", errorMsg: "Completa los campos." });
    }
    const nuevoHorario = new Horario(req.body);
    nuevoHorario.doctor = req.user['id'];
    
    await nuevoHorario.save();
    return res.status(201).json({
        errorCode: "0",
        errorMsg: "Servicio ejecutado con exito."
    });
};

/** ACTUALIZACION DE HORARIO :: RECIBE EL ID */
export const actualizar = async (
    req: Request,
    res: Response
): Promise<Response> => {
    if (!req.body || !req.params.id) {
        return res
            .status(400)
            .json({ errorCode: "404", errorMsg: "Campos incompletos o falta parametros en la URL." });
    }

    await Horario.findByIdAndUpdate(req.params.id, { ...req.body });

    return res.status(201).json({
        errorCode: "0",
        errorMsg: "Servicio ejecutado con exito."
    });
};

/** ELIMINACION DE HORARIO :: RECIBE EL ID */
export const eliminar = async (
    req: Request,
    res: Response
): Promise<Response> => {
    if (!req.params.id) {
        return res
            .status(400)
            .json({ errorCode: "404", errorMsg: "Faltan parametros en URL." });
    }

    await Horario.findByIdAndDelete(req.params.id);
    return res.status(201).json({
        errorCode: "0",
        errorMsg: "Servicio ejecutado con exito."
    });
};