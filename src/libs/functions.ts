import nodeMailer from "nodemailer";
import CryptoJS from 'crypto-js';
import moment, { now } from 'moment';

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
  windowMs: 360 * 60 * 1000,
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
    let transporter = nodeMailer.createTransport({
      service: process.env.EMAIL_HOST,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    let mailOptions = {
      from: process.env.EMAIL_USER,
      replyTo: process.env.EMAIL_REPLY_TO,
      to: email,
      subject: "FONOMED✔!",
      html: `<p style="font-size: 16px;color: #808080"">¡Querido ${nombre}!<p>
                    <p style="font-size: 15px;color: #808080; line-height: 1.5;">Te saludamos de parte de Fonomed<br>
                    Para verificar tu cuenta por favor ingresa el siguiente codigo</p><br>
                    <center><h3>${code}</h3></center><br><br>

                    <p style="font-size: 12px;color: #808080">Att: Equipo de Fonomed</p>`
    };
    transporter.sendMail(mailOptions, (error: any, info: any) => {
      if (error) {
        return console.log(error);
      }
      console.log(
        "Message %s sent: %s",
        info.messageId,
        info.response
      );
    });
    return true;
  } catch (err) {
    return false;
  }
}

/** Enviar correo : pago exitoso */
export const sendEmailPago = (nombre: string, email: string) => {
  try {
    let transporter = nodeMailer.createTransport({
      service: process.env.EMAIL_HOST,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    let mailOptions = {
      from: process.env.EMAIL_USER,
      replyTo: process.env.EMAIL_REPLY_TO,
      to: email,
      subject: "FONOMED✔!",
      html: `<p style="font-size: 16px;color: #808080"">¡Querido ${nombre}!<p>
                    <p style="font-size: 15px;color: #808080; line-height: 1.5;">Te saludamos de parte de Fonomed<br>
                    Se ha enviado este correo debido a que tu pago mensual se efectuo con exito</p><br>

                    <p style="font-size: 12px;color: #808080">Att: Equipo de Fonomed</p>`
    };
    transporter.sendMail(mailOptions, (error: any, info: any) => {
      if (error) {
        return console.log(error);
      }
      console.log(
        "Message %s sent: %s",
        info.messageId,
        info.response
      );
    });
    return true;
  } catch (err) {
    return false;
  }
}

/** Enviar correo : cancelacion exitosa */
export const sendEmailPagoCancelar = (nombre: string, email: string) => {
  try {
    let transporter = nodeMailer.createTransport({
      service: process.env.EMAIL_HOST,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    let mailOptions = {
      from: process.env.EMAIL_USER,
      replyTo: process.env.EMAIL_REPLY_TO,
      to: email,
      subject: "FONOMED✔!",
      html: `<p style="font-size: 16px;color: #808080"">¡Querido ${nombre}!<p>
                    <p style="font-size: 15px;color: #808080; line-height: 1.5;">Te saludamos de parte de Fonomed<br>
                    Se ha enviado este correo debido a que se ha desactivado tus pagos mensuales de servicio premium</p><br>

                    <p style="font-size: 12px;color: #808080">Att: Equipo de Fonomed</p>`
    };
    transporter.sendMail(mailOptions, (error: any, info: any) => {
      if (error) {
        return console.log(error);
      }
      console.log(
        "Message %s sent: %s",
        info.messageId,
        info.response
      );
    });
    return true;
  } catch (err) {
    return false;
  }
}

/** Enviar correo Cambio Password */
export const sendEmailCambioPassword = (nombre: string, email: string, code: string) => {
  try {
    let transporter = nodeMailer.createTransport({
      service: process.env.EMAIL_HOST,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    let mailOptions = {
      from: process.env.EMAIL_USER,
      replyTo: process.env.EMAIL_REPLY_TO,
      to: email,
      subject: "FONOMED✔!",
      html: `<p style="font-size: 16px;color: #808080"">¡Querido ${nombre}!<p>
                    <p style="font-size: 15px;color: #808080; line-height: 1.5;">Te hemos enviado este correo porque has solicitado
                    un cambio de contraseña</p><br>
                    <center><h3>${code}</h3></center><br><br>

                    <p style="font-size: 12px;color: #808080">Att: Equipo de Fonomed</p>`
    };
    transporter.sendMail(mailOptions, (error: any, info: any) => {
      if (error) {
        return console.log(error);
      }
      console.log(
        "Message %s sent: %s",
        info.messageId,
        info.response
      );
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

export const filtrarCitasCaducadas = (citas: any) => {
  return citas.filter(cita => {
    var fechaCita = new Date(`${cita.fecha.getFullYear()}-${cita.fecha.getMonth() + 1}-${cita.fecha.getDate()}`);
    fechaCita.setDate(fechaCita.getDate() + 1);

    /*if (!moment.utc().utcOffset(-360).isAfter(moment(fechaCita).hour(cita.fin.split(":")[0]).minute(cita.fin.split(":")[1]))) {
      console.log(moment.utc().utcOffset(-360).hour());
      return cita
    }*/

    const now = moment();
    const mFechaCita = moment(fechaCita).hour(cita.fin.split(":")[0]).minute(cita.fin.split(":")[1]);
    //console.log(`Hora actual desde el servidor: ${now.hours()}:${now.minutes()}`);

    console.log("Pendientes",now.diff(mFechaCita, "minutes"));
    if (now.diff(mFechaCita, "minutes") <= 360) {
      return cita;
    }

  });
}

export const filtrarCitasHistorial = (citas: any) => {
  return citas.filter(cita => {
    var fechaCita = new Date(`${cita.fecha.getFullYear()}-${cita.fecha.getMonth() + 1}-${cita.fecha.getDate()}`);
    fechaCita.setDate(fechaCita.getDate() + 1);
    const now = moment();
    const mFechaCita = moment(fechaCita).hour(cita.fin.split(":")[0]).minute(cita.fin.split(":")[1]);

    /*if (!nowUtc.isBefore(moment(fechaCita).hour(cita.fin.split(":")[0]).minute(cita.fin.split(":")[1]))) {
      //console.log(cita.fecha);
      return cita
    }*/
    //console.log(`Hora actual desde el servidor: ${now.hours()}:${now.minutes()}`);
    console.log("Historial",now.diff(mFechaCita, "minutes"));
    if (now.diff(mFechaCita, "minutes") > 360) {
      return cita;
    }

  });
}