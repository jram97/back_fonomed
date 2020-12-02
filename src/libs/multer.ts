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

export const storage = multer({
  storage: multerS3({
    s3: s3,
    bucket: Bucket + '/images',
    limits: 500000,
    acl: 'public-read',
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname })
    },
    key: (req, file, cb) => {
      cb(null, Date.now().toString() + '-' + file.originalname)
    }
  })
});

export const storageChat = multer({
  storage: multerS3({
    s3: s3,
    bucket: Bucket + '/chat',
    limits: 500000,
    acl: 'public-read',
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname })
    },
    key: (req, file, cb) => {
      cb(null, Date.now().toString() + '-' + file.originalname)
    }
  })
});

export const factura = multer({
  storage: multerS3({
    s3: s3,
    bucket: Bucket + '/facturas',
    limits: 500000,
    acl: 'public-read',
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname })
    },
    key: (req, file, cb) => {
      cb(null, Date.now().toString() + '-' + file.originalname)
    }
  })
});

export const receta = multer({
  storage: multerS3({
    s3: s3,
    bucket: Bucket + '/receta',
    limits: 500000,
    acl: 'public-read',
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname })
    },
    key: (req, file, cb) => {
      cb(null, Date.now().toString() + '-' + file.originalname)
    }
  })
});

export const bugs = multer({
  storage: multerS3({
    s3: s3,
    bucket: Bucket + '/bugs',
    limits: 500000,
    acl: 'public-read',
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname })
    },
    key: (req, file, cb) => {
      cb(null, Date.now().toString() + '-' + file.originalname)
    }
  })
});

export default storage;
