import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import config from "../config/config";
import twilio from "../config/twilio";
import { response, sendEmail, generateCode, sendEmailCambioPassword, verificarCita, minutesToHours, hoursToMinutes } from "../libs/functions";

import User, { IUser } from "../models/user";
import Cita from '../models/cita';
import Horario from '../models/horario';
import Verify from "../models/verify";
import { sendNotification, correoContacto } from '../libs/functions'
import moment, { now } from 'moment';

const AccessToken = require('twilio').jwt.AccessToken;
const VideoGrant = AccessToken.VideoGrant;

const client = require('twilio')(twilio.accountSID, twilio.authToken);

/** GENERACION DE TOKEN CON JWT */
function createToken(user: IUser) {
  return jwt.sign({ id: user.id, email: user.email }, config.jwtSecret, {
    expiresIn: "365d",
  });
}

async function createNewPassword(password: string) {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  return hash;
}

/** SEND TOKEN / VIDEOCALL / CALL :: NOMBRE */
export const sendTokenForCall = async (
  req: Request,
  res: Response
): Promise<Response> => {

  if (!req.query || !req.query.userName) {
    return res
      .status(404)
      .json(response(404, null, false, 'Faltan parametros en la URL.', null));
  }
  try {
    const ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID_VIDEOCALL;
    const API_KEY_SID = process.env.TWILIO_API_KEY_SID_VIDEOCALL;
    const API_KEY_SECRET = process.env.TWILIO_API_KEY_SECRET_VIDEOCALL;

    let accessToken = new AccessToken(
      API_KEY_SID,
      ACCOUNT_SID,
      API_KEY_SECRET,
    );

    accessToken.identity = req.query.userName;
    accessToken.signature = config.jwtSecret

    const grant = new VideoGrant({
      room: req.query.nameRoom,
    });

    accessToken.addGrant(grant);

    const jwt = accessToken.toJwt();

    return res.status(201).json(
      response(201, "Ejecutado con exito", true, null, { jwt: jwt, who: req.query.userName })
    );
  } catch (error) {
    return res.status(404).json(
      response(404, null, false, 'Algo salio mal: ' + error, null)
    );
  }
};

/** CAMBIAR CONTRASEÑA */
export const cambiarContrasenia = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { password, r_password } = req.body;

    if (password == r_password) {
      const user = await User.findOne({ email: req.user["email"] });
      if (user) {
        await User.findByIdAndUpdate(user._id, {
          password: await createNewPassword(password),
        });

        return res.status(201).json(
          response(201, "Contrasena fue actualizada", true, null, null)
        );
      } else {
        return res.status(404).json(
          response(404, null, false, 'Algo salio mal', null)
        );
      }
    } else {
      return res.status(404).json(
        response(404, null, false, 'No son iguales', null)
      );
    }
  } catch (error) {
    return res.status(404).json(
      response(404, null, false, 'Algo salio mal: ' + error, null)
    );
  }
};

/** VERIFICAR CORREO */
export const verificarCorreo = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { correo } = req.body;

    const user = await User.findOne({ email: correo });

    if (user) {
      return res.status(404).json(
        response(404, "Correo ya en uso", true, null, null)
      );
    } else {
      return res.status(200).json(
        response(200, "Correo disponible", true, null, null)
      );
    }
  } catch (error) {
    return res.status(404).json(
      response(404, null, false, 'Algo salio mal: ' + error, null)
    );
  }
};

/** RECIBIR EMAIL :: EMAIL, CODE */
export const verifyRecibirEmail = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { code, email } = req.body;

    const verify = await Verify.findOne({ code: code, email: email });
    if (verify) {
      await Verify.findByIdAndDelete(verify._id);

      return res.status(201).json(
        response(201, "Codigo valido", true, null, null)
      );
    } else {
      return res.status(404).json(
        response(404, null, false, 'Codigo no valido', null)
      );
    }

  } catch (error) {
    return res.status(404).json(
      response(404, null, false, 'Algo salio mal: ' + error, null)
    );
  }
};

/** SEND EMAIL :: NOMBRE, EMAIL */
export const verifySendEmail = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { nombre, email } = req.body;

    const verify = await Verify.findOne({ email: email });
    if (verify) {
      sendEmail(verify.nombre, verify.email, verify.code);
      return res.status(201).json(
        response(201, "Se ha enviado el codigo a tu correo", true, null, null)
      );
    } else {
      let code = generateCode();
      sendEmail(nombre, email, code);
      //console.log(`Correo enviado a ${email}`);
      const newVerify = new Verify({ nombre, email, code });
      await newVerify.save();
      return res.status(201).json(
        response(201, "Se ha enviado el codigo a tu correo", true, null, null)
      );
    }
  } catch (error) {
    return res.status(404).json(
      response(404, null, false, 'Algo salio mal: ' + error, null)
    );
  }
};

