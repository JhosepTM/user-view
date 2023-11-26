// Composables
import { createRouter, createWebHistory } from 'vue-router'
import UserCreateView from "@/views/users/UserCreateView.vue";
import UserView from "@/views/users/UserView.vue";
import About from "@/views/About.vue";
const routes = [
  {
    path: '/',
    component: () => import('@/views/Home.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('@/views/Home.vue'),
      },
    ],
  },
  {
    path: '/about',
    name: 'about',
    component: About
  },
  {
    path: '/users',
    name: 'users',
    component: UserView
  },
  {
    path: '/users/create',
    name: 'usersCreate',
    component: UserCreateView
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
