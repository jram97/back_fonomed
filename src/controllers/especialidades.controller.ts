import { Request, Response } from 'express'

import Especialidad from "../models/especialidad";

import { response } from '../libs/functions';

/** TODAS LAS ESPECIALIDES */
export const getAll = async (req: Request, res: Response): Promise<Response> => {
  try {
    const especialidad = await Especialidad.find({});
    return res.status(200).json(
      response(200, 'Ejecutado con exito', true, null, especialidad)
    );
  } catch (error) {
    return res.status(404).json(
      response(404, null, false, 'Algo salio mal: ' + error, null)
    );
  }
};

/** REGISTRO DE ESPECIALIDADES */
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
    const especialidad = await Especialidad.findOne({ nombre: req.body.nombre });
    if (especialidad) {
      return res
        .status(404)
        .json(response(404, null, false, 'Especialidad ya existe.', null));
    }
    const newEspecialidad = new Especialidad(req.body);
    await newEspecialidad.save();
    return res.status(200).json(
      response(200, 'Ejecutado con exito', true, null, null)
    );
  } catch (error) {
    return res.status(404).json(
      response(404, null, false, 'Algo salio mal: ' + error, null)
    );
  }
};

/** ACTUALIZACION DE ESPECIALIDADES :: RECIBE EL ID */
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
    const especialidad = await Especialidad.findOne({ nombre: req.body.nombre });
    if (especialidad) {
      return res.status(400).json({ errorCode: "404", errorMsg: "Esta especialidad ya a sido creada." });
    }
    await Especialidad.findByIdAndUpdate(req.params.id, { ...req.body });
    return res.status(200).json(
      response(200, 'Ejecutado con exito', true, null, null)
    );
  } catch (error) {
    return res.status(404).json(
      response(404, null, false, 'Algo salio mal: ' + error, null)
    );
  }
};

/** ELIMINACION DE ESPECIALIDADES :: RECIBE EL ID */
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
    await Especialidad.findByIdAndDelete(req.params.id);
    return res.status(200).json(
      response(200, 'Ejecutado con exito', true, null, null)
    );
  } catch (error) {
    return res.status(404).json(
      response(404, null, false, 'Algo salio mal: ' + error, null)
    );
  }
};
