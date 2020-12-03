import { Request, Response } from 'express'

import Especialidad from "../models/especialidad";
import Cita from "../models/cita";
import Horario from "../models/horario";
import Pago from "../models/pago";
import User from "../models/user";
import { sendEmailPagoCita } from '../libs/functions';
import moment, { now } from 'moment';
import cron from 'node-cron';
import { sendNotification } from '../libs/functions'

import { response, verificarCita, verificarHorario, filtrarCitasCaducadas, filtrarCitasHistorial, minutesToHours, hoursToMinutes } from '../libs/functions';
import cita from '../models/cita';
import { update } from './user.controller';

/** CITAS ESTADOS */
export const getAllEstados = async (req: Request, res: Response): Promise<Response> => {
  try {
    const citas = await Cita.find({ estados: req.query.estado });

    return res.status(200).json(
      response(200, 'Ejecutado con exito', true, null, citas)
    );
  } catch (error) {
    return res.status(404).json(
      response(404, null, false, 'Algo salio mal: ' + error, null)
    );
  }
};

/** CITAS DEL DOCTOR */
export const getAllByDoctor = async (req: Request, res: Response): Promise<Response> => {
  try {
    const citas = await Cita.find({ doctor: req.user["id"], cancelado: "Cancelado" })
      .populate("doctor", "nombre_completo email rating foto genero telefono especialidades")
      .populate("medio", "nombre precio")
      .populate("usuario", "nombre_completo email foto genero telefono fecha_nacimiento")
      .sort({ fecha: -1 });;
    var i, j;

    var nuevas = filtrarCitasCaducadas(citas, "estadosDoc"), especialidadPopulada, cita;

    for (i = 0; i < nuevas.length; i++) {
      cita = nuevas[i];
      for (j = 0; j < cita.doctor.especialidades.especialidad.length; j++) {
        especialidadPopulada = await Especialidad.findById(cita.doctor.especialidades.especialidad[j]);
        nuevas[i].doctor.especialidades.especialidad[j] = especialidadPopulada;
      }
    }

    return res.status(200).json(
      response(200, 'Ejecutado con exito', true, null, nuevas)
    );
  } catch (error) {
    return res.status(404).json(
      response(404, null, false, 'Algo salio mal: ' + error, null)
    );
  }
};

