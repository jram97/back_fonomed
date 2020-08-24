import { Request, Response } from 'express'

import Tarjeta from "../models/tarjeta";

import { response } from '../libs/functions'

/** TARJETAS USUARIO :: TOKEN */
export const getAllByUsuario = async (req: Request, res: Response): Promise<Response> => {
  try {
    const tarjeta = await Tarjeta.find({ usuario: req.user["id"] });

    if (!tarjeta) {
      const tarjetas = await Tarjeta.find({ usuario: req.user["id"] }).sort({ ultima_usada: true });

      return res.status(201).json(
        response(201, "Ejecutado con exito", true, null, tarjetas)
      );

    } else {
      return res.status(201).json(
        response(201, "Ejecutado con exito", true, null, tarjeta)
      );
    }
  } catch (error) {
    return res.status(404).json(
      response(404, null, false, 'Algo salio mal: ' + error, null)
    );
  }
};

/** REGISTRO DE TARJETA */
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
    const nuevaTarjeta = new Tarjeta(req.body);
    nuevaTarjeta.usuario = req.user['id']

    await nuevaTarjeta.save();

    return res.status(201).json(
      response(201, "Ejecutado con exito", true, null, nuevaTarjeta)
    );
  } catch (error) {
    return res.status(404).json(
      response(404, null, false, 'Algo salio mal: ' + error, null)
    );
  }
};

/** ACTUALIZACION DE TARJETA :: RECIBE EL ID */
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
    await Tarjeta.findByIdAndUpdate(req.params.id, { ...req.body });

    return res.status(201).json(
      response(201, "Ejecutado con exito", true, null, null)
    );
  } catch (error) {
    return res.status(404).json(
      response(404, null, false, 'Algo salio mal: ' + error, null)
    );
  }
};

/** ELIMINACION DE TARJETA :: RECIBE EL ID */
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
    await Tarjeta.findByIdAndDelete(req.params.id);

    return res.status(200).json(
      response(200, "Ejecutado con exito", true, null, null)
    );
  } catch (error) {
    return res.status(404).json(
      response(404, null, false, 'Algo salio mal: ' + error, null)
    );
  }
};
