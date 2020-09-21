import { Request, Response } from 'express'

import User from "../models/user";
import Membresia from "../models/membresia";

import { response } from '../libs/functions';

export const nuevaMembresia = async (
    req: Request,
    res: Response
): Promise<Response> => {
    try {
        //console.log(req.user);
        const user = await User.findById(req.user['id']);
        const doctor = await User.findById(req.body.doctor);
        const membresia = await Membresia.findOne({ usuario: req.user['id'], doctor: req.body.doctor, tipo: req.body.tipo });

        if (!membresia) {
            if (user) {
                if (req.user["tipo"] === "CLI") {
                    if (doctor) {
                        return res.status(200).json(
                            response(200, "ejecutado con exito", false, null, await new Membresia({ doctor: req.body.doctor, usuario: req.user['id'], tarjeta: req.body.tarjeta, tipo: req.user['tipo'] }).save()));
                    } else {
                        return res.status(201).json(
                            response(201, null, false, "No existe el doctor", null));
                    }
                } else if (req.user["tipo"] === "DOC") {
                    return res.status(200).json(
                        response(200, "ejecutado con exito", false, null, await new Membresia({ usuario: req.user['id'], tarjeta: req.body.tarjeta, tipo: req.user['tipo'] }).save()));
                }
            } else {
                return res.status(201).json(
                    response(201, null, false, "No existe el usuario", null));
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
        if (user) {
            if (req.user["tipo"] === "CLI") {
                const doctor = await User.findById(req.body.doctor);
                if (doctor) {
                    await Membresia.findOneAndDelete({ usuario: req.user['id'], doctor: req.body.doctor });
                } else {
                    return res.status(201).json(
                        response(201, null, false, "No existe el doctor", null));
                }
            } else if (req.user["tipo"] === "DOC") {
                console.log('doctor');
                await Membresia.findOneAndDelete({ usuario: req.user['id'], tipo: req.user["tipo"]});
            }
            user.premium.recurrente = "null";
            user.save();

            return res.status(200).json(
                response(200, "ejecutado con exito", false, null, null));
        } else {
            return res.status(201).json(
                response(201, null, false, "el usuario", null));
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
            const membresia = await Membresia.findOne({ usuario: req.user['id'], doctor: req.body.doctor }).populate("tarjeta");
            if (membresia) {
                return res.status(200).json(
                    response(200, "ejecutado con exito", false, null, { status: true, premium: user.premium, membresia }));
            } else {
                return res.status(200).json(
                    response(200, "ejecutado con exito", false, null, { status: false, premium: user.premium }));
            }
        } else {
            return res.status(201).json(
                response(404, null, false, "No existe el doctor o el usuario", null));
        }
    } catch (error) {
        return res.status(404).json(
            response(404, null, false, 'Algo salio mal: ' + error, null));
    }
}
