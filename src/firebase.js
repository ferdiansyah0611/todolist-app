import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/database";
import "firebase/storage";

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
const storage 	= firebase.storage()
const user 		= firebase.auth().currentUser

export{
	auth,
	firestore,
	db,
	storage,
	user,
	firebase
}