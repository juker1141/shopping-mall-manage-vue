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
import DashboardLayout from '@/components/DashboardLayout.vue'
import type { routeType } from '@/util/route'

export type RouteMeta = Record<string | number | symbol, any>

declare module 'vue-router' {
  interface RouteMeta {
    pageTitle?: string
    type?: routeType
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
  },
  {
    path: '/admin',
    name: 'AdminLayout',
    component: DashboardLayout,
    children: [
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
            name: 'AccountLayout',
            component: () => import('./views/Manager/Accounts/Index.vue'),
            meta: { pageTitle: '帳號列表', type: 'layout' },
            children: [
              {
                path: '',
                name: 'AccountList',
                component: () => import('./views/Manager/Accounts/Table.vue'),
                meta: { pageTitle: '帳號列表', type: 'list' },
              },
              {
                path: 'add',
                name: 'AccountAdd',
                component: () => import('./views/Manager/Accounts/Form.vue'),
                meta: { pageTitle: '新增帳號', type: 'add' },
              },
              {
                path: 'edit/:id',
                name: 'AccountEdit',
                component: () => import('./views/Manager/Accounts/Form.vue'),
                meta: { pageTitle: '更改帳號', type: 'edit' },
              },
              {
                path: 'delete/:id',
                name: 'AccountDelete',
                component: () => import('./views/Manager/Accounts/Form.vue'),
                meta: { pageTitle: '刪除帳號', type: 'delete' },
              },
            ],
          },
          {
            path: 'roles',
            name: 'RoleLayout',
            component: () => import('./views/Manager/Roles/Index.vue'),
            meta: { pageTitle: '角色列表', type: 'layout' },
            children: [
              {
                path: '',
                name: 'RoleList',
                component: () => import('./views/Manager/Roles/Table.vue'),
                meta: { pageTitle: '角色列表', type: 'list' },
              },
              {
                path: 'add',
                name: 'RoleAdd',
                component: () => import('./views/Manager/Roles/Form.vue'),
                meta: { pageTitle: '新增角色', type: 'add' },
              },
              {
                path: 'edit/:id',
                name: 'RoleEdit',
                component: () => import('./views/Manager/Roles/Form.vue'),
                meta: { pageTitle: '修改角色', type: 'edit' },
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
    ],
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
