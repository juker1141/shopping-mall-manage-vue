import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'

import Dashboard from './views/Dashboard.vue'
import Forms from './views/Forms.vue'
import Tables from './views/Tables.vue'
import UIElements from './views/UIElements.vue'
import Login from './views/Login/Index.vue'
import Modal from './views/Modal.vue'
import Card from './views/Card.vue'
import Blank from './views/Blank.vue'

export type RouteMeta = Record<string | number | symbol, any>

declare module 'vue-router' {
  interface RouteMeta {
    pageTitle?: string
    layout?: string
    breadcrumb?: {
      [key: string]: string
    }
  }
}

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Login',
    component: Login,
    meta: { layout: 'empty' },
  },
  {
    path: '/news',
    name: 'News',
    component: Forms,
    meta: { pageTitle: '最新消息管理' },
  },
  {
    path: '/products',
    name: 'Products',
    component: Forms,
    meta: { pageTitle: '商品管理' },
  },
  {
    path: '/orders',
    name: 'Orders',
    component: Forms,
    meta: { pageTitle: '訂單管理' },
  },
  {
    path: '/coupons',
    name: 'Coupons',
    component: Forms,
    meta: { pageTitle: '優惠卷管理' },
  },
  {
    path: '/members',
    name: 'Members',
    component: Forms,
    meta: { pageTitle: '會員管理' },
  },
  {
    path: '/manager',
    name: 'Manager',
    component: () => import('./views/Manager/Index.vue'),
    meta: { pageTitle: '帳號管理' },
    children: [
      {
        path: 'accounts',
        name: 'AccountsLayout',
        component: () => import('./views/Manager/Accounts/Index.vue'),
        meta: { pageTitle: '帳號管理' },
        children: [
          {
            path: '',
            name: 'AccountsList',
            component: () => import('./views/Manager/Accounts/Table.vue'),
            meta: { pageTitle: '帳號列表' },
          },
        ],
      },
      {
        path: 'roles',
        name: 'Roles',
        component: Dashboard,
        meta: { pageTitle: '角色列表' },
        children: [
          {
            path: '',
            name: 'Roles',
            component: Dashboard,
            meta: { pageTitle: '角色列表' },
          },
          {
            path: 'add',
            name: 'Roles',
            component: Dashboard,
            meta: { pageTitle: '角色列表新增' },
          },
          {
            path: 'add',
            name: 'Roles',
            component: Dashboard,
            meta: { pageTitle: '角色列表修改' },
          },
          {
            path: 'add',
            name: 'Roles',
            component: Dashboard,
            meta: { pageTitle: '角色列表刪除' },
          },
        ],
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

router.afterEach((to) => {
  if (to.meta.pageTitle)
    document.title = to.meta.pageTitle

  const breadcrumb: {
    [key: string]: any
  } = {}
  to.matched.forEach((item) => {
    let path = item.path
    if (item.path === '/manager')
      path = '/manager/accounts'
    // if (item.path.includes('/app-version/:appType'))
    //   path = `/app-version/${to.params.appType}`
    if (item.meta.pageTitle)
      breadcrumb[item.meta.pageTitle] = path
  })

  const length = Object.keys(breadcrumb).length
  to.meta.breadcrumb = length > 1 ? breadcrumb : {}
})

export default router