/** VERIFICACION SEND SMS */
export const enviarSMS = async (req: Request, res: Response): Promise<Response> => {
  return await client.verify
    .services(twilio.serviceSID)
    .verifications.create({ to: `+${req.query.to}`, channel: 'sms' })
    .then((data: any) => {
      //console.log(`Mensaje enviado a ${req.query.to}`);
      return res.status(201).json(
        response(201, "Se a enviado el codigo al telefono: " + req.query.to, true, null, data)
      );
    })
    .catch((err: any) => {
      return res.status(404).json(
        response(404, null, false, 'No se pudo enviar el mensaje: ' + err, req.query.to)
      );
    });
};

/** VERIFICACION RECIBIR SMS */
export const recibirSMS = async (req: Request, res: Response) => {
  client.verify
    .services(twilio.serviceSID)
    .verificationChecks.create({
      to: `+${req.query.phonenumber}`,
      code: req.query.code,
    })
    .then((data: any) => {
      if (data.status === "approved") {
        //console.log(`Codigo valido, telefono: ${req.query.phonenumber}`);
        return res.status(201).json(
          response(201, "Codigo valido", true, null, data)
        );
      } else {
        return res.status(404).json(
          response(404, null, false, 'Codigo no valido', data)
        );
      }
    });
};

/** REGISTRO DE USUARIOS */
export const signUp = async (
  req: Request,
  res: Response
): Promise<Response> => {
  /** Campos requeridos */
  if (!req.body.email || !req.body.password) {
    return res
      .status(404)
      .json(response(404, null, false, 'Campos incompletos.', null));
  }

  /** Constrasenas iguales */
  if (!req.body.password || !req.body.r_password) {
    return res
      .status(404)
      .json(response(404, null, false, 'Contrasenas no son iguales.', null));
  }

  try {
    /** Existencia de usuario */
    const user = await User.findOne({ email: req.body.email });
    if (user)
      return res
        .status(400)
        .json(response(400, null, false, 'Cuenta ya existe.', null));

    /** Validacion (foto) y persistir */
    if (req.files["foto"] && req.files["dui"]) {
      if (req.files["documentos"]) {
        let element = [];
        for (let index = 0; index < req.files["documentos"].length; index++) {
          element.push(req.files["documentos"][index]["location"]);
        }
        const newUser = new User(req.body);
        newUser.documento_ui = req.files["dui"][0]["location"]
        newUser.foto = req.files["foto"][0]["location"]
        newUser.especialidades = { especialidad: req.body.especialidad, imagen: element };

        const userNew = await newUser.save();
        return res.status(201).json(
          response(201, "Ejecutado con exito", true, null, userNew)
        );
      } else {
        const newUser = new User(req.body);
        newUser.documento_ui = req.files["dui"][0]["location"]
        newUser.foto = req.files["foto"][0]["location"]

        const userNew = await newUser.save();
        return res.status(201).json(
          response(201, "Ejecutado con exito", true, null, userNew)
        );
      }
    } else {
      if (req.files["documentos"]) {
        let element = [];
        for (let index = 0; index < req.files["documentos"].length; index++) {
          element.push(req.files["documentos"][index]["location"]);
        }
        const newUser = new User(req.body);
        newUser.especialidades = { especialidad: req.body.especialidad, imagen: element };
        newUser.foto = `https://ui-avatars.com/api/?name=${req.body.nombre_completo}`;

        const userNew = await newUser.save();
        return res.status(201).json(
          response(201, "Ejecutado con exito", true, null, userNew)
        );
      } else {
        const newUser = new User(req.body);
        newUser.foto = `https://ui-avatars.com/api/?name=${req.body.nombre_completo}`;

        const userNew = await newUser.save();
        return res.status(201).json(
          response(201, "Ejecutado con exito", true, null, userNew)
        );
      }
    }

  } catch (error) {
    return res.status(404).json(
      response(404, null, false, 'Algo salio mal: ' + error, null)
    );
  }
};

