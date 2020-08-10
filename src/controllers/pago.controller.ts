import { Request, Response } from 'express'
import { sendEmailPago, sendEmailPagoCancelar } from '../libs/functions';

import Pago from "../models/pago";
import User from "../models/user";

export const getAllByDoctor = async (req: Request, res: Response): Promise<Response> => {
    const pagos = await Pago.find({ doctor: req.user["id"] });
    return res.json({
        errorCode: "0",
        errorMsg: "Servicio ejecutado con exito.",
        data: pagos
    });
};

export const getAllByDoctorID = async (req: Request, res: Response): Promise<Response> => {
    const doctor = await User.findOne({ _id: req.params.id })
    const pagos = await Pago.find({ doctor: doctor._id });
    return res.json({
        errorCode: "0",
        errorMsg: "Servicio ejecutado con exito.",
        data: pagos
    });
};

/** REGISTRO DE PAGOS */
export const nuevo = async (
    req: Request,
    res: Response
): Promise<Response> => {
    if (!req.body) {
        return res
            .status(400)
            .json({ errorCode: "404", errorMsg: "Completa los campos." });
    }
    const nuevoPago = new Pago(req.body);
    nuevoPago.doctor = req.user['id']
    await nuevoPago.save();
    const user = await User.findByIdAndUpdate(req.user['id'], {
        premium: {
            recurrente: true,
            fecha: new Date()
        }
    });

    sendEmailPago(user.nombre_completo, user.email);


    return res.status(201).json({
        errorCode: "0",
        errorMsg: "Servicio ejecutado con exito."
    });
};

/** ACTUALIZACION DE PAGOS :: RECIBE EL ID */
export const actualizar = async (
    req: Request,
    res: Response
): Promise<Response> => {
    if (!req.body || !req.params.id) {
        return res
            .status(400)
            .json({ errorCode: "404", errorMsg: "Campos incompletos o falta parametros en la URL." });
    }

    await Pago.findByIdAndUpdate(req.params.id, { ...req.body });

    return res.status(201).json({
        errorCode: "0",
        errorMsg: "Servicio ejecutado con exito."
    });
};

/** CANCELAR DE PAGOS */
export const cancelar = async (
    req: Request,
    res: Response
): Promise<Response> => {

    const user = await User.findByIdAndUpdate(req.user['id'], {
        premium: {
            recurrente: false,
            fecha: new Date()
        }
    });

    sendEmailPagoCancelar(user.nombre_completo, user.email);

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

    await Pago.findByIdAndDelete(req.params.id);
    return res.status(201).json({
        errorCode: "0",
        errorMsg: "Servicio ejecutado con exito."
    });
};