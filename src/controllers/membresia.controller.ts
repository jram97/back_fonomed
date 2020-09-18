import { Request, Response } from 'express'

import User from "../models/user";
import Membresia from "../models/membresia";

import { response } from '../libs/functions';

export const nuevaMembresia = async (
    req: Request,
    res: Response
): Promise<Response> => {
    try {
        const user = await User.findById(req.user['id']);
        const doctor = await User.findById(req.body.doctor);
        const membresia = await Membresia.findOne({ usuario: req.user['id'], doctor: req.body.doctor });

        if (!membresia) {
            if (user && doctor) {
                return res.status(200).json(
                    response(200, "ejecutado con exito", false, null, await new Membresia({ doctor: req.body.doctor, usuario: req.user['id'] }).save()));
            } else {
                return res.status(201).json(
                    response(201, null, false, "No existe el doctor o el usuario", null));
            }
        } else {
            return res.status(201).json(
                response(201, null, false, "Ya posees membresia con este doctor", null));
        }
    } catch (error) {
        return res.status(404).json(
            response(404, null, false, 'Algo salio mal: ' + error, null));
    }
}

export const cancelarMembresia = async (
    req: Request,
    res: Response
): Promise<Response> => {
    try {
        const user = await User.findById(req.user['id']);
        const doctor = await User.findById(req.body.doctor);

        if (user && doctor) {
            await Membresia.findOneAndDelete({ doctor: req.body.doctor, usuario: req.user['id'] });
            await User.findByIdAndUpdate(req.user['id'], {
                tarjeta: req.body.tarjeta,
                premium: {
                    recurrente: "null",
                }
            });
            return res.status(200).json(
                response(200, "ejecutado con exito", false, null, null));
        } else {
            return res.status(201).json(
                response(201, null, false, "No existe el doctor o el usuario", null));
        }
    } catch (error) {
        return res.status(404).json(
            response(404, null, false, 'Algo salio mal: ' + error, null));
    }
}

export const verificarMembresia = async (
    req: Request,
    res: Response
): Promise<Response> => {
    try {
        const user = await User.findById(req.user['id']);
        const doctor = await User.findById(req.body.doctor);

        if (user && doctor) {
            const membresia = await Membresia.findOne({ usuario: req.user['id'], doctor: req.body.doctor });
            if (membresia) {
                return res.status(200).json(
                    response(200, "ejecutado con exito", false, null, { status: true }));
            } else {
                return res.status(200).json(
                    response(200, "ejecutado con exito", false, null, { status: false }));
            }
        } else {
            return res.status(201).json(
                response(201, null, false, "No existe el doctor o el usuario", null));
        }
    } catch (error) {
        return res.status(404).json(
            response(404, null, false, 'Algo salio mal: ' + error, null));
    }
}
