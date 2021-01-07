import nodeMailer from "nodemailer";
import CryptoJS from 'crypto-js';
import moment, { now } from 'moment';
import admin from 'firebase-admin';

const mailgun = require("mailgun-js");
const DOMAIN = process.env.MAILGUN_DOMAIN;
const mg = mailgun({ apiKey: process.env.MAILGUN_APIKEY, domain: DOMAIN });

import limit from "express-rate-limit";

import fs from "fs";

/** Response */
export const response = (code: number = 200, msg: any = null, ok: boolean = true, msg_error: any = null, data: any = null) => {
  return {
    code: code,
    msg: msg,
    ok: ok,
    msg_error: msg_error,
    data: data
  };
};

/** Encriptar */
export const encrypt = (text: string) => {
  const passphrase = '123';
  return CryptoJS.AES.encrypt(text, passphrase).toString();
};

/** Desencriptar */
export const decrypt = (data: string) => {
  const passphrase = '123';
  const bytes = CryptoJS.AES.decrypt(data, passphrase);
  const originalText = bytes.toString(CryptoJS.enc.Utf8);
  return originalText;
};

/** Bloquear peticiones por ip */
export const limitAPI = limit({
  //windowMs: 720 * 60 * 1000,
  windowMs: 15 * 60 * 1000,
  max: 1,
  message: "Intenta de nuevo en 6 horas"
})

/** Eliminar archivos fisicos del proyectos */
export const deleteArchive = (name: string) => {

  try {
    if (fs.existsSync("./src/public/" + name)) {
      fs.unlinkSync("./src/public/" + name);
    }
  } catch (err) {
    console.error("Image was not deleted");
  }
}

/** Codigo generado para los correos */
export const generateCode = () => {
  const opciones = "abcdefghijklmnopqrstuvwxyz0123456789";
  let randonNumber = "";
  for (let index = 0; index < 6; index++) {
    randonNumber += opciones.charAt(Math.floor(Math.random() * opciones.length));
  }
  return randonNumber;
}

/** Codigo generado para las transacciones */
export const generateCodeTransaccion = () => {
  const opciones = "0000000111222333444555666777888999";
  let randonNumber = "";
  for (let index = 0; index < 10; index++) {
    randonNumber += opciones.charAt(Math.floor(Math.random() * opciones.length));
  }
  return `TRF-${randonNumber}-${generateCode().substring(0, 2).toUpperCase()}`;
}

/** Codigo generado para las transacciones de revision */
export const generateCodeTransaccionRevision = () => {
  const opciones = "0000000111222333444555666777888999";
  let randonNumber = "";
  for (let index = 0; index < 10; index++) {
    randonNumber += opciones.charAt(Math.floor(Math.random() * opciones.length));
  }
  return `TRFR-${randonNumber}-${generateCode().substring(0, 2).toUpperCase()}`;
}


/** Enviar correo */
export const sendEmail = (nombre: string, email: string, code: string) => {
  try {

    let mailOptions = {
      from: process.env.EMAIL_USER,
      replyTo: process.env.EMAIL_REPLY_TO,
      to: email,
      subject: "FONOMED✔!",
      html: `<p style="font-size: 16px;color: #808080"">¡Estimado/a ${nombre}!<p>
                    <p style="font-size: 15px;color: #808080; line-height: 1.5;">Te saludamos de parte de Fonomed<br>
                    Para verificar tu cuenta por favor ingresa el siguiente codigo</p><br>
                    <center><h3>${code}</h3></center><br><br>

                    <p style="font-size: 12px;color: #808080">Att: Equipo de Fonomed</p>`
    };

    mg.messages().send(mailOptions, function (error, body) {
      console.log(body);
    });
    return true;
  } catch (err) {
    return false;
  }
}

