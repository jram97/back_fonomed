import { Request, Response } from 'express'

import { response } from '../libs/functions';

export const sendImagenChat = async (req: Request, res: Response): Promise<Response> => {

  try {
    return res.status(200).json(
      response(200, 'Ejecutado con exito', true, null, req.file["location"])
    );
  } catch (error) {
    return res.status(500).json(
      response(500, null, true, "Algo salio mal: " + error, null)
    );
  }
};
