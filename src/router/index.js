import Vue from 'vue'
import Router from 'vue-router'
import login from '../views/login'
import home from '../views/home'
import welcome from '../views/home/welcome'
import users from '../views/home/users'

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
