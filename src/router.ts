import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'

import Login from './views/Login/Index.vue'
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
        path: '/home',
        name: 'Dashboard',
        component: () => import('./views/Dashboard/index.vue'),
        meta: { pageTitle: '首頁' },
      },
      // {
      //   path: '/news',
      //   name: 'News',
      //   component: Forms,
      //   meta: { pageTitle: '最新消息管理' },
      // },
      {
        path: '/products',
        name: 'ProductsLayout',
        component: () => import('./views/Products/Index.vue'),
        meta: { pageTitle: '商品管理' },
        children: [
          {
            path: '',
            name: 'ProductList',
            component: () => import('./views/Products/Table.vue'),
            meta: { pageTitle: '商品列表', type: 'list' },
          },
          {
            path: 'add',
            name: 'ProductAdd',
            component: () => import('./views/Products/Form.vue'),
            meta: { pageTitle: '新增商品', type: 'add' },
          },
          {
            path: 'edit/:id',
            name: 'ProductEdit',
            component: () => import('./views/Products/Form.vue'),
            meta: { pageTitle: '更改商品', type: 'edit' },
          },
          {
            path: 'delete/:id',
            name: 'ProductDelete',
            component: () => import('./views/Products/Form.vue'),
            meta: { pageTitle: '刪除商品', type: 'delete' },
          },
        ],
      },
      {
        path: '/orders',
        name: 'OrdersLayout',
        component: () => import('./views/Orders/Index.vue'),
        meta: { pageTitle: '訂單管理' },
        children: [
          {
            path: '',
            name: 'OrderList',
            component: () => import('./views/Orders/Table.vue'),
            meta: { pageTitle: '訂單列表', type: 'list' },
          },
          {
            path: 'detail/:id',
            name: 'OrderDetail',
            component: () => import('./views/Orders/Detail.vue'),
            meta: { pageTitle: '訂單內容', type: 'detail' },
          },
        ],
      },
      {
        path: '/coupons',
        name: 'CouponsLayout',
        component: () => import('./views/Coupons/Index.vue'),
        meta: { pageTitle: '優惠卷管理' },
        children: [
          {
            path: '',
            name: 'CouponList',
            component: () => import('./views/Coupons/Table.vue'),
            meta: { pageTitle: '優惠卷列表', type: 'list' },
          },
          {
            path: 'add',
            name: 'CouponAdd',
            component: () => import('./views/Coupons/Form.vue'),
            meta: { pageTitle: '新增優惠卷', type: 'add' },
          },
          {
            path: 'edit/:id',
            name: 'CouponEdit',
            component: () => import('./views/Coupons/Form.vue'),
            meta: { pageTitle: '更改優惠卷', type: 'edit' },
          },
          {
            path: 'delete/:id',
            name: 'CouponDelete',
            component: () => import('./views/Coupons/Form.vue'),
            meta: { pageTitle: '刪除優惠卷', type: 'delete' },
          },
        ],
      },
      {
        path: '/members',
        name: 'MemberLayout',
        component: () => import('./views/Members/Index.vue'),
        meta: { pageTitle: '會員管理' },
        children: [
          {
            path: '',
            name: 'MemberList',
            component: () => import('./views/Members/Table.vue'),
            meta: { pageTitle: '會員列表', type: 'list' },
          },
          {
            path: 'edit/:id',
            name: 'MemberEdit',
            component: () => import('./views/Members/Form.vue'),
            meta: { pageTitle: '更改會員', type: 'edit' },
          },
          {
            path: 'delete/:id',
            name: 'MemberDelete',
            component: () => import('./views/Members/Form.vue'),
            meta: { pageTitle: '刪除會員', type: 'delete' },
          },
        ],
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
      // {
      //   path: '/dashboard',
      //   name: 'Dashboard',
      //   component: Dashboard,
      // },
      // {
      //   path: '/forms',
      //   name: 'Forms',
      //   component: Forms,
      // },
      // {
      //   path: '/cards',
      //   name: 'Cards',
      //   component: Card,
      // },
      // {
      //   path: '/tables',
      //   name: 'Tables',
      //   component: Tables,
      // },
      // {
      //   path: '/ui-elements',
      //   name: 'UIElements',
      //   component: UIElements,
      // },
      // {
      //   path: '/modal',
      //   name: 'Modal',
      //   component: Modal,
      // },
      // {
      //   path: '/blank',
      //   name: 'Blank',
      //   component: Blank,
      // },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_BASE_URL),
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
