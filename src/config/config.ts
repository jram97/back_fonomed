export default {
  /** JWT KEY */
  jwtSecret: process.env.JWT_SECRET,
  /** DB CONFIG */
  DB: {
    //URI: process.env.MONGODB_URI_LOCAL,
    URI: process.env.MONGODB_URI_PROD_FONOMED,
    //URI: process.env.MONGODB_URI_DOCKER_ROOTS,
    USER: process.env.MONGODB_USER,
    PASSWORD: process.env.MONGODB_PASSWORD
  },
  /*firebaseConfig: {
    apiKey: "AIzaSyDYONpLoXY3oOJHFy7LnsIYy2OEDg-lblc",
    authDomain: "fonomed-65e0e.firebaseapp.com",
    databaseURL: "https://fonomed-65e0e.firebaseio.com",
    projectId: "fonomed-65e0e",
    storageBucket: "fonomed-65e0e.appspot.com",
    messagingSenderId: "739560050472",
    appId: "1:739560050472:web:94f87660c7657489ee4a1d"
  }*/
};
