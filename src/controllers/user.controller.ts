import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import config from "../config/config";
import twilio from "../config/twilio";
import { sendEmail, generateCode, sendEmailCambioPassword } from "../libs/functions";

import User, { IUser } from "../models/user";
import Verify from "../models/verify";

const client = require('twilio')(twilio.accountSID, twilio.authToken);

/** GENERACION DE TOKEN CON JWT */
function createToken(user: IUser) {
  return jwt.sign({ id: user.id, email: user.email }, config.jwtSecret, {
    expiresIn: "3h",
  });
}

async function createNewPassword(password: string) {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  return hash;
}

/** CAMBIAR CONTRASEÑA */
export const cambiarContrasenia = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { password, r_password } = req.body;

  if (password == r_password) {
    const user = await User.findOne({ email: req.user["email"] });
    if (user) {
      await User.findByIdAndUpdate(user._id, {
        password: await createNewPassword(password),
      });

      return res.status(200).json({
        code: "200",
        message: "Contraseña cambiada con exito.",
      });
    } else {
      return res.status(404).json({
        code: "404",
        message: "Algo salio mal.",
      });
    }
  } else {
    return res.status(404).json({
      code: "404",
      message: "Contraseñas no son iguales.",
    });
  }
};

/** RECIBIR EMAIL :: EMAIL, CODE */
export const verifyRecibirEmail = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { code, email } = req.body;

  const verify = await Verify.findOne({ code: code, email: email });
  if (verify) {
    await Verify.findByIdAndDelete(verify._id);

    return res.status(200).json({
      code: "200",
      message: "Codigo valido.",
    });
  } else {
    return res.status(404).json({
      code: "404",
      message: "Codigo no valido.",
    });
  }
};

/** SEND EMAIL :: NOMBRE, EMAIL */
export const verifySendEmail = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { nombre, email } = req.body;

  const verify = await Verify.findOne({ email: email });
  if (verify) {
    sendEmail(verify.nombre, verify.email, verify.code);
    return res.status(200).json({
      code: "200",
      message: "Se a enviado nuevamente el codigo al correo.",
    });
  } else {
    let code = generateCode();
    sendEmail(nombre, email, code);
    const newVerify = new Verify({ nombre, email, code });
    await newVerify.save();
    return res.status(201).json({
      code: "201",
      message: "Se a enviado el codigo al correo.",
    });
  }
};

