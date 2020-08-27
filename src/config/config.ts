export default {
  /** JWT KEY */
  jwtSecret: process.env.JWT_SECRET,
  /** DB CONFIG */
  DB: {
    URI: "mongodb://AdminUser:pruebas@pruebas-shard-00-00.y9vg7.mongodb.net:27017,pruebas-shard-00-01.y9vg7.mongodb.net:27017,pruebas-shard-00-02.y9vg7.mongodb.net:27017/fonomed?ssl=true&replicaSet=atlas-1np7se-shard-0&authSource=admin&retryWrites=true&w=majority",
    //URI: process.env.MONGODB_URI_LOCAL,
    //URI: process.env.MONGODB_URI_DOCKER_ROOTS,
    USER: process.env.MONGODB_USER,
    PASSWORD: process.env.MONGODB_PASSWORD
  }
};