/** Enviar correo : pago exitoso */
export const sendEmailPago = (nombre: string, email: string) => {
  try {

    let mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "FONOMED✔!",
      html: `<p style="font-size: 16px;color: #808080"">¡Estimado/a ${nombre}!<p>
                    <p style="font-size: 15px;color: #808080; line-height: 1.5;">Te saludamos de parte de Fonomed<br>
                    Se ha enviado este correo debido a que tu pago mensual se efectuó con exito</p><br>

                    <p style="font-size: 12px;color: #808080">Att: Equipo de Fonomed</p>`
    };

    mg.messages().send(mailOptions, function (error, body) {
      console.log(body);
    });
    return true;
  } catch (err) {
    return false;
  }
}

/** Enviar correo : pago exitoso */
export const sendEmailPagoCita = (nombre: string, email: string) => {
  try {

    let mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "FONOMED✔!",
      html: `<p style="font-size: 16px;color: #808080"">¡Estimado/a ${nombre}!<p>
                    <p style="font-size: 15px;color: #808080; line-height: 1.5;">Te saludamos de parte de Fonomed<br>
                    Se ha enviado este correo debido a que el pago de tu cita se efectuó con exito</p><br>

                    <p style="font-size: 12px;color: #808080">Att: Equipo de Fonomed</p>`
    };

    mg.messages().send(mailOptions, function (error, body) {
      console.log(body);
    });
    return true;
  } catch (err) {
    return false;
  }


}

export const sendEmailCitaGratis = (nombre: string, email: string) => {
  try {

    let mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "FONOMED✔!",
      html: `<p style="font-size: 16px;color: #808080"">¡Estimado/a ${nombre}!<p>
                    <p style="font-size: 15px;color: #808080; line-height: 1.5;">Te saludamos de parte de Fonomed<br>
                    Este correo es un comprobante de compra de tu cita, el monto realizado fue de $0.00.</p><br>

                    <p style="font-size: 12px;color: #808080">Att: Equipo de Fonomed</p>`
    };

    mg.messages().send(mailOptions, function (error, body) {
      console.log(body);
    });
    return true;
  } catch (err) {
    return false;
  }


}

/** Enviar correo : cancelacion exitosa */
export const sendEmailPagoCancelar = (nombre: string, email: string) => {
  try {

    let mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "FONOMED✔!",
      html: `<p style="font-size: 16px;color: #808080"">¡Estimado/a ${nombre}!<p>
                    <p style="font-size: 15px;color: #808080; line-height: 1.5;">Te saludamos de parte de Fonomed<br>
                    Se ha enviado este correo debido a que se han desactivado tus pagos mensuales de servicio premium</p><br>

                    <p style="font-size: 12px;color: #808080">Att: Equipo de Fonomed</p>`
    };

    mg.messages().send(mailOptions, function (error, body) {
      console.log(body);
    });

    return true;
  } catch (err) {
    return false;
  }
}

export const correoContacto = (campos: any) => {
  try {

    let mailOptions = {
      from: process.env.EMAIL_USER,
      to: "s.ramirez@pagadito.com",
      subject: "Contacto Fonomed",
      html: `<p> Nombre: ${campos.nombre}</p><br>
            </p>Telefono: ${campos.telefono}</p><br>
            </p>Email: ${campos.email}</p><br>
            </p>Pais: ${campos.pais}</p><br>
            </p>Mensaje: ${campos.mensaje}</p><br>`
    };

    mg.messages().send(mailOptions, function (error, body) {
      console.log(body);
    });
    return true;
  } catch (err) {
    return false;
  }
}

/** Enviar correo Cambio Password */
export const sendEmailCambioPassword = (nombre: string, email: string, code: string) => {
  try {

    let mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "FONOMED✔!",
      html: `<p style="font-size: 16px;color: #808080"">¡Estimado/a ${nombre}!<p>
                    <p style="font-size: 15px;color: #808080; line-height: 1.5;">Te hemos enviado este correo porque has solicitado
                    un cambio de contraseña</p><br>
                    <center><h3>${code}</h3></center><br><br>

                    <p style="font-size: 12px;color: #808080">Att: Equipo de Fonomed</p>`
    };

    mg.messages().send(mailOptions, function (error, body) {
      console.log(body);
    });
    return true;
  } catch (err) {
    return false;
  }
}

/**Comprobar el tercer argumento se encuentra entre los dos primeros */

