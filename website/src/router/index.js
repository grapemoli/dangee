import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    },

    //*** THESE ARE MY ROUTES ***//
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },

    // TODO Uncomment these paths as they are made.
    /*
    {
      path: '/logout',
      name: 'logout',
      component: LogoutView
    },
    {
      path: '/marketplace',
      name: 'marketplace',
      component: MarketplaceView,
      children: [
        {
          path: '/sell',
          name: 'sell',
          component: SellView
        },
        {
          path: '/buy',
          name: 'buy',
          component: BuyView
        },
        {
          path: '/mint',
          name: 'mint',
          component: MintView
        }
      ]
    },
    {
      path: '/library',
      name: 'library',
      component: LibraryView
    }
    */
  ]
})

export default router