/** CAMBIO DE IMAGEN EN USUARIOS */
export const cambiarImagen = async (
  req: Request,
  res: Response
): Promise<Response> => {

  //console.log(req.files)
  try {
    if (req.files["foto"]) {
      let url = req.files["foto"][0]["location"];
      await User.findByIdAndUpdate(req.user['id'], { foto: url });
      return res.status(201).json(
        response(201, "Se cambio la imagen", true, null, url)
      );
    } else {
      return res.status(201).json(
        response(201, "No existe ninguna imagen", true, null, null)
      );
    }
  } catch (error) {
    return res.status(404).json(
      response(404, null, false, 'Algo salio mal: ' + error, null)
    );
  }
};

/** ACTUALIZAR PERFIL :: ENVIAR ID POR URL */
export const update = async (
  req: Request,
  res: Response
): Promise<Response> => {

  try {
    /** Existencia de usuario */
    const user = await User.findById({ _id: req.params.id });
    if (!user)
      return res.status(404).json(response(404, null, false, 'Codigo del usuario no existe.', null));

    const updateUser = await User.findByIdAndUpdate(req.params.id, { ...req.body });
    return res.status(201).json(
      response(201, "Ejecutado con exito", true, null, updateUser)
    );

  } catch (error) {
    return res.status(404).json(
      response(404, null, false, 'Algo salio mal: ' + error, null)
    );
  }
};

/** ACTUALIZAR ESTADO :: ENVIAR ID POR URL */
export const updateStatus = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    /** Existencia de usuario */
    const user = await User.findById({ _id: req.params.id });
    if (!user) {
      return res.status(404).json(response(404, null, false, 'Codigo del usuario no existe.', null));
    }
    /** Recepcion de datos */
    const { aprobado } = req.body;
    /** Persistir (Update) */
    const updateUser = await User.findByIdAndUpdate(req.params.id, { aprobado });
    return res.status(201).json(
      response(201, "Ejecutado con exito", true, null, updateUser)
    );

  } catch (error) {
    return res.status(404).json(
      response(404, null, false, 'Algo salio mal: ' + error, null)
    );
  }
};

/** LOGIN :: EMAIL Y PASSWORD */
export const signIn = async (
  req: Request,
  res: Response
): Promise<Response> => {
  /** Campos requeridos */
  if (!req.body.email || !req.body.password) {
    return res
      .status(404)
      .json(response(404, null, false, 'Campos incompletos.', null));
  }
  try {
    /** Existencia de usuario */
    const user = await User.findOne({ email: req.body.email, aprobado: true }).populate("especialidades.especialidad", "nombre").populate("pais").populate("tarjeta");
    if (!user) {
      return res.status(404).json(
        response(404, null, false, 'Correo no esta asociado a ninguna cuenta.', null)
      );
    }
    /** Match de contrasena, validacion de Bcrypt */
    const isMatch = await user.comparePassword(req.body.password);
    if (isMatch) {
      user.estado = true;
      await user.save();
      return res.status(201).json(
        response(201, "Ejecutado con exito", true, null, {
          id: user._id,
          email: user.email,
          nombre: user.nombre_completo,
          genero: user.genero || null,
          fecNac: user.fecha_nacimiento || null,
          pagadito: user.cuenta_pagadito || null,
          foto: user.foto,
          pais: user.pais || null,
          tarjeta: user.tarjeta || null,
          especialidades: user.especialidades,
          rating: user.rating,
          nVotos: user.num_votes,
          telefono: user.telefono,
          premium: user.premium,
          estado: user.estado,
          informacion_pago: {
            direccion: user.direccion || null,
            codigo_postal: user.codigo_postal || null,
            ciudad: user.ciudad || null
          },
          role: user.tipo,
          token: createToken(user),
        })
      );
    } else {
      return res.status(404).json(
        response(404, null, false, 'El correo o contrasena es incorrecto.', null)
      );
    }
  } catch (error) {
    return res.status(404).json(
      response(404, null, false, 'Algo salio mal: ' + error, null)
    );
  }
};

