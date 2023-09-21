import type { AxiosError } from 'axios'
import axios from 'axios'
import { ElMessage } from 'element-plus'

import { AuthToken, RefreshToken, getCookie, removeLoginCookies, setCookie } from '@/util/cookie'
import router from '@/router'
import { refreshAccessToken } from '@/api/manager/adminUserHandler'

export const getAccessToken = () => `Bearer ${getCookie(AuthToken)}`

interface ApiError {
  error: string
}

export function getErrorMessage(err: AxiosError<ApiError>) {
  if (err.response)
    return err.response.data.error
}

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
    // 401 為 token 過期，會將使用者踢回登陸頁
    if (error.response && (error.response.status === 401)) {
      const token = getCookie(RefreshToken)
      if (!token)
        throw new Error('unauthorized token')
      const config = error.config
      if (!isRefreshing) {
        isRefreshing = true
        return refreshAccessToken(token)
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
          .catch(() => {
            // 刷新 token 仍失敗
            removeLoginCookies([AuthToken, RefreshToken])

            ElMessage({
              message: 'Token 驗證失敗，請重新登入',
              type: 'error',
            })
            router.push({ name: 'Login' })
          })
          .finally(() => {
            isRefreshing = false
          })
      }
      else {
        // 正在刷新 token，返回一個未執行 resolve 的 promise
        return new Promise((resolve) => {
          console.log('還會出現嗎')
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
