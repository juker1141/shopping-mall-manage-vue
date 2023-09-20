export const sideBarData = [
  {
    title: '最新消息管理',
    icon: ['fas', 'fa-newspaper'],
    path: '/news',
    style: 'default',
  },
  {
    title: '商品管理',
    icon: ['fas', 'fa-box'],
    path: '/products',
    style: 'default',
  },
  {
    title: '訂單管理',
    icon: ['fas', 'clipboard-list'],
    path: '/orders',
    style: 'default',
  },
  {
    title: '優惠卷管理',
    icon: ['fas', 'ticket'],
    path: '/coupons',
    style: 'default',
  },
  {
    title: '會員管理',
    icon: ['fas', 'users'],
    path: '/members',
    style: 'default',
  },
  {
    title: '後台帳號管理',
    icon: ['fas', 'user-gear'],
    path: '',
    style: 'list',
    child: [
      {
        title: '帳號列表',
        path: '/manager/accounts',
      },
      {
        title: '角色列表',
        path: '/manager/roles',
      },
    ],
  },
]
