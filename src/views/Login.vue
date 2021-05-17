<template>
	<div class="p-3 border-2 w-full sm:w-1/3 mx-auto mt-16 mb-16">
		<h2 class="font-bold text-2xl p-4">Login | To Do List</h2>
		<form @submit="loginEmail" class="flex flex-wrap justify-center">
			<input v-model="email" class="w-full p-3 border mt-3 focus:outline-none focus:ring" type="email" placeholder="Email">
			<input v-model="password" class="w-full p-3 border mt-3 focus:outline-none focus:ring" type="password" placeholder="Password" autocomplete="off">
			<button type="submit" class="p-3 font-bold mt-3 w-full border focus:outline-none focus:ring focus:ring-gray-200">Login</button>
		</form>
		<h2 class="font-medium mt-3 text-sm">OR</h2>
		<button @click="loginGoogle" class="p-3 w-full border hover:bg-gray-200 text-black font-bold mt-3 focus:outline-none focus:ring focus:ring-gray-300">LOGIN WITH GOOGLE</button>
		<button @click="loginFacebook" class="p-3 w-full bg-blue-600 hover:bg-blue-500 text-white font-bold mt-3 focus:outline-none focus:ring focus:ring-blue-400">LOGIN WITH FACEBOOK</button>
	</div>
	<div>
		<h1>&copy; 2020 ferdiansyah0611</h1>
	</div>
</template>

<script>
import {db, auth, firebase} from '@/firebase'
export default{
	data(){
		return{
			email: '',
			password: ''
		}
	},
	created(){
		document.title = 'Login | To Do List Web App'
	},
	beforeMount(){
		if(auth.currentUser){
			this.$router.push('/')
		}
	},
	methods: {
		loginGoogle(e){
			e.preventDefault()
			let provider = new firebase.auth.GoogleAuthProvider()
			firebase.auth().signInWithPopup(provider).then(result => {
				db.ref(`users/${result.user.uid}`).set({
					id: result.user.uid,
					name: result.user.displayName,
					email: result.user.email,
					emailVerified: result.user.emailVerified,
					photoURL: result.user.photoURL
				}).then(() => {
					this.$router.push({name: 'Home'})
				})
			})
		},
		loginFacebook(e){
			e.preventDefault()
			let provider = new firebase.auth.FacebookAuthProvider()
			firebase.auth().signInWithPopup(provider).then(result => {
				db.ref(`users/${result.user.uid}`).set(result.user).then(() => {
					this.$router.push({name: 'Home'})
				})
			})
		},
		loginEmail(e){
			e.preventDefault()
			auth.signInWithEmailAndPassword(this.email, this.password).then(result => {
				db.ref(`users/${result.user.uid}/detail`).set(result.user).then(() => {
					this.$router.push({name: 'Home'})
				})
			})
		},
	}
}
</script>