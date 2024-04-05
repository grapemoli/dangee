import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import LoginView from '../views/LoginView.vue';
import LogoutView from '../views/LogoutView.vue';
import DashboardView from '../views/DashboardView.vue';
import MarketplaceView from '../views/MarketplaceView.vue';
import store from '../store/index.js'

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
      component: LoginView,
      beforeEnter: (to, from, next) => {
        // If the user is already logged in, reject the navigation.
        if (store.getters['isAuth']) {
          next('/');
        }
        else {
          next();
        }
      },
    },
    {
      path: '/logout',
      name: 'logout',
      component: LogoutView,
      beforeEnter: (to, from, next) => {
        // If the user is logged out, reject the navigation.
        if (store.getters['isAuth']) {
          next();
        }
        else {
          next('/');
        }
      },
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
    },
      // TODO uncomment these paths as they are made.
    {
      path: '/marketplace',
      name: 'marketplace',
      component: MarketplaceView
    }
      /*
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
      /*
    {
      path: '/library',
      name: 'library',
      component: LibraryView
    }
    */
  ]
});

export default router;
