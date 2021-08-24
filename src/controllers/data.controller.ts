import { Request, Response } from 'express'
import bcrypt from "bcrypt";

import Especialidades from "../models/especialidad";
import Pais from "../models/pais";
import User from "../models/user";



import { response } from '../libs/functions';

async function createNewPassword(password: string) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
}

export const cargarData = async (req: Request, res: Response): Promise<Response> => {

    const evaluar = "Medicina General";
    const e = await Especialidades.findOne({ nombre: evaluar });

    if (!e) {
        const especialidad1 = new Especialidades({
            nombre: evaluar
        });
        await especialidad1.save();
        const especialidad2 = new Especialidades({
            nombre: "Cirujano"
        });
        await especialidad2.save();
        const especialidad3 = new Especialidades({
            nombre: "Cardiologo"
        });
        await especialidad3.save();

        const pais3 = new Pais({
            codigo: "+501",
            nombre: "Belize"
        })
        await pais3.save();
        const pais2 = new Pais({
            codigo: "+502",
            nombre: "Guatemala"
        })
        await pais2.save();
        const pais1 = new Pais({
            codigo: "+503",
            nombre: "El Salvador"
        })
        await pais1.save();
        const pais4 = new Pais({
            codigo: "+504",
            nombre: "Honduras"
        })
        await pais4.save();
        const pais5 = new Pais({
            codigo: "+505",
            nombre: "Nicaragua"
        })
        await pais5.save();
        const pais6 = new Pais({
            codigo: "+506",
            nombre: "Costa Rica"
        })
        await pais6.save();
        const pais7 = new Pais({
            codigo: "+507",
            nombre: "Panamá"
        })
        await pais7.save();

        const password = await createNewPassword("D4dmin01");

        const userDoctor = new User({
            nombre_completo: "Doctor Roots",
            email: "doctor@fonomed.com",
            password: password,
            genero: "Masculino",
            telefono: "25201011",
            tipo: "DOC",
            foto: `https://ui-avatars.com/api/?name=Doctor`
        });
        await userDoctor.save();

        const userPaciente = new User({
            nombre_completo: "Paciente Roots",
            email: "paciente@fonomed.com",
            password: password,
            genero: "Masculino",
            telefono: "25201010",
            tipo: "CLI",
            foto: `https://ui-avatars.com/api/?name=Paciente`
        });
        await userPaciente.save();

        return res.status(200).json(
            response(200, 'Ejecutado con exito', true, null, null)
        );
    } else {
        return res.status(404).json(
            response(404, null, false, 'Data ya sido cargada', null)
        );
    }
};

/** Logs */
export const responseLogs = async (req: Request, res: Response): Promise<Response> => {

    console.log({ msg: req.body.message, path: req.body.path, date: new Date() })

    return res.status(200).json({
        msg: req.body.message,
        path: req.body.path,
        date: new Date()
    });
};