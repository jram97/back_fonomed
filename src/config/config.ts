export default {
  /** JWT KEY */
  jwtSecret: process.env.JWT_SECRET,
  /** AWS */
  AWS: {
    ID: process.env.AWS_ID,
    BUCKET: process.env.AWS_BUCKET,
    PASS: process.env.AWS_PASSWORD
  },
  /** DB CONFIG */
  DB: {
    //URI: process.env.MONGODB_URI_LOCAL,
    //URI: process.env.MONGODB_URI_PROD_FONOMED,
    URI: process.env.MONGODB_URI_DOCKER_ROOTS,
    USER: process.env.MONGODB_USER,
    PASSWORD: process.env.MONGODB_PASSWORD
  }
};
