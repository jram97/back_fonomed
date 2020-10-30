import { Request, Response } from 'express'
import { sendEmailPago, sendEmailPagoCita,sendEmailPagoCancelar } from '../libs/functions';

import Pago from "../models/pago";
import User from "../models/user";

import { response } from '../libs/functions';

/** PAGOS POR ESTADOS */
export const getAllEstados = async (req: Request, res: Response): Promise<Response> => {
  try {
    const pagos = await Pago.find({ estado: req.query.estados });

    return res.status(201).json(
      response(201, "Ejecutado con exito", true, null, pagos)
    );
  } catch (error) {
    return res.status(404).json(
      response(404, null, false, 'Algo salio mal: ' + error, null)
    );
  }
};

/** PAGOS DOCTOR :: TOKEN */
export const getAllByDoctor = async (req: Request, res: Response): Promise<Response> => {
  try {
    const pagos = await Pago.find({ doctor: req.user["id"] });

    return res.status(201).json(
      response(201, "Ejecutado con exito", true, null, pagos)
    );
  } catch (error) {
    return res.status(404).json(
      response(404, null, false, 'Algo salio mal: ' + error, null)
    );
  }
};

/** PAGOS USER :: TOKEN */
export const getAllByUsuario = async (req: Request, res: Response): Promise<Response> => {
  try {
    const pagos = await Pago.find({ usuario: req.user["id"] });

    return res.status(201).json(
      response(201, "Ejecutado con exito", true, null, pagos)
    );
  } catch (error) {
    return res.status(404).json(
      response(404, null, false, 'Algo salio mal: ' + error, null)
    );
  }
};

/** PAGOS DOCTOR :: ID */
export const getAllByDoctorID = async (req: Request, res: Response): Promise<Response> => {
  try {
    const doctor = await User.findOne({ _id: req.params.id })
    const pagos = await Pago.find({ doctor: doctor._id });

    return res.status(201).json(
      response(201, "Ejecutado con exito", true, null, pagos)
    );
  } catch (error) {
    return res.status(404).json(
      response(404, null, false, 'Algo salio mal: ' + error, null)
    );
  }
};

/** REGISTRO DE PAGOS */
export const nuevo = async (
  req: Request,
  res: Response
): Promise<Response> => {
  if (!req.body) {
    return res
      .status(404)
      .json(response(404, null, false, 'Campos incompletos.', null));
  }
  try {
    const nuevoPago = new Pago(req.body);
    nuevoPago.doctor = req.user['id'];
    await nuevoPago.save();

    if (req.body.servicio === "Premium") {
      if (req.body.tipo == "CLI") {
        const premium = { ...req.user["premium"] };
        premium[`${req.body.doctor}`] = {
          recurrente: req.body.recurrente,
          fecha: new Date()
        }
        console.log("premium", premium)
        await User.findByIdAndUpdate(req.user['id'], {
          tarjeta: req.body.tarjeta,
          premium: premium
        });
      } else if (req.body.tipo == "DOC") {
        await User.findByIdAndUpdate(req.user['id'], {
          tarjeta: req.body.tarjeta,
          premium: {
            recurrente: req.body.recurrente,
            fecha: new Date()
          }
        });
      }
    }

    const user = await User.findById(req.user['id']);

    if(req.body.cita){
      console.log("cita");
      sendEmailPagoCita(user.nombre_completo, user.email);
    }else{
      console.log("no cita");
      sendEmailPago(user.nombre_completo, user.email);
    }

    return res.status(201).json(
      response(201, "Ejecutado con exito", true, null, null)
    );
  } catch (error) {
    return res.status(404).json(
      response(404, null, false, 'Algo salio mal: ' + error, null)
    );
  }
};

/** ACTUALIZACION DE PAGOS :: RECIBE EL ID */
export const actualizar = async (
  req: Request,
  res: Response
): Promise<Response> => {
  if (!req.body || !req.params.id) {
    return res
      .status(404)
      .json(response(404, null, false, 'Campos incompletos o faltan parametros en la URL.', null));
  }
  try {
    await Pago.findByIdAndUpdate(req.params.id, { ...req.body });

    return res.status(201).json(
      response(201, "Ejecutado con exito", true, null, null)
    );
  } catch (error) {
    return res.status(404).json(
      response(404, null, false, 'Algo salio mal: ' + error, null)
    );
  }
};

/** CANCELAR DE PAGOS */
export const cancelar = async (
  req: Request,
  res: Response
): Promise<Response> => {

  try {
    const user = await User.findByIdAndUpdate(req.user['id'], {
      premium: {
        recurrente: false,
        fecha: new Date()
      }
    });

    sendEmailPagoCancelar(user.nombre_completo, user.email);

    return res.status(201).json(
      response(201, "Ejecutado con exito", true, null, null)
    );
  } catch (error) {
    return res.status(404).json(
      response(404, null, false, 'Algo salio mal: ' + error, null)
    );
  }
};

/** ELIMINACION DE PAGOS :: RECIBE EL ID */
export const eliminar = async (
  req: Request,
  res: Response
): Promise<Response> => {
  if (!req.params.id) {
    return res
      .status(404)
      .json(response(404, null, false, 'Faltan parametros en la URL.', null));
  }
  try {
    await Pago.findByIdAndDelete(req.params.id);

    return res.status(201).json(
      response(201, "Ejecutado con exito", true, null, null)
    );
  } catch (error) {
    return res.status(404).json(
      response(404, null, false, 'Algo salio mal: ' + error, null)
    );
  }
};
