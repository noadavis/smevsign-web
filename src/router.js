import { createRouter, createWebHistory } from 'vue-router'
import HomePage from './pages/HomePage.vue'
import CreateXml from './pages/CreateXml.vue'
import SignXml from './pages/SignXml.vue'
import QueueXml from './pages/QueueXml.vue'
import SignFile from './pages/SignFile.vue'
import SignString from './pages/SignString.vue'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { name: 'home', path: '/', component: HomePage },
    { name: 'create', path: '/create/', component: CreateXml },
    { name: 'sign', path: '/sign/', component: SignXml },
    { name: 'queue', path: '/queue/', component: QueueXml },
    { name: 'files', path: '/files/', component: SignFile },
    { name: 'string', path: '/string/', component: SignString }
  ],
  linkActiveClass: 'active',
  linkExactActiveClass: 'active'
})
