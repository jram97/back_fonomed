import { Request, Response } from "express";

import User from "../models/user";
import Rating from "../models/rating";

import { response } from '../libs/functions';
import { deleteArchive } from "../libs/functions";

/** TODOS LOS DOCTORES :: ASC | DESC */
export const getAll = async (
  req: Request,
  res: Response
): Promise<Response> => {

  try {
    const filtro = req.query.filtro || 1;
    const role = req.query.role || "DOC";

    const user = await User.find({ aprobado: true, tipo: role })
      .populate("especialidades.especialidad", "nombre")
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
      );

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
    const user = await User.findOne({ _id: req.user['id'] }).select('premium')

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

    const { especialidad, genero, min = 0, max, calificacion } = req.query;
    const user = await User.find({ tipo: "DOC" }).populate("especialidades.especialidad");
    let data = [];

    user.filter( (x) => {
      if ( x.genero == genero || x.tarifa_g == max || x.especialidades.especialidad[0].nombre === especialidad || x.rating.toFixed() === calificacion ) {
        data.push( x )
      }
    });

    /*
    const users = await User.find({
      genero: { $eq: genero},
      tarifa_g: {
        $gt: min,
        $lt: max
      }
    }).populate({ path: 'especialidades.especialidad', match: { nombre: especialidad } })
    */

    return res.status(200).json(
      response(200, 'Ejecutado con exito', true, null, data)
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

    const userDoctor = await User.findOne({ _id: req.params.id });

    const votes = parseInt(userDoctor.num_votes + 1);
    const tScore = parseInt(userDoctor.total_score + score);
    const nRating =
      parseInt(userDoctor.total_score) / parseInt(userDoctor.num_votes);

    await User.findByIdAndUpdate(userDoctor._id, {
      num_votes: votes,
      total_score: tScore,
      rating: nRating ? nRating : 0,
    });

    return res.status(200).json(
      response(200, 'Ejecutado con exito', true, null, null)
    );
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
