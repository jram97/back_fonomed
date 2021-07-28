import { Request, Response } from 'express'

import User from "../models/user";
import Membresia from "../models/membresia";
import cron from 'node-cron';

import { response } from '../libs/functions';

export const nuevaMembresia = async (
    req: Request,
    res: Response
): Promise<Response> => {
    try {
        //console.log(req.user);
        const user = await User.findById(req.user['id']);
        const membresia = await Membresia.findOne({ usuario: req.user['id'], doctor: req.body.doctor, tipo: req.body.tipo });

        if (!membresia) {
            if (user) {
                if (req.body.tipo === "CLI") {
                    const doctor = await User.findById(req.body.doctor);
                    if (doctor) {
                        const fecha = new Date();
                        //console.log(`${fecha.getSeconds()} ${fecha.getMinutes()} ${fecha.getHours()} ${fecha.getDate()} * *`);
                        const task = cron.schedule(`${fecha.getSeconds()} ${fecha.getMinutes()} ${fecha.getHours()} ${fecha.getDate()} * *`, async () => {
                            const membresia = await Membresia.findOne({ usuario: req.user['id'], doctor: req.body.doctor, tipo: req.body.tipo });

                            if (membresia) {
                                const user = await User.findById(membresia.usuario);
                                //if(user){
                                const premium = { ...user.premium }

                                premium[`${membresia.doctor}`].fecha = new Date();
                                await User.findByIdAndUpdate({ _id: user._id }, { premium: premium })
                                //console.log(newxd.premium);
                                //}
                            } else {
                                task.stop();
                            }
                        },
                            {
                                scheduled: true,
                                timezone: "America/Mexico_City"
                            });

                        return res.status(200).json(
                            response(200, "ejecutado con exito", false, null, await new Membresia({ doctor: req.body.doctor, usuario: req.user['id'], tarjeta_id: req.body.tarjeta_id, tipo: req.body.tipo }).save()));
                    } else {
                        return res.status(201).json(
                            response(201, null, false, "No existe el doctor", null));
                    }
                } else if (req.body.tipo === "DOC") {
                    const fecha = new Date();
                    //console.log(`${fecha.getSeconds()} ${fecha.getMinutes()} ${fecha.getHours()} ${fecha.getDate()} * *`);
                    const task = cron.schedule(`${fecha.getSeconds()} ${fecha.getMinutes()} ${fecha.getHours()} ${fecha.getDate()} * *`, async () => {
                        const membresia = await Membresia.findOne({ usuario: req.user['id'], tipo: req.body.tipo });

                        if (membresia) {
                            const user = await User.findById(membresia.usuario);
                            const premium = { ...user.premium }

                            premium.fecha = new Date();
                            await User.findByIdAndUpdate({ _id: user._id }, { premium: premium })
                            //console.log(user.premium);
                            //}
                        } else {
                            task.stop();
                        }
                    },
                        {
                            scheduled: true,
                            timezone: "America/Mexico_City"
                        });

                    return res.status(200).json(
                        response(200, "ejecutado con exito", false, null, await new Membresia({ usuario: req.user['id'], tarjeta_id: req.body.tarjeta_id, tipo: req.body.tipo }).save()));
                } else {
                    return res.status(201).json(
                        response(404, null, false, "El tipo de usuario es invalido o viene vacio", null));
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
        var user = await User.findById(req.user['id']);
        //console.log(user);
        if (user) {
            if (req.body.tipo == "CLI") {
                const doctor = await User.findById(req.body.doctor);
                if (doctor) {
                    await Membresia.findOneAndDelete({ usuario: req.user['id'], doctor: req.body.doctor });
                    var premium = { ...user.premium }
                    premium[`${req.body.doctor}`].recurrente = false;
                    await User.findOneAndUpdate({ _id: req.user['id'] }, { premium: premium });
                    //await user.save();
                } else {
                    return res.status(201).json(
                        response(201, null, false, "No existe el doctor", null));
                }
            } else if (req.body.tipo == "DOC") {
                //console.log('doctor');
                await Membresia.findOneAndDelete({ usuario: req.user['id'], tipo: req.body.tipo });
                var premium = { ...user.premium };
                premium.recurrente = false;
                await User.findOneAndUpdate({ _id: req.user['id'] }, { premium });
                //await user.save();
            } else {
                return res.status(201).json(
                    response(404, null, false, "El tipo de usuario es invalido o viene vacio", null));
            }

            await user.save();
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
        var membresia;
        if (user) {
            if (req.body.tipo === "CLI") {
                //console.log("cliente");
                membresia = await Membresia.findOne({ usuario: req.user['id'], doctor: req.body.doctor }).populate("tarjeta_id");

                if (membresia) {
                    return res.status(200).json(
                        response(200, "ejecutado con exito", false, null, { status: true, premium: user.premium[`${req.body.doctor}`], membresia }));
                } else {
                    return res.status(200).json(
                        response(200, "ejecutado con exito", false, null, { status: false, premium: user.premium[`${req.body.doctor}`] }));
                }

            } else if (req.body.tipo === "DOC") {
                //console.log("doctor");
                membresia = await Membresia.findOne({ usuario: req.user['id'], tipo: req.body.tipo }).populate("tarjeta_id");

                if (membresia) {
                    return res.status(200).json(
                        response(200, "ejecutado con exito", false, null, { status: true, premium: user.premium, membresia }));
                } else {
                    return res.status(200).json(
                        response(200, "ejecutado con exito", false, null, { status: false, premium: user.premium }));
                }
            } else {
                return res.status(404).json(
                    response(404, null, false, "El tipo de usuario es invalido o viene vacio", null));
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
