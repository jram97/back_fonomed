var admin = require("firebase-admin");

var serviceAccount = require(process.env.GOOGLE_APPLICATION_CREDENTIALS);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://fonomed-65e0e.firebaseio.com"
});

console.log("Firebase-admin inicializado");
