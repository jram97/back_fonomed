import { Request, Response } from "express";

import User from "../models/user";
import Rating from "../models/rating";

import { response } from '../libs/functions';
import { deleteArchive } from "../libs/functions";

import moment, { now } from 'moment';

/** TODOS LOS DOCTORES :: ASC | DESC */
export const getAllActive = async (
  req: Request,
  res: Response
): Promise<Response> => {

  try {
    const filtro = req.query.filtro || 1;
    const role = req.query.role || "DOC";

    const user = await User.find({ aprobado: true, tipo: role })
      .populate("especialidades.especialidad", "nombre")
      .populate("pais")
      .populate("tarjeta")
      .sort({ create_at: filtro });

    var filterUsers = user.filter(u => {
      if (u.premium.recurrente) {
        if (u.premium.fecha) {
          const exp = moment(u.premium.fecha).add(1, 'M');
          if (moment().diff(exp, "minutes") < 0) {
            return u;
          }
        }
      } else {
        if (u.premium.fecha) {
          const exp = moment(u.premium.fecha).add(1, 'M');
          if (moment().diff(exp, "minutes") < 0) {
            return u;
          }
        }
      }
    });

    return res.status(200).json(
      response(200, 'Ejecutado con exito', true, null, filterUsers)
    );
  } catch (error) {
    return res.status(404).json(
      response(404, null, false, 'Algo salio mal: ' + error, null)
    );
  }
};

export const getAll = async (
  req: Request,
  res: Response
): Promise<Response> => {

  try {
    const filtro = req.query.filtro || 1;
    const role = req.query.role || "DOC";

    const user = await User.find({ tipo: role })
      .populate("especialidades.especialidad", "nombre")
      .populate("pais")
      .populate("tarjeta")
      .sort({ create_at: filtro });

    return res.status(200).json(
      response(200, 'Ejecutado con exito', true, null, user)
    );
  } catch (error) {
    return res.status(404).json(
      response(404, null, false, 'Algo salio mal: ' + error, null)
    );
  }
};

/** UN USUARIO :: ID */
export const getById = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const id = req.params.id;

  if (id.length < 24) {
    return res.status(404).json(
      response(404, null, false, 'Faltan parametros en la URL.', null)
    );
  } else {
    try {
      const user = await User.findOne({ _id: id }).populate(
        "especialidades.especialidad",
        "nombre"
      ).populate("pais").populate("tarjeta");

      if (user) {
        return res.status(200).json(
          response(200, 'Ejecutado con exito', true, null, user)
        );
      } else {
        return res.status(404).json(
          response(404, null, false, 'Usuario no existe', null)
        );
      }
    } catch (error) {
      return res.status(404).json(
        response(404, null, false, 'Algo salio mal: ' + error, null)
      );
    }
  }
};

/** USUARIOS :: GET BY TOKEN */
export const getByToken = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const user = await User.findOne({ _id: req.user['id'] }).select('premium tarjeta nombre_completo').populate("pais").populate("tarjeta")


    return res.status(200).json(
      response(200, 'Ejecutado con exito', true, null, user)
    );
  } catch (error) {
    return res.status(404).json(
      response(404, null, false, 'Algo salio mal: ' + error, null)
    );
  }
};

/** USUARIOS SEARCH */
export const getSearch = async (
  req: Request,
  res: Response
): Promise<Response> => {

  try {

    const { especialidad, genero, min, max, calificacion } = req.query;
    let filtro = {};
    let tarifa_g = {}

    if (genero) {
      filtro = { ...filtro, genero }
    }

    if (min) {
      tarifa_g = { $gte: parseInt(min.toString()) };
    }

    if (max) {
      tarifa_g = { ...tarifa_g, $lte: parseInt(max.toString()) };
      filtro = { ...filtro, tarifa_g }
    }

    if (calificacion) {
      filtro = { ...filtro, rating: { $lte: 5, $gte: parseInt(calificacion.toString()) } }
    }

    const user = await User.find({ tipo: "DOC", ...filtro }).populate("especialidades.especialidad").populate("pais").populate("tarjeta");
    let data = user;

    if (especialidad) {
      data = data.filter((x) => {
        var i = 0;
        for (i; i < x.especialidades.especialidad.length; i++) {
          if (x.especialidades.especialidad[i].nombre == especialidad) {
            return x;
            break;
          }
        }
      });
    }

    /*var filterUsers = data.filter(u => {
      if (u.premium.recurrente) {
        return u;
      } else {
        if (u.premium.fecha) {
          const exp = moment(u.premium.fecha).add(1, 'M');
          console.log(moment().diff(exp, "minutes"));
          if (moment().diff(exp, "minutes") < 0) {
            return u;
          }
        }
      }
    });*/

    var filterUsers = data.filter(u => {
      if (u.premium.recurrente) {
        if (u.premium.fecha) {
          const exp = moment(u.premium.fecha).add(1, 'M');
          if (moment().diff(exp, "minutes") < 0) {
            return u;
          }
        }
      } else {
        if (u.premium.fecha) {
          const exp = moment(u.premium.fecha).add(1, 'M');
          if (moment().diff(exp, "minutes") < 0) {
            return u;
          }
        }
      }
    });

    return res.status(200).json(
      response(200, 'Ejecutado con exito', true, null, filterUsers)
    );
  } catch (error) {
    return res.status(404).json(
      response(404, null, false, 'Algo salio mal: ' + error, null)
    );
  }
};

/** USUARIOS :: AGREGAR COMENTARIOS */
export const nuevoRating = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {

    const { score, doctor } = req.body;

    const nuevoRating = new Rating({
      score: score,
      doctor: doctor,
      usuario: req.user["id"],
    });
    await nuevoRating.save();

    const userDoctor = await User.findOne({ _id: doctor });

    if (userDoctor) {
      const votes = parseInt(userDoctor.num_votes + 1);
      const tScore = parseInt(userDoctor.total_score + score);
      const nRating =
        tScore / votes;

      await User.findByIdAndUpdate(userDoctor._id, {
        num_votes: votes,
        total_score: tScore,
        rating: nRating ? nRating : 0,
      });

      return res.status(200).json(
        response(200, 'Ejecutado con exito', true, null, null)
      );
    } else {
      return res.status(200).json(
        response(201, null, true, "No existe ese doctor", null)
      );
    }


  } catch (error) {
    return res.status(404).json(
      response(404, null, false, 'Algo salio mal: ' + error, null)
    );
  }
};

/** USUARIOS :: ELIMINAR */
export const eliminar = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const userDelete = await User.findOne({ _id: req.params.id });

    const { imagen } = userDelete.especialidades;

    deleteArchive(userDelete.foto);
    deleteArchive(userDelete.documento_ui);

    for (let i = 0; i < imagen.length; i++) {
      deleteArchive(imagen[i]);
    }
    await User.findByIdAndDelete(userDelete._id)

    return res.status(200).json(
      response(200, 'Ejecutado con exito', true, null, null)
    );

  } catch (error) {
    return res.status(404).json(
      response(404, null, false, 'Algo salio mal: ' + error, null)
    );
  }
};

/** USUARIOS :: CUENTA PAGADITO */
export const cuentaPagadito = async (
  req: Request,
  res: Response
): Promise<Response> => {

  try {
    await User.findByIdAndUpdate(req.user['id'], { ...req.body })

    return res.status(200).json(
      response(200, 'Ejecutado con exito', true, null, null)
    );
  } catch (error) {
    return res.status(404).json(
      response(404, null, false, 'Algo salio mal: ' + error, null)
    );
  }
};
