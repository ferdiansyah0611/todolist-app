import { createApp } from 'vue'
import App from './App.vue'
import './assets/tailwind.css'
import router from './router'
import {auth} from '@/firebase';

var app
auth.onAuthStateChanged(() => {
	if(!app) {
		app = createApp(App).use(router).mount('#app')
		window.postMessage({
			devtoolsEnabled: true,
			vueDetected: true
		})
	}
})