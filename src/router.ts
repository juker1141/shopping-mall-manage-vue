import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'

import Dashboard from './views/Dashboard.vue'
import Forms from './views/Forms.vue'
import Tables from './views/Tables.vue'
import UIElements from './views/UIElements.vue'
import Login from './views/Login.vue'
import Modal from './views/Modal.vue'
import Card from './views/Card.vue'
import Blank from './views/Blank.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Login',
    component: Login,
    meta: { layout: 'empty' },
  },
  {
    path: '/products',
    name: 'Products',
    component: Forms,
    meta: { title: '商品管理' },
  },
  {
    path: '/orders',
    name: 'Orders',
    component: Forms,
    meta: { title: '訂單管理' },
  },
  {
    path: '/coupons',
    name: 'Coupons',
    component: Forms,
    meta: { title: '優惠卷管理' },
  },
  {
    path: '/members',
    name: 'Members',
    component: Forms,
    meta: { title: '會員管理' },
  },
  {
    path: '/account',
    name: 'Account',
    component: Dashboard,
    meta: { title: '帳號管理' },
    children: [
      {
        path: 'admin-users',
        name: 'AdminUsers',
        component: Dashboard,
        meta: { title: '帳號列表' },
      },
      {
        path: 'roles',
        name: 'Roles',
        component: Dashboard,
        meta: { title: '角色列表' },
      },
    ],
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
  },
  {
    path: '/forms',
    name: 'Forms',
    component: Forms,
  },
  {
    path: '/cards',
    name: 'Cards',
    component: Card,
  },
  {
    path: '/tables',
    name: 'Tables',
    component: Tables,
  },
  {
    path: '/ui-elements',
    name: 'UIElements',
    component: UIElements,
  },
  {
    path: '/modal',
    name: 'Modal',
    component: Modal,
  },
  {
    path: '/blank',
    name: 'Blank',
    component: Blank,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
