import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faFolder,
  faFolderOpen,
  faFile,
  faPenToSquare,
  faFloppyDisk,
  faTrash,
  faXmark,
  faFilter,
} from '@fortawesome/free-solid-svg-icons'

library.add(
  faFolder,
  faFolderOpen,
  faFile,
  faPenToSquare,
  faFloppyDisk,
  faTrash,
  faXmark,
  faFilter,
)

// Import cell components with type checking
import * as Cells from './components/CellComponents'

const app = createApp(App)

Object.entries(Cells).forEach(([key, component]) => {
  app.component(key, component);
});

app.component('FontAwesomeIcon', FontAwesomeIcon)


// Expose cells map for programmatic lookup
app.provide('cellsMap', Cells)

app.mount('#app')