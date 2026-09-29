import { createApp } from 'vue'
import { registerSW } from 'virtual:pwa-register'

import App from './App.vue'

import './styles/main.css'
import './styles/capture.css'
import './styles/search.css'

registerSW({
  immediate: true
})

createApp(App).mount('#app')