/** VERIFICACION SEND SMS */
export const enviarSMS = async (req: Request, res: Response): Promise<Response> => {
  return await client.verify
    .services(twilio.serviceSID)
    .verifications.create({to: `+${req.query.to}`, channel: 'sms'})  
    .then( data => {
      res.status(201).json({
        message: "Se a enviado el codigo al telefono.",
        phonenumber: `+${req.query.to}`,
        info: data,
      });
    })
    .catch( err => {
      res.status(400).json({
        message: "No se pudo enviar el mensaje",
        phonenumber: `+${req.query.to}`,
        info: err,
      });
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
    .then((data) => {
      if (data.status === "approved") {
        res.status(201).json({
          code: "200",
          message: "Codigo valido.",
          info: data,
        });
      } else {
        res.status(404).json({
          code: "404",
          message: "Codigo no valido.",
          info: data,
        });
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
      .status(403)
      .json({ code: "403", message: "Completa los campos." });
  }

  /** Constrasenas iguales */
  if (!req.body.password || !req.body.r_password) {
    return res
      .status(403)
      .json({ code: "403", message: "Contrasena no son iguales." });
  }

  /** Existencia de usuario */
  const user = await User.findOne({ email: req.body.email });
  if (user)
    return res
      .status(400)
      .json({
        code: "400",
        message: "Este correo ya esta asociado a una cuenta.",
      });

  /** Validacion (foto) y persistir */
  if (req.files["foto"] && req.files["dui"]) {
    if (req.files["documentos"]) {
      let element = [];
      for (let index = 0; index < req.files["documentos"].length; index++) {
        element.push(req.files["documentos"][index]["filename"]);
      }
      const newUser = new User(req.body);
      newUser.documento_ui = req.files["dui"][0]["filename"]
      newUser.foto = req.files["foto"][0]["filename"]
      newUser.especialidades = { especialidad: req.body.especialidad, imagen: element };

      const userNew = await newUser.save();
      return res.status(201).json(userNew);
    } else {
      const newUser = new User(req.body);
      newUser.documento_ui = req.files["dui"][0]["filename"]
      newUser.foto = req.files["foto"][0]["filename"]

      const userNew = await newUser.save();
      return res.status(201).json(userNew);
    }
  } else {
    if (req.files["documentos"]) {
      let element = [];
      for (let index = 0; index < req.files["documentos"].length; index++) {
        element.push(req.files["documentos"][index]["filename"]);
      }
      const newUser = new User(req.body);
      newUser.especialidades = { especialidad: req.body.especialidad, imagen: element };
      newUser.foto = `https://ui-avatars.com/api/?name=${req.body.nombre_completo}`;

      const userNew = await newUser.save();
      return res.status(201).json(userNew);
    } else {
      const newUser = new User(req.body);
      newUser.foto = `https://ui-avatars.com/api/?name=${req.body.nombre_completo}`;

      const userNew = await newUser.save();
      return res.status(201).json(userNew);
    }
  }
};

/** ACTUALIZAR PERFIL :: ENVIAR ID POR URL */
export const update = async (
  req: Request,
  res: Response
): Promise<Response> => {
  /** Campos requeridos */
  if (
    !req.body.email ||
    !req.body.nombre_completo ||
    !req.body.genero ||
    !req.body.telefono
  ) {
    return res
      .status(403)
      .json({ code: "403", message: "Completa los campos." });
  }

  /** Existencia de usuario */
  const user = await User.findById({ _id: req.params.id });
  if (!user)
    return res.status(404).json({ code: "404", message: "Usuario no existe." });

  /** Recepcion de datos */
  const {
    nombre_completo,
    email,
    password,
    genero,
    fecha_nacimiento,
    telefono,
    documento_ui,
    tipo,
    especialidades,
    jvmp,
    tarifa_g,
    tarifa_m,
  } = req.body;

  /** Validacion (foto) y persistir (update) */
  if (req.file) {
    const updateUser = await User.findByIdAndUpdate(req.params.id, {
      nombre_completo,
      email,
      password,
      genero,
      fecha_nacimiento,
      telefono,
      documento_ui,
      tipo,
      especialidades,
      jvmp,
      tarifa_g,
      tarifa_m,
      foto: req.file.filename,
    });
    return res.status(200).json(updateUser);
  } else {
    const updateUser = await User.findByIdAndUpdate(req.params.id, {
      nombre_completo,
      email,
      password,
      genero,
      fecha_nacimiento,
      telefono,
      documento_ui,
      tipo,
      especialidades,
      jvmp,
      tarifa_g,
      tarifa_m,
      foto: `https://ui-avatars.com/api/?name=${nombre_completo}`,
    });
    return res.status(200).json(updateUser);
  }
};

/** ACTUALIZAR ESTADO :: ENVIAR ID POR URL */
export const updateStatus = async (
  req: Request,
  res: Response
): Promise<Response> => {
  /** Existencia de usuario */
  const user = await User.findById({ _id: req.params.id });
  if (!user) {
    return res.status(404).json({ code: "404", message: "Usuario no existe." });
  }
  /** Recepcion de datos */
  const { aprobado } = req.body;
  /** Persistir (Update) */
  const updateUser = await User.findByIdAndUpdate(req.params.id, { aprobado });
  return res.status(200).json(updateUser);
};

/** LOGIN :: EMAIL Y PASSWORD */
export const signIn = async (
  req: Request,
  res: Response
): Promise<Response> => {
  /** Campos requeridos */
  if (!req.body.email || !req.body.password) {
    return res
      .status(403)
      .json({ code: "403", message: "Completa los campos." });
  }

  /** Existencia de usuario */
  const user = await User.findOne({ email: req.body.email, estado: true }).populate("especialidades.especialidad", "nombre");
  if (!user) {
    return res
      .status(404)
      .json({
        code: "404",
        message: "El correo no esta asociado a ninguna cuenta.",
      });
  }
  /** Match de contrasena, validacion de Bcrypt */
  const isMatch = await user.comparePassword(req.body.password);
  if (isMatch) {
    return res.status(200).json({
      code: "0",
      message: "Servicio ejecutado con exito.",
      data: {
        id: user._id,
        email: user.email,
        nombre: user.nombre_completo,
        genero: user.genero || "",
        fecNac: user.fecha_nacimiento,
        pagadito: user.cuenta_pagadito || "",
        foto: user.foto,
        especialidades: user.especialidades,
        rating: user.rating,
        nVotos: user.num_votes,
        telefono: user.telefono,
        premium: user.premium,
        role: user.tipo,
        token: createToken(user),
      },
    });
  }
  return res.status(403).json({
    msg: "El correo o contrasena es incorrecto",
  });
};


/** RECIBIR EMAIL :: EMAIL, CODE */
export const verifyRecibirEmailCambioPassword = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { code, email } = req.body;

  const verify = await Verify.findOne({ code: code, email: email });
  if (verify) {
    await Verify.findByIdAndDelete(verify._id);

    return res.status(200).json({
      code: "200",
      message: "Codigo valido.",
    });
  } else {
    return res.status(404).json({
      code: "404",
      message: "Codigo no valido.",
    });
  }
};

/** SEND EMAIL :: NOMBRE, EMAIL */
export const verifySendEmailCambioPassword = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { email } = req.body;

  const userExists = await User.findOne({ email: email});
  const verify = await Verify.findOne({ email: email });

  if(userExists){
    if (!verify) {
      let code = generateCode();
      const newVerify = new Verify({ nombre: userExists.nombre_completo, email, code });
      sendEmailCambioPassword(userExists.nombre_completo, newVerify.email, code);
      await newVerify.save();
      return res.status(201).json({
        code: "201",
        message: "Se a enviado el codigo al correo.",
      });
    }else{
      return res.status(200).json({
        code: "200",
        message: "Codigo ya a sido enviado anteriormente.",
      });
    }
  }else{
    return res.status(404).json({
      code: "404",
      message: "Usuario no existe.",
    });
  }
};