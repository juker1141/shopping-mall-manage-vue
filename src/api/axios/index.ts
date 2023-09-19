import axios from 'axios'

import { AuthToken, getCookie } from '../../util/cookie'

import router from '../../router'

export const getAccessToken = () => `Bearer ${getCookie(AuthToken)}`

export const customAxios = axios.create({
  baseURL: '',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': getAccessToken(),
  },
})

// 此處的 customAxios 為我們create的實體
customAxios.interceptors.response.use(
  (response) => {
    // 成功就是成功，不需要多作處理
    return response
  },
  (error) => {
    // 403 為 token 過期，會將使用者踢回登陸頁
    if (error.response && error.response.status === 403)
      router.push({ name: 'Login' })
      // ElMessage({
      //   message: '驗證失敗，請重新登入',
      //   type: 'error',
      // })

    return Promise.reject(error)
  },
)
