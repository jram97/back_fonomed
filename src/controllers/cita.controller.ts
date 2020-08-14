import { Request, Response } from 'express'

import Cita from "../models/cita";
import Horario from "../models/horario";

import { response } from '../libs/functions';

/** CITAS DEL DOCTOR */
export const getAllByDoctor = async (req: Request, res: Response): Promise<Response> => {
  try {
    const citas = await Cita.find({ doctor: req.user["id"] });

    return res.status(200).json(
      response(200, 'Ejecutado con exito', true, null, citas)
    );
  } catch (error) {
    return res.status(404).json(
      response(404, null, false, 'Algo salio mal: ' + error, null)
    );
  }
};

/** CITAS DEL USUARIO */
export const getAllByUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    const citas = await Cita.find({ usuario: req.user["id"] })
      .populate("tarjeta", "numero")
      .populate("medio", "nombre precio")
      .populate("doctor", "nombre_completo email num_votes total_score rating");

    return res.status(200).json(
      response(200, 'Ejecutado con exito', true, null, citas)
    );
  } catch (error) {
    return res.status(404).json(
      response(404, null, false, 'Algo salio mal: ' + error, null)
    );
  }
};

/** REGISTRO DE CITAS */
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
    const days = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];
    const today = new Date(req.body.date);
    const dayName = days[today.getDay()];
    //const time = today.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
    //console.log(today.toLocaleTimeString().replace(/:\d+ /, ' '))

    const horarioFechaDia = await Horario.findOne({ doctor: req.body.doctor, dia: dayName, inicio: req.body.inicio });

    if (!horarioFechaDia) {
      return res
        .status(406)
        .json(response(406, null, false, 'Doctor no tiene esta dia disponible.', null));
    } else {
      const existeCita = await Cita.findOne({ usuario: req.user['id'], doctor: req.body.doctor, dia: dayName, hora: req.body.inicio });
      if (existeCita) {
        if (existeCita.createdAt.getDate() != today.getDate()
          && (existeCita.dia == dayName || existeCita.dia != dayName)
          && (existeCita.inicio == req.body.inicio || existeCita.inicio != req.body.inicio)
          && (existeCita.fin == req.body.fin || existeCita.fin != req.body.fin)
          && (existeCita.doctor == req.body.doctor || existeCita.doctor != req.body.doctor)
          && (existeCita.usuario == req.user['id'] || existeCita.usuario != req.user['id'])
        ) {

          const nuevaCita = new Cita(req.body);
          nuevaCita.dia = dayName;
          nuevaCita.fecha = new Date();
          nuevaCita.usuario = req.user['id'];

          await nuevaCita.save();

          return res.status(201).json(
            response(201, 'Ejecutado con exito', true, null, null)
          );

        } else {
          return res.status(406).json(
            response(406, null, false, 'Cita con este horario ya existe', null)
          );
        }
      } else {
        const nuevaCita = new Cita(req.body);
        nuevaCita.dia = dayName;
        nuevaCita.fecha = new Date();
        nuevaCita.usuario = req.user['id'];

        await nuevaCita.save();
        return res.status(201).json(
          response(201, 'Ejecutado con exito', true, null, null)
        );
      }
    }
  } catch (error) {
    return res.status(404).json(
      response(404, null, false, 'Algo salio mal: ' + error, null)
    );
  }
};

/** ACTUALIZACION DE CITAS :: RECIBE EL ID */
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
    await Cita.findByIdAndUpdate(req.params.id, { ...req.body });

    return res.status(201).json(
      response(201, "Ejecutado con exito", true, null, null)
    );
  } catch (error) {
    return res.status(404).json(
      response(404, null, false, 'Algo salio mal: ' + error, null)
    );
  }
};

/** ELIMINACION DE CITAS :: RECIBE EL ID */
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
    await Cita.findByIdAndDelete(req.params.id);
    return res.status(200).json(
      response(200, "Ejecutado con exito", true, null, null)
    );

  } catch (error) {
    return res.status(404).json(
      response(404, null, false, 'Algo salio mal: ' + error, null)
    );
  }
};
