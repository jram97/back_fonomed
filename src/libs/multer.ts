import multer from 'multer'
import path from 'path'
import uuid from 'uuid/v4';

// Configuracion MULTER, Subida de imagenes
export const storage = multer.diskStorage({
  destination: './src/public',
  filename: (req, file, cb) => {
    cb(null, uuid() + path.extname(file.originalname))
  }
});

export const factura = multer({
  storage: multer.diskStorage({
    destination: './src/public/facturas',
    filename: (req, file, cb) => {
      cb(null, uuid() + Date.now() +path.extname(file.originalname))
    }
  })
});

export const receta = multer({
  storage: multer.diskStorage({
    destination: './src/public/recetas',
    filename: (req, file, cb) => {
      cb(null, uuid() + Date.now() +path.extname(file.originalname))
    }
  })
});

export default multer({ storage });
