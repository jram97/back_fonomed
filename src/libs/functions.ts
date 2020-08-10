const nodeMailer = require("nodemailer");
const CryptoJS = require('crypto-js');

const limit = require("express-rate-limit");

const fs = require("fs");

/** Encriptar */
export const encrypt = text => {
    const passphrase = '123';
    return CryptoJS.AES.encrypt(text, passphrase).toString();
};

/** Desencriptar */
export const decrypt = data => {
    const passphrase = '123';
    const bytes = CryptoJS.AES.decrypt(data, passphrase);
    const originalText = bytes.toString(CryptoJS.enc.Utf8);
    return originalText;
};

/** Bloquear peticiones por ip */
export const limitAPI = limit({
    windowMs: 45 * 60 * 1000,
    max: 1,
    message: {
        "code": 403,
        "msg": "Por favor espera 45 minutos"
    }
})

/** Eliminar archivos fisicos del proyectos */
export const deleteArchive = (name) => {

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
    return `TRF-${randonNumber}-${generateCode().substring(0,2).toUpperCase()}`;
}


/** Enviar correo */
export const sendEmail = (nombre, email, code) => {
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
        transporter.sendMail(mailOptions, (error, info) => {
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
export const sendEmailPago = (nombre, email) => {
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
        transporter.sendMail(mailOptions, (error, info) => {
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
export const sendEmailPagoCancelar = (nombre, email) => {
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
        transporter.sendMail(mailOptions, (error, info) => {
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
export const sendEmailCambioPassword = (nombre, email, code) => {
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
        transporter.sendMail(mailOptions, (error, info) => {
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