export const isBetween = (first: number, second: number, compare: number) => {

  if (first < compare && second > compare) {
    return true;
  }

  return false;
}

export const verificarHorario = (horario: any, inicio: any, fin: any) => {
  var inicioHorario = horario.inicio.split(":");
  inicioHorario = (parseInt(inicioHorario[0]) * 60) + parseInt(inicioHorario[1]);

  var finHorario = horario.fin.split(":");
  finHorario = (parseInt(finHorario[0]) * 60) + parseInt(finHorario[1]);

  var inicioNueva = inicio.split(":");
  inicioNueva = (parseInt(inicioNueva[0]) * 60) + parseInt(inicioNueva[1]);

  var finNueva = fin.split(":");
  finNueva = (parseInt(finNueva[0]) * 60) + parseInt(finNueva[1]);

  if (inicioHorario == inicioNueva || finHorario == finNueva) {
    return true;
  }

  if (isBetween(inicioHorario, finHorario, inicioNueva) && isBetween(inicioHorario, finHorario, finNueva)) {
    return true;
  }

  return false;
}

export const verificarCita = (cita: any, inicio: any, fin: any) => {
  var inicioCita = cita.inicio.split(":");
  inicioCita = (parseInt(inicioCita[0]) * 60) + parseInt(inicioCita[1]);

  var finCita = cita.fin.split(":");
  finCita = (parseInt(finCita[0]) * 60) + parseInt(finCita[1]);

  var inicioNueva = inicio.split(":");
  inicioNueva = (parseInt(inicioNueva[0]) * 60) + parseInt(inicioNueva[1]);

  var finNueva = fin.split(":");
  finNueva = (parseInt(finNueva[0]) * 60) + parseInt(finNueva[1]);

  if (inicioCita == inicioNueva || finCita == finNueva) {
    return false;
  }

  if (isBetween(inicioCita, finCita, inicioNueva) || isBetween(inicioCita, finCita, finNueva)) {
    return false
  }

  return true
}

export const minutesToHours = (time: any) => {
  const horas = Math.floor(time / 60);
  const minutos = time - (horas * 60);
  return `${horas}:${minutos}`
}

export const hoursToMinutes = (time: any) => {
  time = time.split(":");
  return (parseInt(time[0]) * 60) + parseInt(time[1]);
}

export const filtrarCitasCaducadas = (citas: any, estado: any) => {
  return citas.filter(cita => {
    var fechaCita = new Date(`${cita.fecha.getFullYear()}-${cita.fecha.getMonth() + 1}-${cita.fecha.getDate()}`);
    fechaCita.setDate(fechaCita.getDate() + 1);
    console.log("Fecha normal", fechaCita);

    const now = moment();
    const mFechaCita = moment(fechaCita).hour(cita.fin.split(":")[0]).minute(cita.fin.split(":")[1]).date(fechaCita.getDate()); //<- Antes tenia +1 el get date
    console.log("Fecha al pasarla a moment y ponerle hora", mFechaCita);

    console.log("Diferencia en pendientes", now.diff(mFechaCita, "minutes"));
    if ((now.diff(mFechaCita, "minutes") <= 0) && (cita[estado] != "Completado")) {
      return cita;
    }

  });
}

export const filtrarCitasHistorial = (citas: any, estado: any) => {
  return citas.filter(cita => {
    var fechaCita = new Date(`${cita.fecha.getFullYear()}-${cita.fecha.getMonth() + 1}-${cita.fecha.getDate()}`);
    fechaCita.setDate(fechaCita.getDate() + 1);
    const now = moment();
    const mFechaCita = moment(fechaCita).hour(cita.fin.split(":")[0]).minute(cita.fin.split(":")[1]).date(fechaCita.getDate());//<- Antes tenia +1 el get date
    console.log(fechaCita);

    console.log("Diferencia en historial", now.diff(mFechaCita, "minutes"));
    if ((now.diff(mFechaCita, "minutes") > 0) || cita[estado] == "Completado") {
      return cita;
    }

  });
}

export const sendNotification = async (tokens, payload) => {
  const response = await admin.messaging().sendToDevice(tokens, payload);
  console.log(response);
  return response;
}