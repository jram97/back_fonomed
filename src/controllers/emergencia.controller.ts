import { Request, Response } from 'express'

import Emergencia from "../models/emergencia";

import { response } from "../libs/functions";

/** TODAS LAS EMERGENCIAS */
export const getAll = async (req: Request, res: Response): Promise<Response> => {
  try {
    const emergencias = await Emergencia.find({});
    return res.status(200).json(
      response(200, 'Ejecutado con exito', true, null, emergencias)
    );
  } catch (error) {
    return res.status(404).json(
      response(404, null, false, 'Algo salio mal: ' + error, null)
    );
  }
};

/** REGISTRO DE EMERGENCIAS */
export const nuevo = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    if (!req.body) {
      return res
        .status(400)
        .json(response(404, null, false, 'Campos incompletos.', null));
    }
    if (req.file) {
      const { descripcion } = req.body;
      const emergenciaNew = new Emergencia({ descripcion, foto: req.file.path, usuario: req.user["id"] })
      await emergenciaNew.save();
    } else {
      const { descripcion } = req.body;
      const emergenciaNew = new Emergencia({ descripcion, usuario: req.user["id"] })
      await emergenciaNew.save();
    }
    return res.status(201).json(
      response(201, 'Ejecutado con exito', true, null, null)
    );
  } catch (error) {
    return res.status(404).json(
      response(404, null, false, 'Algo salio mal: ' + error, null)
    );
  }
};

/** ACTUALIZACION DE EMERGENCIA :: RECIBE EL ID */
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
    if (req.file) {
      const { descripcion } = req.body;
      await Emergencia.findByIdAndUpdate(req.params.id, { descripcion, foto: req.file.path });
    } else {
      const { descripcion } = req.body;
      await Emergencia.findByIdAndUpdate(req.params.id, { descripcion });
    }
    return res.status(201).json(
      response(201, 'Ejecutado con exito', true, null, null)
    );
  } catch (error) {
    return res.status(404).json(
      response(404, null, false, 'Algo salio mal: ' + error, null)
    );
  }
};

/** ELIMINACION DE EMERGENCIA :: RECIBE EL ID */
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
    await Emergencia.findByIdAndDelete(req.params.id);

    return res.status(201).json(
      response(201, 'Ejecutado con exito', true, null, null)
    );
  } catch (error) {
    return res.status(404).json(
      response(404, null, false, 'Algo salio mal: ' + error, null)
    );
  }
};
