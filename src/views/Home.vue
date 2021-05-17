<template>
	<div id="modal">
		<div class="opacity z-50 fixed left-0 top-0 h-screen bg-black bg-opacity-70 p-3 mb-3 overflow-auto transition-all duration-500 w-0 -ml-10">
			<form @submit="update" class="bg-white p-2 w-full md:w-3/5 mx-auto">
				<input v-model="edit.title" type="text" class="p-3 w-full focus:outline-none" placeholder="Title..." minlength="3" maxlength="120" required="">
				<textarea v-model="edit.description" style="min-height: 60vh;" class="p-3 w-full focus:outline-none" placeholder="Type here..." required=""></textarea>
				<input @change="changeFile" multiple="" type="file" name="file" class="hidden">
				<div class="border p-1 mt-1 text-xs" v-for="(data, key) in edit.file" v-bind:key="key">
					<span class="text-left" style="overflow-wrap: break-word;">{{data.file.split('/')[7].split('?alt')[0].split('%2F')[1]}}</span> <a :href="data.file" target="_blank" class="bg-blue-400 p-1 text-white focus:outline-none focus:ring focus:ring-blue-300">Open</a>
				</div>
				<button type="submit" class="bg-blue-400 text-white p-3 w-1/2 mt-2 hover:bg-blue-500 focus:outline-none transition-all duration-500">Update</button>
				<button @click="openModal" class="bg-red-400 text-white p-3 w-1/2 mt-2 hover:bg-red-500 focus:outline-none transition-all duration-500">Cancel</button>
			</form>
		</div>
	</div>
	<div id="modal-delete">
		<div class="opacity z-50 fixed left-0 top-0 h-screen bg-black bg-opacity-70 p-3 overflow-auto transition-all duration-500 w-0 -ml-10">
			<div class="bg-white p-2 mt-56 w-1/2 md:1/3 lg:w-1/5 mx-auto">
				<h5 class="font-bold p-5">Are you sure ?</h5>
				<button @click="deleteData" class="bg-blue-400 text-white p-3 w-1/2 mt-2 hover:bg-blue-500 focus:outline-none transition-all duration-500">Yes</button>
				<button @click="openModalDelete" :data-key="keyDelete" class="bg-red-400 text-white p-3 w-1/2 mt-2 hover:bg-red-500 focus:outline-none transition-all duration-500">Cancel</button>
			</div>
		</div>
	</div>
	<nav class="fixed left-0 top-0 w-full flex pl-3 pr-3 shadow-md bg-white bg-opacity-75">
		<div class="w-1/2">
			<div class="p-3 flex">
				<img :src="user.photoURL" class="w-10 h-10 rounded-full cursor-pointer" alt="">
				<span class="font-bold mt-2 ml-2 text-black cursor-pointer">{{user.displayName}}</span>
			</div>
		</div>
		<div class="w-1/2 flex justify-end">
			<a @click="signOut" href="/" class="p-3 text-black font-medium flex">
				<span class="mt-2 font-bold">Logout</span>
			</a>
		</div>
	</nav>
  <div class="flex flex-wrap justify-center w-full md:w-2/3 lg:w-1/3 mx-auto mt-20">
		<div class="border w-full p-3">
			<form @submit="insert">
				<input v-model="send.title" type="text" class="p-3 w-full focus:outline-none" placeholder="Title..." minlength="3" maxlength="120" required="">
				<textarea v-model="send.description" style="max-height: 200px;min-height: 100px;" class="p-3 w-full focus:outline-none" placeholder="Type here..." required=""></textarea>
				<input @change="changeFile" multiple="" type="file" name="file" class="hidden">
				<div class="border p-1 mt-1 text-xs" v-for="(data, key) in send.file" v-bind:key="key">
					<span class="text-left">{{data.name}} | {{Math.floor(data.size / 1024 / 1024)}} mb</span> <button @click="removeQueueUpload" :data-key="key" class="bg-red-400 p-1 text-white focus:outline-none focus:ring focus:ring-red-300">Cancel</button>
				</div>
				<button @click="chooseFile" type="button" class="border hover:bg-gray-300 text-black p-3 w-full focus:outline-none mt-4 transition-all duration-500">Attachment File</button>
				<button type="submit" class="bg-blue-400 text-white p-3 w-full mt-2 hover:bg-blue-500 focus:outline-none transition-all duration-500">Create</button>
			</form>
		</div>
	</div>
	<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mb-16 mt-5">
		<div v-for="(data, key) in todo" v-bind:key="key">
			<div class="border">
				<div class="p-2 sm:p-4">
					<p class="w-full">{{data.title}}</p>
				</div>
				<div class="border-b"></div>
				<div class="p-2 sm:p-4">
					<p class="w-full" style="overflow-wrap: break-word;">{{data.description.slice(0, 100)}}{{data.description.length >= 100 ? '...': ''}}</p>
				</div>
				<div class="flex">
					<button @click="openModal" :data-key="key" class="bg-blue-400 hover:bg-blue-600 text-white p-2 w-1/2 focus:outline-none transition-all duration-500">Edit</button>
					<button @click="openModalDelete" :data-key="key" class="bg-red-400 hover:bg-red-600 text-white p-2 w-1/2 focus:outline-none transition-all duration-500">Remove</button>
				</div>
			</div>
		</div>
	</div>
	<div>
		<h1>&copy; {{new Date().getFullYear()}} ferdiansyah0611</h1>
	</div>
