import Vue from 'vue'
import Router from 'vue-router'
import login from '../views/login'
import home from '../views/home'
import welcome from '../views/home/welcome'
import users from '../views/home/users'
import rights from '../views/home/power/rights'
import roles from '../views/home/power/roles'
import categories from '../views/home/goods/categories'
import params from '../views/home/goods/params'
import lists from '../views/home/goods/lists'
import add from '../views/home/goods/add'
import orders from '../views/home/orders'
import report from '../views/home/report'

Vue.use(Router)

const router = new Router({
  routes: [{
      path: '/login',
      component: login
    },
    {
      path: '/',
      redirect: '/home/welcome'
    },
    {
      path: '/home',
      component: home,
      redirect: '/home/welcome',
      children: [{
          path: '/home/welcome',
          component: welcome
        },
        {
          path: '/users',
          component: users
        },
        {
          path: '/rights',
          component: rights
        },
        {
          path: '/roles',
          component: roles
        },
        {
          path: '/categories',
          component: categories
        },
        {
          path: '/params',
          component: params
        },
        {
          path: '/goods',
          component: lists
        },
        {
          path: '/goods/add',
          component: add
        },
        {
          path: '/orders',
          component: orders
        },
        {
          path: '/reports',
          component: report
        }
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  const tokenStr = sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next();
})

export default router
