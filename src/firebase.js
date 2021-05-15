import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/database";

var firebaseConfig = {
	apiKey: process.env.VUE_APP_APIKEY,
	authDomain: process.env.VUE_APP_AUTHDOMAIN,
	databaseURL: process.env.VUE_APP_DATABASEURL,
	projectId: process.env.VUE_APP_PROJECTID,
	storageBucket: process.env.VUE_APP_STORAGEBUCKET,
	messagingSenderId: process.env.VUE_APP_MESSAGINGSENDERID,
	appId: process.env.VUE_APP_APPID,
	measurementId: process.env.VUE_APP_MEASUREMENTID
}

firebase.initializeApp(firebaseConfig);

const auth 		= firebase.auth()
const firestore = firebase.firestore()
const db 		= firebase.database()
const user 		= auth.currentUser

const data = {
	auth,
	firestore,
	db,
	user
}

export default data