import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import home from '@/views/home.vue'

Vue.use(VueRouter)


const routes = [
  {
    path: '/vuehome',
    name: 'vuehome',
    component: HomeView
  },
  {
    path: '/',
    name: 'home',
    component: home,
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
