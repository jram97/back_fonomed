import { Request, Response } from "express";
import { response, generateCodeTransaccion, generateCodeTransaccionRevision } from "../libs/functions";

import Code from "../models/code";

/** CODE Transacciones */
export const generarCodigo = async (
  req: Request,
  res: Response
): Promise<Response> => {

  try {
    const code = generateCodeTransaccion();

    const codeExiste = await Code.findOne({ code: code });

    if (!codeExiste) {
      return res.status(201).json(
        response(201, 'Ejecutado con exito', true, null, await new Code({ code: code }).save())
      );
    } else {
      const actualizaCodigo = await Code.findByIdAndUpdate(codeExiste._id, {
        correlativo: codeExiste.correlativo++
      })
      return res.status(201).json(
        response(201, 'Ejecutado con exito', true, null, actualizaCodigo)
      );
    }
  } catch (error) {
    return res.status(404).json(
      response(404, null, false, 'Algo salio mal: ' + error, null)
    );
  }
};

/** CODE Transacciones Revision */
export const generarCodigoRevision = async (
  req: Request,
  res: Response
): Promise<Response> => {

  try {
    const code = generateCodeTransaccionRevision();

    const codeExiste = await Code.findOne({ code: code });

    if (!codeExiste) {
      return res.status(201).json(
        response(201, 'Ejecutado con exito', true, null, await new Code({ code: code }).save())
      );
    } else {
      const actualizaCodigo = await Code.findByIdAndUpdate(codeExiste._id, {
        correlativo: codeExiste.correlativo++
      })
      return res.status(201).json(
        response(201, 'Ejecutado con exito', true, null, actualizaCodigo)
      );
    }
  } catch (error) {
    return res.status(404).json(
      response(404, null, false, 'Algo salio mal: ' + error, null)
    );
  }
};