export const doctorDisponible = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const doctores = await User.find({ tipo: "DOC", estado: true }).populate("especialidades.especialidad");
    const rechazaron = req.body.doctores
    let data = doctores;

    data = data.filter((x, index) => {
      var i;
      //console.log("Doctor", index);
      for (i = 0; i < x.especialidades.especialidad.length; i++) {
        if (x.especialidades.especialidad[i].nombre.includes("Medicina General")) {
          return x;
        }
      }
    });

    data = data.filter(u => {
      if (u.premium.recurrente) {
        if (u.premium.fecha) {
          const exp = moment(u.premium.fecha).add(1, 'M');
          //console.log(exp, u.premium.fecha);
          // console.log(moment().diff(exp, "minutes"));
          if (moment().diff(exp, "minutes") < 0) {
            return u;
          }
        }
      } else {
        if (u.premium.fecha) {
          const exp = moment(u.premium.fecha).add(1, 'M');
          //console.log(exp, u.premium.fecha);
          //console.log(moment().diff(exp, "minutes"));
          if (moment().diff(exp, "minutes") < 0) {
            return u;
          }
        }
      }
    });

    if (data.length < 1) {
      return res.status(400).json(
        response(400, "No se encontro doctor disponible", true, null, null)
      );
    }

    var retornar = false, horarioDisponible = true, numeroDoctor, citasDoctor, date = new Date(), dayName, i;
    date = new Date(`${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`);

    dayName = days[date.getDate() + 1]

    while (!retornar) {
      horarioDisponible = true
      numeroDoctor = Math.floor(Math.random() * data.length);

      if (!rechazaron.includes(String(data[numeroDoctor]._id))) {

        citasDoctor = await Cita.find({ doctor: data[numeroDoctor]._id, fecha: date, $or: [{ cancelado: "Pendiente" }, { cancelado: "Cancelado" }] });
        const inicio = `${(new Date()).getHours()}:${(new Date).getMinutes()}`;
        const fin = minutesToHours(hoursToMinutes(inicio) + 15);

        for (i = 0; i < citasDoctor.length; i++) {
          if (!verificarCita(citasDoctor[i], inicio, fin)) {
            horarioDisponible = false;
            break;
          }
        }

        if (horarioDisponible) {
          retornar = true;
        }
      }
    }

    return res.status(201).json(
      response(201, "Ejecutado con exito", true, null, data[numeroDoctor])
    );


  } catch (error) {
    return res.status(404).json(
      response(404, null, false, 'Algo salio mal: ' + error, null)
    );
  }
};


/** RECIBIR EMAIL :: EMAIL, CODE */
export const verifyRecibirEmailCambioPassword = async (
  req: Request,
  res: Response
): Promise<Response> => {

  try {
    const { code, email, password, r_password } = req.body;

    const verify = await Verify.findOne({ code: code, email: email });
    if (verify) {
      await Verify.findByIdAndDelete(verify._id);

      if (password == r_password) {
        const user = await User.findOne({ email: email });
        if (user) {
          await User.findByIdAndUpdate(user._id, {
            password: await createNewPassword(password),
          });

          return res.status(201).json(
            response(201, "Contrasena fue actualizada", true, null, null)
          );
        } else {
          return res.status(404).json(
            response(404, null, false, 'Algo salio mal', null)
          );
        }
      } else {
        return res.status(404).json(
          response(404, null, false, 'No son iguales', null)
        );
      }

      /*return res.status(201).json(
        response(201, "Codigo valido", true, null, null)
      );*/
    } else {
      return res.status(404).json(
        response(404, null, false, 'Codigo no valido.', null)
      );
    }
  } catch (error) {
    return res.status(404).json(
      response(404, null, false, 'Algo salio mal: ' + error, null)
    );
  }
};

/** SEND EMAIL :: NOMBRE, EMAIL */
export const verifySendEmailCambioPassword = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { email } = req.body;

    const userExists = await User.findOne({ email: email });
    const verify = await Verify.findOne({ email: email });

    if (userExists) {
      if (verify) {
        await Verify.findByIdAndRemove(verify._id);
      }

      let code = generateCode();
      const newVerify = new Verify({ nombre: userExists.nombre_completo, email, code });
      sendEmailCambioPassword(userExists.nombre_completo, email, code);
      //console.log(`Correo enviado a ${email}`);
      await newVerify.save();

      return res.status(201).json(
        response(201, "El codigo ha sido enviado", true, null, null)
      );
    } else {
      return res.status(404).json(
        response(404, null, false, 'Usuario no existe.', null)
      );
    }

  } catch (error) {
    return res.status(404).json(
      response(404, null, false, 'Algo salio mal: ' + error, null)
    );
  }
};

/** Update user por su ID */
export const updateUserById = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    await User.findByIdAndUpdate(req.body.id, { ...req.body })

    return res.status(200).json(
      response(200, 'Ejecutado con exito', true, null, null)
    );
  } catch (error) {
    return res.status(404).json(
      response(404, null, false, 'Algo salio mal: ' + error, null)
    );
  }
};