</template>

<script>
import {auth, db, storage} from '@/firebase'
export default {
	name: 'Home',
	data(){
		return{
			user: auth.currentUser,
			todo: [],
			send: {
				title: '',
				description: '',
				file: []
			},
			edit: {
				id: '',
				title: '',
				description: '',
				file: []
			},
			keyDelete: null,
			keyUpdate: null
		}
	},
	created(){
		document.title = 'Home | To Do Web App'
	},
	mounted(){
		db.ref(`todo/${this.user.uid}`).on('value', snapshot => {
			this.todo = []
			snapshot.forEach((snap) => {
				this.todo = [...this.todo, snap.val()]
			})
		})
	},
	methods: {
		signOut(e){
			e.preventDefault()
			auth.signOut().then(() => {
				this.$router.push({name: 'Login'})
			})
		},
		changeFile(e){
			e.target.files.forEach((data) => this.send.file = [...this.send.file, data])
		},
		insert(e){
			e.preventDefault()
			db.ref(`todo/${this.user.uid}`).push({
				title: this.send.title,
				description: this.send.description,
			}).then(push => {
				db.ref(`todo/${this.user.uid}/${push.key}`).set({
					id: push.key,
					title: this.send.title,
					description: this.send.description,
				})
				if(this.send.file.length >= 1){
					this.send.file.forEach((data) => {
						const upload = storage.ref(`/images/${data.name}`).put(data)
						upload.on('state_changed', status => {
							var progress = (status.bytesTransferred / status.totalBytes) * 100;
							console.log('Upload is ' + progress + '% done');
						}, e => console.log(e), () => {
							upload.snapshot.ref.getDownloadURL().then(function(url) {
								db.ref(`todo/${auth.currentUser.uid}/${push.key}/file`).push({
									file: url
								})
							})
						})
					})
				}
				this.send = {
					title: '',
					description: '',
					file: []
				}
			})
		},
		update(e){
			e.preventDefault()
			try{
				db.ref(`todo/${this.user.uid}/${this.edit.id}`).set({
					id: this.edit.id,
					title: this.edit.title,
					description: this.edit.description,
				})
			}catch(e){
				alert(e.message)
			}
		},
		chooseFile(e){
			e.preventDefault()
			document.querySelector('input[name="file"]').click()
		},
		removeQueueUpload(e){
			e.preventDefault()
			this.send.file = this.send.file.filter((data, key) => key !== Number(e.target.dataset.key))
		},
		openModal(e){
			e.preventDefault()
			const modal = document.querySelector('#modal')
			if(modal.classList.contains('open')){
				modal.classList.remove('open')
				modal.querySelector('div').classList.add('w-0', '-ml-10')
				modal.querySelector('div').classList.remove('w-full')
			}
			else{
				modal.classList.add('open')
				modal.querySelector('div').classList.add('w-full')
				modal.querySelector('div').classList.remove('w-0', '-ml-10')
				this.edit = this.todo.find((data, key) => key == e.target.dataset.key)
			}
		},
		openModalDelete(e){
			e.preventDefault()
			const modal = document.querySelector('#modal-delete')
			if(modal.classList.contains('open')){
				this.keyDelete = null
				modal.classList.remove('open')
				modal.querySelector('div').classList.add('w-0', '-ml-10')
				modal.querySelector('div').classList.remove('w-full')
			}
			else{
				this.keyDelete = e.target.dataset.key
				modal.classList.add('open')
				modal.querySelector('div').classList.add('w-full')
				modal.querySelector('div').classList.remove('w-0', '-ml-10')
				this.edit = this.todo.find((data, key) => key == e.target.dataset.key)
			}
		},
		deleteData(e){
			e.preventDefault()
			const modal = document.querySelector('#modal-delete')
			db.ref(`todo/${this.user.uid}/${this.todo[this.keyDelete].id}`).remove().then(() => {
				if(this.todo[this.keyDelete]['file']){
					if(Object.keys(this.todo[this.keyDelete].file).length >= 1){
						Object.keys(this.todo[this.keyDelete].file).forEach((data) => {
							storage.ref(`images/${this.todo[this.keyDelete].file[data].file.split('/')[7].split('?alt')[0].split('%2F')[1]}`).delete()
						})
					}
				}
			}).catch(e => e)
			modal.classList.remove('open')
			modal.querySelector('div').classList.add('w-0', '-ml-10')
			modal.querySelector('div').classList.remove('w-full')
			this.keyDelete = null
		}
  	}
}
</script>
