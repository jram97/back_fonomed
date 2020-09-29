import path from 'path'
import uuid from 'uuid/v4';
var AWS = require('aws-sdk')
var multer = require('multer')
var multerS3 = require('multer-s3')


import config from "../config/config";

const Id = config.AWS.ID;
const Key = config.AWS.PASS;
const Bucket = config.AWS.BUCKET;

const s3 = new AWS.S3({
  accessKeyId: Id,
  secretAccessKey: Key
});

const storage = multer({
storage: multerS3({
  s3: s3,
  bucket: Bucket + '/images/',
  limits: 500000,
  acl: 'public-read',
  metadata: (req, file, cb) => {
    cb(null, {fieldName: file.fieldname})
  },
  key: (req, file, cb) => {
    cb(null, Date.now().toString() + '-' + file.originalname)
  }
})
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

export default storage;
