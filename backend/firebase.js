const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'SEU_BUCKET_ID.appspot.com'
});

const db = admin.firestore();
const bucket = admin.storage().bucket();

module.exports = { db, bucket };
