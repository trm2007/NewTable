import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

// import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

// Import cell components with type checking
import * as Cells from './components/CellComponents'

const app = createApp(App)

Object.entries(Cells).forEach(([key, component]) => {
  app.component(key, component);
});

// app.component('FontAwesomeIcon', FontAwesomeIcon)

app.mount('#app')