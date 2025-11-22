import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import MenuView from '../views/MenuView.vue'
import AboutView from '../views/AboutView.vue'
import ProductDetailView from '../views/ProductDetailView.vue'
import NotFoundView from '../views/NotFoundView.vue'
import SignInView from '../views/auth/SignInView.vue'
import SignUpView from '../views/auth/SignUpView.vue'
import ForgotPasswordView from '../views/auth/ForgotPasswordView.vue'
import CheckEmailView from '../views/auth/CheckEmailView.vue'
import ChangePasswordView from '../views/auth/ChangePasswordView.vue'
import ActivateView from '../views/auth/ActivateView.vue'
import ResetPasswordView from '../views/auth/ResetPasswordView.vue'
import SignUpCheckEmailView from '../views/auth/SignUpCheckEmailView.vue'
import DeleteAccountView from '../views/auth/DeleteAccountView.vue'
import ServerErrorView from '../views/ServerErrorView.vue'
import CartView from '../views/CartView.vue'
import FavoritesView from '../views/FavoritesView.vue'
import SearchView from '../views/SearchView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: HomeView,
    },
    {
      path: '/menu',
      name: 'Menu',
      component: MenuView,
    },
    {
      path: '/product/:id',
      name: 'ProductDetail',
      component: ProductDetailView,
      props: true,
    },
    {
      path: '/about',
      name: 'About',
      component: AboutView,
    },
    {
      path: '/auth/signin',
      name: 'SignIn',
      component: SignInView,
    },
    {
      path: '/auth/signup',
      name: 'SignUp',
      component: SignUpView,
    },
    {
      path: '/auth/signup/check-email',
      name: 'SignUpCheckEmail',
      component: SignUpCheckEmailView,
    },
    {
      path: '/auth/forgot-password',
      name: 'ForgotPassword',
      component: ForgotPasswordView,
    },
    {
      path: '/auth/forgot-password/:uid/:token',
      name: 'ResetPassword',
      component: ResetPasswordView,
      props: true,
    },
    {
      path: '/auth/check-email',
      name: 'CheckEmail',
      component: CheckEmailView,
    },
    {
      path: '/auth/change-password',
      name: 'ChangePassword',
      component: ChangePasswordView,
    },
    {
      path: '/auth/activate/:uid/:token',
      name: 'Activate',
      component: ActivateView,
      props: true,
    },
    {
      path: '/auth/delete-account',
      name: 'DeleteAccount',
      component: DeleteAccountView,
    },
    {
      path: '/server-error',
      name: 'ServerError',
      component: ServerErrorView,
    },
    {
      path: '/profile',
      name: 'Profile',
      component: () => import('../views/ProfileView.vue'),
    },
    {
      path: '/order_history/:status?',
      name: 'OrderHistory',
      component: () => import('../views/OrderHistoryView.vue'),
      props: true,
    },
    {
      path: '/setting',
      name: 'Setting',
      component: () => import('../views/SettingView.vue'),
    },
    {
      path: '/cart',
      name: 'Cart',
      component: CartView,
    },
    {
      path: '/favorites',
      name: 'Favorites',
      component: FavoritesView,
    },
    {
      path: '/search',
      name: 'Search',
      component: SearchView,
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: NotFoundView,
    },
  ],
})

export default router
