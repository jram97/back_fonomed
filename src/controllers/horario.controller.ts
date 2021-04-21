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
    const { id, fecha } = req.params;

    const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

    const dia = new Date(fecha).getDay();

    const horarios = await Horario.find({ doctor: id, dia: dias[dia] });
    const citasDisponibles = await Cita.find({ doctor: id, fecha: new Date(fecha) });

    let dates = getTimeForDate(fecha);
    let disponibles = [];
    let citasDisponiblesArray = [];

    if (horarios) {
      for (let index = 0; index < dates.length; index++) {
        for (let hora = 0; hora < horarios.length; hora++) {
          const element = horarios[hora];
          if (parseFloat(dates[index].replace(":", ".")) >= parseFloat(element.inicio.replace(":", ".")) &&
            parseFloat(dates[index].replace(":", ".")) < parseFloat(element.fin.replace(":", "."))) {
            disponibles.push({ hora: dates[index], fin: (dates[index + 1] != null) ? dates[index + 1] : element.fin, disponible: true })
          }
        }
      }
    }

    for (let hour = 0; hour < citasDisponibles.length; hour++) {
      let hours = citasDisponibles[hour];
      for (let cita = 0; cita < disponibles.length; cita++) {
        let valorEvaluar = disponibles[cita].hora
        if (hours.inicio == disponibles[cita].hora) {
          citasDisponiblesArray.push({ hora: disponibles[cita].hora, fin: (parseFloat(valorEvaluar) <= 12) ? (parseFloat(disponibles[cita + 1].hora) <= 12) ? disponibles[cita + 1].hora : horarios[0]["fin"] : (disponibles[cita + 1] != null) ? disponibles[cita + 1].hora : horarios[1]["fin"], disponible: false })
        } else {
          citasDisponiblesArray.push({ hora: disponibles[cita].hora, fin: (parseFloat(valorEvaluar) <= 12) ? (parseFloat(disponibles[cita + 1].hora) <= 12) ? disponibles[cita + 1].hora : horarios[0]["fin"] : (disponibles[cita + 1] != null) ? disponibles[cita + 1].hora : horarios[1]["fin"], disponible: true })
        }
      }
    }

    let disponiblesDates = []
    let finalDates = []
    for (let index = 0; index < citasDisponiblesArray.length; index++) {
      const element = citasDisponiblesArray[index];
      if(parseFloat(element.hora.replace(":", ",")) <= 12.00){
       finalDates.push({hora: element.hora + " AM", fin: element.fin + " AM", disponible: element.disponible})
     }else{
       finalDates.push({hora: element.hora + " PM", fin: element.fin + " PM", disponible: element.disponible})
     }
    }

    for (let index = 0; index < disponibles.length; index++) {
      const element = disponibles[index];
      if(parseFloat(element.hora.replace(":", ",")) <= 12.00){
        disponiblesDates.push({hora: element.hora + " AM", fin: element.fin + " AM", disponible: element.disponible})
     }else{
        disponiblesDates.push({hora: element.hora + " PM", fin: element.fin + " PM", disponible: element.disponible})
     }
    }

    return res.status(200).json(
      response(200, 'Ejecutado con exito', true, null, ((finalDates.length) ? finalDates : disponiblesDates))
    );
  } catch (error) {
    return res.status(404).json(
      response(404, null, false, 'Algo salio mal: ' + error, null)
    );
  }
  //return res.status(200).json(getTimeForDate());
};