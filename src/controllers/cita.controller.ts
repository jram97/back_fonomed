import { Request, Response } from 'express'

import Especialidad from "../models/especialidad";
import Cita from "../models/cita";
import Horario from "../models/horario";
import Pago from "../models/pago";
import User from "../models/user";
import { sendEmailPago } from '../libs/functions';
import moment, { now } from 'moment';

import { response, verificarCita, verificarHorario, filtrarCitasCaducadas, filtrarCitasHistorial } from '../libs/functions';

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
    const citas = await Cita.find({ doctor: req.user["id"] })
      .populate("doctor", "nombre_completo email foto genero telefono especialidades")
      .populate("medio", "nombre precio")
      .populate("usuario", "nombre_completo email foto genero telefono fecha_nacimiento")
      .sort({ fecha: -1 });;
    var i, j;

    var nuevas = filtrarCitasCaducadas(citas), especialidadPopulada, cita;

    for (i = 0; i < nuevas.length; i++) {
      cita = nuevas[i];
      for (j = 0; j < cita.doctor.especialidades.especialidad.length; j++) {
        especialidadPopulada = await Especialidad.findById(cita.doctor.especialidades.especialidad[0]);
      }
      nuevas[i].doctor.especialidades.especialidad[i] = especialidadPopulada;
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
    const citas = await Cita.find({ doctor: req.user["id"] })
      .populate("doctor", "nombre_completo email foto genero telefono especialidades")
      .populate("medio", "nombre precio")
      .populate("usuario", "nombre_completo email foto genero telefono fecha_nacimiento")
      .sort({ fecha: -1 });;
    var i, j;

    var nuevas = filtrarCitasHistorial(citas), especialidadPopulada, cita;

    for (i = 0; i < nuevas.length; i++) {
      cita = nuevas[i];
      for (j = 0; j < cita.doctor.especialidades.especialidad.length; j++) {
        especialidadPopulada = await Especialidad.findById(cita.doctor.especialidades.especialidad[0]);
      }
      nuevas[i].doctor.especialidades.especialidad[i] = especialidadPopulada;
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
      .populate("doctor", "nombre_completo email num_votes total_score ratin foto especialidades")
      .sort({ fecha: -1 });

    var i, j;

    var nuevas = filtrarCitasCaducadas(citas), especialidadPopulada, cita;

    for (i = 0; i < nuevas.length; i++) {
      cita = nuevas[i];
      for (j = 0; j < cita.doctor.especialidades.especialidad.length; j++) {
        especialidadPopulada = await Especialidad.findById(cita.doctor.especialidades.especialidad[0]);
      }
      nuevas[i].doctor.especialidades.especialidad[i] = especialidadPopulada;
    }

    const fechaServidor = new Date();

    return res.status(200).json(
      response(200, 'Ejecutado con exito', true, { horaCompleta: moment(fechaServidor), numeroHoras: moment(fechaServidor).hour() }, nuevas)
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
      .populate("doctor", "nombre_completo email num_votes total_score ratin foto especialidades")
      .sort({ fecha: -1 });

    var i, j;

    var nuevas = filtrarCitasHistorial(citas), especialidadPopulada, cita;

    for (i = 0; i < nuevas.length; i++) {
      cita = nuevas[i];
      for (j = 0; j < cita.doctor.especialidades.especialidad.length; j++) {
        especialidadPopulada = await Especialidad.findById(cita.doctor.especialidades.especialidad[0]);
      }
      nuevas[i].doctor.especialidades.especialidad[i] = especialidadPopulada;
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

    var now = new Date();

    if ((moment(now)).isAfter(moment(compare))) {
      return res
        .status(407)
        .json(response(407, null, false, 'Debes seleccionar una fecha valida.', null));
    }
    //QUITAR +1 AL HACER PUSH
    const dayName = days[today.getDay()];
    console.log(dayName, today);
    var existeHorario = false, horarioDisponible = true;
    var horarios;

    const especiales = await Horario.find({ dia: "Especial", fecha: today });

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

        const citaCreada = await nuevaCita.save();

        return res.status(201).json(
          response(201, 'Ejecutado con exito', true, null, citaCreada)
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

/** REGISTRO DE CITAS */
/*export const nuevo = async (
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
    const dayName = days[today.getDay() + 1];
    //const time = today.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
    //console.log(today.toLocaleTimeString().replace(/:\d+ /, ' '))

    const horarioFechaDia = await Horario.findOne({ doctor: req.body.doctor, dia: dayName, inicio: req.body.inicio });
    console.log(dayName);

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
          nuevaCita.fecha = today;
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
        nuevaCita.fecha = today;
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
};*/

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
    if (req.body.cancelado === "Cancelado") {
      const updated = await Cita.findByIdAndUpdate(req.params.id, { cancelado: req.body.cancelado }, { new: true });

      if (updated) {
        if (req.body.servicio === "Premium") {
          const user = await User.findByIdAndUpdate(req.user['id'], {
            premium: {
              recurrente: true,
              fecha: new Date()
            }
          });
        }

        const user = await User.findById(req.user['id']);

        sendEmailPago(user.nombre_completo, user.email);

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
      cita.factura = req.file.filename;
      await cita.save()

      return res.status(200).json(
        response(200, "Ejecutado con exito", true, null, req.file.filename));
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
      cita.receta = req.file.filename;
      await cita.save()

      return res.status(200).json(
        response(200, "Ejecutado con exito", true, null, req.file.filename));
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
