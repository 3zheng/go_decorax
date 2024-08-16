import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import home from '@/views/home.vue'
import Inventory from '@/views/tables/Inventory.vue'
import InventorySummary from '@/views/tables/InventorySummary.vue'
import Salesman from '@/views/tables/Salesman.vue'
import Debt from '@/views/tables/Debt.vue'

Vue.use(VueRouter)


const routes = [
  {
    path: '/vuehome',
    name: 'vuehome',
    component: HomeView,
  },
  {
    path: '/',
    name: 'home',
    component: home,
    children:[
      {
        path:'/tables/Inventory',
        name:'Inventory',
        component:Inventory,
        props:true,
      },
      {
        path:'/tables/InventorySummary',
        name:'InventorySummary',
        component:InventorySummary,
        props:true,
      },
      {
        path:'/tables/Debt',
        name:'Debt',
        component:Debt,
        props:true,
      },
      {
        path:'/tables/Salesman',
        name:'Salesman',
        component:Salesman,
        props:true,
      },     
    ],
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