/** Agregar token firebase */
export const agregarTokenFirebase = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const user = await User.findById(req.user['id']);

    if (user) {
      if (req.body.firebaseToken) {
        if (!user.firebaseTokens.includes(req.body.firebaseToken)) {
          user.firebaseTokens.push(req.body.firebaseToken);
          await user.save();
          return res.status(201).json(
            response(201, "Token agregado con exito", true, null, null)
          );
        } else {
          return res.status(201).json(
            response(201, "Token ya existente", true, null, null)
          );
        }
      } else {
        return res.status(404).json(
          response(404, null, false, 'El token viene vacio', null)
        );
      }
    } else {
      return res.status(404).json(
        response(404, null, false, 'Usuario no existe.', null)
      );
    }
  } catch (error) {
    return res.status(404).json(
      response(404, null, false, 'Algo salio mal: ' + error, null)
    );
  }
};

export const eliminarTokenFirebase = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const user = await User.findById(req.user['id']);

    if (user) {
      if (req.body.firebaseToken) {
        const index = user.firebaseTokens.indexOf(req.body.firebaseToken);
        if (index > -1) {
          user.firebaseTokens.splice(index, 1);
          //user.estado = false;
        }

        if (user.firebaseTokens.length == 0) {
          user.estado = false;
        }
        const updated = await user.save();
        if (!updated) {
          return res.status(201).json(
            response(406, "No se ha podido eliminar", false, null, null)
          );
        }
        return res.status(201).json(
          response(201, "Token eliminado con exito", true, null, null)
        );
      } else {
        return res.status(404).json(
          response(404, null, false, 'El token viene vacio', null)
        );
      }
    } else {
      return res.status(404).json(
        response(404, null, false, 'Usuario no existe.', null)
      );
    }
  } catch (error) {
    return res.status(404).json(
      response(404, null, false, 'Algo salio mal: ' + error, null)
    );
  }
};

export const notificar = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { userId, payload } = req.body

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json(
        response(404, null, false, 'Usuario no existe.', null)
      );
    }

    if (user.firebaseTokens.length == 0) {
      return res.status(401).json(
        response(401, null, false, 'El usuario no tiene dispositivos registrados', null)
      );
    }


    /*const payload = {
      notification: {
        title: "Prueba",
        body: "Esta notificacion viene desde el server"
      }
    }*/
    const responseNotification = await sendNotification(user.firebaseTokens, payload);

    return res.status(201).json(
      response(201, "Notificacion enviada con exito", true, null, responseNotification.results)
    );

  } catch (error) {
    return res.status(404).json(
      response(404, null, false, 'Algo salio mal: ' + error, null)
    );
  }
};

export const removeAllFirebaseTokens = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {

    const users = await User.find({});

    users.forEach(async function (user) {
      user.firebaseTokens = [];
      await user.save();
    });

    return res.status(201).json(
      response(201, "Tokens eliminados", true, null, null)
    );
  } catch (error) {
    return res.status(404).json(
      response(404, null, false, 'Algo salio mal: ' + error, null)
    );
  }
};

export const contacto = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { nombre, telefono, email, pais, mensaje } = req.body;

    const camposCorreo = { nombre, telefono, email, pais, mensaje };

    correoContacto(camposCorreo);

    return res.status(201).json(
      response(201, "Correo enviado con exito", true, null, null)
    );
  } catch (error) {
    return res.status(404).json(
      response(404, null, false, 'Algo salio mal: ' + error, null)
    );
  }
};

export const quitarRecurrentes = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const users = await User.find({ tipo: "DOC" });
    var i;

    users.forEach(async u => {
      var nuevo = u.premium;
      nuevo.recurrente = false;
      await User.findByIdAndUpdate(u._id, { premium: nuevo });
    });

    return res.status(201).json(
      response(201, "Exito", true, null, null)
    );
  } catch (error) {
    return res.status(404).json(
      response(404, null, false, 'Algo salio mal: ' + error, null)
    );
  }
};

export const cambiarEstadoDoctores = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const users = await User.find({ tipo: "DOC" });
    var i;

    users.forEach(async u => {
      await User.findByIdAndUpdate(u._id, { estado: true });
    });

    return res.status(201).json(
      response(201, "Exito", true, null, null)
    );
  } catch (error) {
    return res.status(404).json(
      response(404, null, false, 'Algo salio mal: ' + error, null)
    );
  }
};
