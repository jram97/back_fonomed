import multer from 'multer'
import path from 'path'
import uuid from 'uuid/v4';

// Configuracion MULTER, Subida de imagenes
const storage = multer.diskStorage({
  destination: './src/public',
  filename: (req, file, cb) => {
    cb(null, uuid() + path.extname(file.originalname))
  }
});
export default multer({ storage });
