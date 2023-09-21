import axios from 'axios'

import { AuthToken, RefreshToken, getCookie, setCookie } from '../../util/cookie'
import { renewAccessToken } from '../manager/adminUserHandler'

import router from '../../router'

export const getAccessToken = () => `Bearer ${getCookie(AuthToken)}`

// 是否正在刷新
let isRefreshing = false
// 重新嘗試的列隊
const requests: any[] = []

export const Axios = axios.create({
  baseURL: '',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': getAccessToken(),
  },
})

// 此處的 customAxios 為我們create的實體
Axios.interceptors.response.use(
  (response) => {
    // 成功就是成功，不需要多作處理
    return response
  },
  async (error) => {
    // 403 為 token 過期，會將使用者踢回登陸頁
    if (error.response && (error.response.status === 403 || error.response.status === 401)) {
      const token = getCookie(RefreshToken)
      if (!token)
        throw new Error('unauthorized token')
      const config = error.config
      if (!isRefreshing) {
        isRefreshing = true

        return renewAccessToken(token)
          .then((res) => {
            // refresh Token 會拿到最新的 token
            const token = res.access_token

            const config = error.config

            Axios.defaults.headers.Authorization = `Bearer ${token}`
            setCookie(AuthToken, token)

            requests.forEach(cb => cb(token))

            config.headers = {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            }
            // 更新完 token，再去執行一次原本要做的事
            return Axios(config)
          })
          .catch((error) => {
            console.error('Token error', error)
            // 刷新 token 仍失敗
            router.push({ name: 'Login' })
            // ElMessage({
            //   message: '驗證失敗，請重新登入',
            //   type: 'error',
            // })
          })
          .finally(() => {
            isRefreshing = false
          })
      }
      else {
        // 正在刷新 token，返回一個未執行 resolve 的 promise
        return new Promise((resolve) => {
          // 將 resolve 放進隊列，用一个函數形式來保存，等 token 刷新後直接執行
          requests.push((token: string) => {
            config.headers = {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            }
            resolve(Axios(config))
          })
        })
      }
    }

    return Promise.reject(error)
  },
)
