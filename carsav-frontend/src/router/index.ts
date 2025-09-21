import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import MainScene from '@/views/MainScene.vue'
import StartScene from '@/views/StartScene.vue'
import NovaPredstavaScene from '../views/NovaPredstavaScene.vue'
import NovGlumacScene from '../views/NovGlumacScene.vue'
import ObrisiPredstavuScene from '../views/ObrisiPredstavuScene.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'StartScene',
    component: StartScene
  },
  {
    path: '/main', // The new path for our main view
    name: 'MainScene',
    component: MainScene
  },
  {
    path: '/nova-predstava',
    name: 'NovaPredstavaScene',
    component: NovaPredstavaScene
  },
  {
    path: '/nov-glumac',
    name: 'NovGlumac',
    component: NovGlumacScene
  },
  {
    path: '/obrisi-predstavu',
    name: 'ObrisiPredstavu',
    component: ObrisiPredstavuScene
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
