import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import home from '@/views/home.vue'
import Inventory from '@/views/tables/Inventory.vue'
import InventorySummary from '@/views/tables/InventorySummary.vue'
import SalesRecord from '@/views/tables/SalesRecord.vue'
import Debt from '@/views/tables/Debt.vue'
import SalesSummary from '@/views/tables/SalesSummary.vue'
import InventorySales from '@/views/tables/InventorySales.vue'
import defaultTable from '@/views/tables/defaultTable.vue'
import InventoryCBB from '@/views/tables/InventoryCBB.vue'
import InventoryLPZ from '@/views/tables/InventoryLPZ.vue'
import InventorySCZ from '@/views/tables/InventorySCZ.vue'


Vue.use(VueRouter)


const routes = [
  {
    path: '/vuehome',
    name: 'vuehome',
    component: HomeView,
  },
  {
    path: '/',
    //name: 'home', //有默认子路由时，应该把name注释掉
    component: home,
    children:[     
      {
        path:'',  //路径为空的话就会默认渲染这个路由
        name:'defaultTable',
        component:defaultTable,
        props:true,
      },
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
        path:'/tables/InventoryCBB',
        name:'InventoryCBB',
        component:InventoryCBB,
        props:true,
      },
      {
        path:'/tables/InventoryLPZ',
        name:'InventoryLPZ',
        component:InventoryLPZ,
        props:true,
      },
      {
        path:'/tables/InventorySCZ',
        name:'InventorySCZ',
        component:InventorySCZ,
        props:true,
      },
      {
        path:'/tables/InventorySales',
        name:'InventorySales',
        component:InventorySales,
        props:true,
      },
      {
        path:'/tables/Debt',
        name:'Debt',
        component:Debt,
        props:true,
      },
      {
        path:'/tables/SalesRecord',
        name:'SalesRecord',
        component:SalesRecord,
        props:true,
      },
      {
        path:'/tables/SalesSummary',
        name:'SalesSummary',
        component:SalesSummary,
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
