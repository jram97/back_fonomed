import { Request, Response } from 'express'

import Medio from "../models/medios";
import User from "../models/user";

import { response } from '../libs/functions';

/** MEDIOS DOCTOR :: TOKEN */
export const getAllByDoctor = async (req: Request, res: Response): Promise<Response> => {
  try {
    const medio = await Medio.find({ doctor: req.user["id"] });

    return res.status(201).json(
      response(201, "Ejecutado con exito", true, null, medio)
    );
  } catch (error) {
    return res.status(404).json(
      response(404, null, false, 'Algo salio mal: ' + error, null)
    );
  }
};

/** MEDIOS DOCTOR :: ID */
export const getAllByDoctorID = async (req: Request, res: Response): Promise<Response> => {
  try {
    const doctor = await User.findOne({ _id: req.params.id })
    const medio = await Medio.find({ doctor: doctor._id });

    return res.status(201).json(
      response(201, "Ejecutado con exito", true, null, medio)
    );
  } catch (error) {
    return res.status(404).json(
      response(404, null, false, 'Algo salio mal: ' + error, null)
    );
  }
};

/** REGISTRO DE MEDIOS */
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
    const existeMedio = await Medio.findOne({ nombre: req.body.nombre });

    if (!existeMedio) {
      const nuevoMedio = new Medio({
        nombre: req.body.nombre,
        precio: req.body.precio,
        doctor: req.user['id']
      });
      await nuevoMedio.save();

      const medios = await Medio.find({ doctor: req.user['id'] });

      const precios: Array<number> = medios.map((medio) => {
        return medio.precio
      })

      await User.findByIdAndUpdate(req.user['id'], {
        tarifa_g: Math.min(...precios)
      });

      return res.status(201).json(
        response(201, "Ejecutado con exito", true, null, null)
      );
    } else {
      await Medio.findByIdAndUpdate(existeMedio._id, { ...req.body })
      const medios = await Medio.find({ doctor: req.user['id'] });

      const precios: Array<number> = medios.map((medio) => {
        return medio.precio
      })

      await User.findByIdAndUpdate(req.user['id'], {
        tarifa_g: Math.min(...precios)
      });

      return res.status(201).json(
        response(201, "Ejecutado con exito", true, null, null)
      );
    }
  } catch (error) {
    return res.status(404).json(
      response(404, null, false, 'Algo salio mal: ' + error, null)
    );
  }
};

/** ACTUALIZACION DE MEDIO :: RECIBE EL ID */
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
    await Medio.findByIdAndUpdate(req.params.id, { ...req.body });

    return res.status(201).json(
      response(201, "Ejecutado con exito", true, null, null)
    );
  } catch (error) {
    return res.status(404).json(
      response(404, null, false, 'Algo salio mal: ' + error, null)
    );
  }
};

/** ELIMINACION DE MEDIOS :: RECIBE EL ID */
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
    await Medio.findByIdAndDelete(req.params.id);

    return res.status(201).json(
      response(201, "Ejecutado con exito", true, null, null)
    );
  } catch (error) {
    return res.status(404).json(
      response(404, null, false, 'Algo salio mal: ' + error, null)
    );
  }
};
