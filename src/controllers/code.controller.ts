import { Request, Response } from "express";
import { generateCodeTransaccion } from "../libs/functions";

import Code from "../models/code";

/** CODE */
export const generarCodigo = async (
    req: Request,
    res: Response
): Promise<Response> => {

    const code = generateCodeTransaccion();

    const codeExiste = await Code.findOne({ code: code });

    if (!codeExiste) {
        return res.status(201).json({
            msg: "Generado",
            code: await new Code({ code: code }).save()
        });
    }else{
        const actualizaCodigo = await Code.findByIdAndUpdate(codeExiste._id, {
            correlativo: codeExiste.correlativo++
        })
        return res.status(201).json({
            msg: "Actualizado",
            code: actualizaCodigo
        });
    }
};
