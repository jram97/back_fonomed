import { Request, Response } from 'express'

import Horario from "../models/horario";
import User from "../models/user";
import Cita from "../models/cita";


import { response, getTimeForDate } from '../libs/functions';

/** HORARIO DOCTOR :: TOKEN */
export const getAllByDoctor = async (req: Request, res: Response): Promise<Response> => {
  try {
    const horarios = await Horario.find({ doctor: req.user["id"] });

    return res.status(200).json(
      response(200, 'Ejecutado con exito', true, null, horarios)
    );
  } catch (error) {
    return res.status(404).json(
      response(404, null, false, 'Algo salio mal: ' + error, null)
    );
  }
};

/** HORARIOS DOCTOR :: TOKEN : DIA */
export const getAllByDoctorAndDay = async (req: Request, res: Response): Promise<Response> => {
  try {
    const horarios = await Horario.find({ doctor: req.user["id"], dia: req.params.fecha });

    const horariosFull = horarios.map((horario) => {
      return {
        id: horario._id,
        fecha: horario.fecha,
        entrada: horario.inicio,
        salida: horario.fin,
      }
    })

    return res.status(200).json(
      response(200, 'Ejecutado con exito', true, null, horariosFull)
    );
  } catch (error) {
    return res.status(404).json(
      response(404, null, false, 'Algo salio mal: ' + error, null)
    );
  }
};

/** HORARIOS DOCTOR :: ID */
export const getAllByDoctorID = async (req: Request, res: Response): Promise<Response> => {
  try {
    const doctor = await User.findOne({ _id: req.params.id })
    const horarios = await Horario.find({ doctor: doctor._id });

    return res.status(200).json(
      response(200, 'Ejecutado con exito', true, null, horarios)
    );
  } catch (error) {
    return res.status(404).json(
      response(404, null, false, 'Algo salio mal: ' + error, null)
    );
  }
};

/** HORARIOS DOCTOR :: ID : DIA */
export const getAllByDoctorAndDayID = async (req: Request, res: Response): Promise<Response> => {
  try {
    const doctor = await User.findOne({ _id: req.params.id })
    const horarios = await Horario.find({ doctor: doctor, dia: req.params.fecha });

    const horariosFull = horarios.map((horario) => {
      return {
        id: horario._id,
        fecha: horario.fecha,
        entrada: horario.inicio,
        salida: horario.fin,
      }
    })

    return res.status(200).json(
      response(200, 'Ejecutado con exito', true, null, horariosFull)
    );
  } catch (error) {
    return res.status(404).json(
      response(404, null, false, 'Algo salio mal: ' + error, null)
    );
  }
};

/** REGISTRO DE HORARIO */
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
    var nuevoHorario = new Horario(req.body);
    nuevoHorario.fecha = new Date(req.body.fecha.split("T")[0]);
    nuevoHorario.doctor = req.user['id'];

    await nuevoHorario.save();
    return res.status(201).json(
      response(201, "Ejecutado con exito", true, null, null)
    );
  } catch (error) {
    return res.status(404).json(
      response(404, null, false, 'Algo salio mal: ' + error, null)
    );
  }
};

/** ACTUALIZACION DE HORARIO :: RECIBE EL ID */
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
    await Horario.findByIdAndUpdate(req.params.id, { ...req.body });

    return res.status(201).json(
      response(201, "Ejecutado con exito", true, null, null)
    );
  } catch (error) {
    return res.status(404).json(
      response(404, null, false, 'Algo salio mal: ' + error, null)
    );
  }
};

/** ELIMINACION DE HORARIO :: RECIBE EL ID */
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
    await Horario.findByIdAndDelete(req.params.id);

    return res.status(200).json(
      response(200, "Ejecutado con exito", true, null, null)
    );
  } catch (error) {
    return res.status(404).json(
      response(404, null, false, 'Algo salio mal: ' + error, null)
    );
  }
};

/** Eliminar por dia */

export const eliminarPorDia = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { dia } = req.params
    console.log(req.query.fecha);
    if (req.query.fecha) {
      const fecha = new Date(String(req.query.fecha).split("T")[0]);
      await Horario.deleteMany({ dia: dia, doctor: req.user['id'], fecha: fecha });
    } else {
      await Horario.deleteMany({ dia: dia, doctor: req.user['id'] });
    }
    return res.status(200).json(
      response(200, "Ejecutado con exito", true, null, null)
    );
  } catch (error) {
    return res.status(404).json(
      response(404, null, false, 'Algo salio mal: ' + error, null)
    );
  }
};

/** HORARIO TIME DOCTOR */
export const getTime = async (req: Request, res: Response): Promise<Response> => {

  try {
    const { id } = req.params;
    const citas = await Cita.find({ doctor: id });

    let dates = getTimeForDate();
    let disponibles = [];

    citas.map(hour => {
      dates.filter(cita => {
        if (hour["inicio"] == cita) {
          disponibles.push({ hora: cita, disponible: true })
        } else {
          disponibles.push({ hora: cita, disponible: false })
        }
      })
    })

    return res.status(200).json(
      response(200, 'Ejecutado con exito', true, null, disponibles)
    );
  } catch (error) {
    return res.status(404).json(
      response(404, null, false, 'Algo salio mal: ' + error, null)
    );
  }
  //return res.status(200).json(getTimeForDate());
};