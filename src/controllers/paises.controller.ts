import { Request, Response } from 'express'

import Pais from "../models/pais";

import { response } from '../libs/functions';

/** TODOS LAS PAISES */
export const getAll = async (req: Request, res: Response): Promise<Response> => {
  try {
    const paises = await Pais.find({});

    return res.status(201).json(
      response(201, "Ejecutado con exito", true, null, paises)
    );
  } catch (error) {
    return res.status(404).json(
      response(404, null, false, 'Algo salio mal: ' + error, null)
    );
  }
};

/** REGISTRO DE PAISES */
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
    const paises = await Pais.findOne({ nombre: req.body.nombre });
    if (paises) {
      return res.status(400).json(response(404, null, false, 'Pais ya existe.', null));
    }

    const newpaises = new Pais(req.body);
    await newpaises.save();

    return res.status(201).json(
      response(201, "Ejecutado con exito", true, null, null)
    );
  } catch (error) {
    return res.status(404).json(
      response(404, null, false, 'Algo salio mal: ' + error, null)
    );
  }
};

/** ACTUALIZACION DE PAISES :: RECIBE EL ID */
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
    const paises = await Pais.findOne({ nombre: req.body.nombre });
    if (paises) {
      return res.status(400).json(response(404, null, false, 'Pais ya existe.', null));
    }

    await Pais.findByIdAndUpdate(req.params.id, { ...req.body });

    return res.status(201).json(
      response(201, "Ejecutado con exito", true, null, null)
    );
  } catch (error) {
    return res.status(404).json(
      response(404, null, false, 'Algo salio mal: ' + error, null)
    );
  }
};

/** ELIMINACION DE PAISES :: RECIBE EL ID */
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
    await Pais.findByIdAndDelete(req.params.id);

    return res.status(201).json(
      response(201, "Ejecutado con exito", true, null, null)
    );
  } catch (error) {
    return res.status(404).json(
      response(404, null, false, 'Algo salio mal: ' + error, null)
    );
  }
};
