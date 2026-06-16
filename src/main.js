import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { vCan } from './directives/vCan'
import { useAuthStore } from './stores/auth.store'
import { useUiStore } from './stores/ui.store'

import './assets/styles/main.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// Global directives
app.directive('can', vCan)

// Global 401 handler: the Axios interceptor dispatches this event
// when a token is revoked mid-session (outside of route navigation)
window.addEventListener('crm:unauthorized', () => {
  const auth = useAuthStore()
  const ui = useUiStore()
  auth.clearSession()
  ui.showError('Your session has expired. Please sign in again.')
  router.push({ name: 'login' })
})

app.mount('#app')