/** CITAS DEL DOCTOR */
export const getAllByDoctorHistory = async (req: Request, res: Response): Promise<Response> => {
  try {
    const citas = await Cita.find({ doctor: req.user["id"], cancelado: "Cancelado" })
      .populate("doctor", "nombre_completo email rating foto genero telefono especialidades")
      .populate("medio", "nombre precio")
      .populate("usuario", "nombre_completo email foto genero telefono fecha_nacimiento")
      .sort({ fecha: -1 });;
    var i, j;

    var nuevas = filtrarCitasHistorial(citas, "estadosDoc"), especialidadPopulada, cita;

    for (i = 0; i < nuevas.length; i++) {
      cita = nuevas[i];
      for (j = 0; j < cita.doctor.especialidades.especialidad.length; j++) {
        especialidadPopulada = await Especialidad.findById(cita.doctor.especialidades.especialidad[j]);
        nuevas[i].doctor.especialidades.especialidad[j] = especialidadPopulada;
      }
    }

    return res.status(200).json(
      response(200, 'Ejecutado con exito', true, null, nuevas)
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
    var citas = await Cita.find({ usuario: req.user["id"], cancelado: "Cancelado" })
      .populate("usuario", "nombre_completo foto email")
      .populate("tarjeta", "numero")
      .populate("medio", "nombre precio")
      .populate("doctor", "nombre_completo email num_votes total_score rating foto especialidades")
      .sort({ fecha: -1 });

    var i, j;

    var nuevas = filtrarCitasCaducadas(citas, "estadosCli"), especialidadPopulada, cita;

    for (i = 0; i < nuevas.length; i++) {
      cita = nuevas[i];
      for (j = 0; j < cita.doctor.especialidades.especialidad.length; j++) {
        especialidadPopulada = await Especialidad.findById(cita.doctor.especialidades.especialidad[j]);
        nuevas[i].doctor.especialidades.especialidad[j] = especialidadPopulada;
      }
    }
    /*var diff = 0;
    const fechaServidor = new Date();
    var compare = new Date();
    if (nuevas.length > 0) {
      compare = new Date(nuevas[0].fecha);
      compare.setDate(compare.getDate() + 1);
      //compare.setHours(nuevas[0].fin.split(":")[0], nuevas[0].fin.split(":")[1]);
      //console.log(nuevas[0].fin.split(":")[0]);
      //console.log(compare)
      //var momentNew
      diff = moment.utc().diff(moment(compare).hour(nuevas[0].fin.split(":")[0]).minute(nuevas[0].fin.split(":")[1]), "minutes")
    }*/

    return res.status(200).json(
      response(200, 'Ejecutado con exito', true, null, nuevas)
    );
  } catch (error) {
    return res.status(404).json(
      response(404, null, false, 'Algo salio mal: ' + error, null)
    );
  }
};

/** CITAS DEL USUARIO HISTORIAL*/
export const getAllByUserHistory = async (req: Request, res: Response): Promise<Response> => {
  console.log("historial usuario");
  try {
    var citas = await Cita.find({ usuario: req.user["id"], cancelado: "Cancelado" })
      .populate("usuario", "nombre_completo foto email")
      .populate("tarjeta", "numero")
      .populate("medio", "nombre precio")
      .populate("doctor", "nombre_completo email num_votes total_score rating foto especialidades")
      .sort({ fecha: -1 });

    var i, j;

    var nuevas = filtrarCitasHistorial(citas,"estadosCli"), especialidadPopulada, cita;

    for (i = 0; i < nuevas.length; i++) {
      cita = nuevas[i];
      for (j = 0; j < cita.doctor.especialidades.especialidad.length; j++) {
        especialidadPopulada = await Especialidad.findById(cita.doctor.especialidades.especialidad[j]);
        nuevas[i].doctor.especialidades.especialidad[j] = especialidadPopulada;
      }
    }

    return res.status(200).json(
      response(200, 'Ejecutado con exito', true, null, nuevas)
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
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const today = new Date(req.body.date.split("T")[0]);

    const compare = new Date(req.body.date.split("T")[0]);
    compare.setDate(compare.getDate());
    compare.setHours(req.body.inicio.split(":")[0], req.body.inicio.split(":")[1]);

    const now = new Date();
    console.log(`Hora: ${now.getHours()}:${now.getMinutes()}, y de moment: ${moment(now)}, horas: ${moment(now).hour()}`);

    /*if ((moment(now)).isAfter(moment(compare))) {
      return res
        .status(407)
        .json(response(407, null, false, 'Debes seleccionar una fecha valida.', null));
    }*/
    //QUITAR +1 AL HACER PUSH
    const dayName = days[today.getDay() + 1];
    console.log(dayName, today);
    var existeHorario = false, horarioDisponible = true;
    var horarios;

    const especiales = await Horario.find({ dia: "Especial", fecha: today, doctor: req.body.doctor });

    if (especiales.length > 0) {
      horarios = especiales
    } else {
      horarios = await Horario.find({ doctor: req.body.doctor, dia: dayName });
    }

    if (horarios.length == 0) {
      return res
        .status(406)
        .json(response(406, null, false, 'El doctor no tiene este día disponible.', null));
    }

    var i;
    for (i = 0; i < horarios.length; i++) {
      if (verificarHorario(horarios[i], req.body.inicio, req.body.fin)) {
        existeHorario = true;
        break;
      }
    }

    if (existeHorario) {
      const citas = await Cita.find({ doctor: req.body.doctor, fecha: today, $or: [{ cancelado: "Pendiente" }, { cancelado: "Cancelado" }] });

      for (i = 0; i < citas.length; i++) {
        if (!verificarCita(citas[i], req.body.inicio, req.body.fin)) {
          horarioDisponible = false;
          break;
        }
      }

      if (horarioDisponible) {
        const nuevaCita = new Cita(req.body);
        nuevaCita.dia = dayName;
        nuevaCita.fecha = today;
        nuevaCita.usuario = req.user['id'];

        var citaCreada = await (await nuevaCita.save()).populate("usuario");

        var populadaUsuario = await Cita.populate(citaCreada, { path: "usuario", select: "nombre_completo foto" });

        return res.status(201).json(
          response(201, 'Ejecutado con exito', true, null, await Cita.populate(populadaUsuario, { path: "doctor", select: "nombre_completo rating num_votes foto", populate: { path: "especialidades.especialidad" } }))
        );
      } else {
        return res
          .status(406)
          .json(response(406, null, false, 'Este horario no esta disponible', null));
      }

    } else {
      return res
        .status(406)
        .json(response(406, null, false, 'El doctor no esta disponible en este horario', null));
    }
  } catch (error) {
    return res.status(404).json(
      response(404, null, false, 'Algo salio mal: ' + error, null)
    );
  }
}

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

export const concretar = async (
  req: Request,
  res: Response
): Promise<Response> => {
  if (!req.body || !req.params.id) {
    return res
      .status(404)
      .json(response(404, null, false, 'Campos incompletos o faltan parametros en la URL.', null));
  }

  try {
    if (req.body.reprogramar) {
      const deleted = await Cita.findByIdAndDelete(req.body.reprogramar).populate("usuario").populate("doctor");
      const payload = {
        notification: {
          title: "Reprogramacion cita",
          body: `La cita con el paciente ${deleted.usuario.nombre_completo} ha sido reprogramada`
        }
      }
      sendNotification(deleted.doctor.firebaseTokens, payload);
    }

    if (req.body.cancelado === "Cancelado") {
      const updated = await Cita.findByIdAndUpdate(req.params.id, { cancelado: req.body.cancelado }, { new: true }).populate("doctor").populate("usuario");

      if (updated) {
        const horaFin = updated.fin.split(":");
        var date = updated.fecha;
        date.setDate(date.getDate() + 1);
        const dateOfMonth = date.getDate()
        const month = date.getMonth() + 1;

        const task = cron.schedule(`59 ${horaFin[1]} ${horaFin[0]} ${dateOfMonth} ${month} *`, async () => {
          const citaValidar = await Cita.findById(updated._id).populate("doctor").populate("usuario");
          if (!citaValidar.citaRealizada) {
            const payload = {
              notification: {
                title: "Reprogramacion cita",
                body: `El doctor ${citaValidar.doctor.nombre_completo} no se pudo presentar a la cita. No te preocupes, puedes reprogramarla`
              }
            }
            sendNotification(citaValidar.usuario.firebaseTokens, payload);
            task.stop();
          }
        },
          {
            scheduled: true,
            timezone: "America/Mexico_City"
          });

        console.log("Hora inicio original", updated.inicio);

        var horaNotificacion = minutesToHours(hoursToMinutes(updated.inicio) - 5).split(":");
        console.log("Hora inicio nueva", horaNotificacion);
        const notificarClienteDoctor = cron.schedule(`0 ${horaNotificacion[1]} ${horaNotificacion[0]} ${dateOfMonth} ${month} *`, async () => {
          const cliPayload = {
            notification: {
              title: "Cita",
              body: `En 5 minutos tiene una cita con el doctor ${updated.doctor.nombre_completo}`
            }
          }
          sendNotification(updated.usuario.firebaseTokens, cliPayload);

          const docPayload = {
            notification: {
              title: "Cita",
              body: `En 5 minutos tiene una cita con el paciente ${updated.usuario.nombre_completo}`
            }
          }
          sendNotification(updated.doctor.firebaseTokens, docPayload);

          notificarClienteDoctor.stop();
        },
          {
            scheduled: true,
            timezone: "America/Mexico_City"
          });

        if (!req.body.reprogramar) {
          if (req.body.servicio === "Premium") {
            const user = await User.findByIdAndUpdate(req.user['id'], {
              premium: {
                recurrente: true,
                fecha: new Date()
              }
            });
          }

          const user = await User.findById(req.user['id']);

          sendEmailPagoCita(user.nombre_completo, user.email);

          const nuevoPago = new Pago({
            doctor: updated.doctor,
            usuario: updated.usuario,
            tarjeta: req.body.tarjeta,
            servicio: req.body.servicio,
            code: req.body.code,
            estado: req.body.estado
          });

          await nuevoPago.save();
        }
      }
    } else {
      await Cita.findByIdAndUpdate(req.params.id, { cancelado: req.body.cancelado }, { new: true });
    }

    return res.status(201).json(
      response(201, "Ejecutado con exito", true, null, null)
    );

  } catch (error) {
    return res.status(404).json(
      response(404, null, false, 'Algo salio mal: ' + error, null)
    );
  }
}

export const agregarFactura = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {

    const cita = await Cita.findOne({ _id: req.params.id, doctor: req.user['id'] });

    if (cita) {
      cita.factura = req.file["location"];
      await cita.save()

      return res.status(200).json(
        response(200, "Ejecutado con exito", true, null, req.file["location"]));
    } else {
      return res.status(200).json(
        response(200, null, true, "No existe la cita", null));
    }
  } catch (error) {
    return res.status(404).json(
      response(404, null, false, 'Algo salio mal: ' + error, null));
  }
}

export const agregarReceta = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {

    const cita = await Cita.findOne({ _id: req.params.id, doctor: req.user['id'] });

    if (cita) {
      cita.receta = req.file["location"];
      await cita.save()

      return res.status(200).json(
        response(200, "Ejecutado con exito", true, null, req.file["location"]));
    } else {
      return res.status(200).json(
        response(200, null, true, "No existe la cita", null));
    }
  } catch (error) {
    return res.status(404).json(
      response(404, null, false, 'Algo salio mal: ' + error, null));
  }

}

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
