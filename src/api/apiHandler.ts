import axios from 'axios'
import type { CookieKey } from '../util/cookie'
import { getCookie } from '../util/cookie'
import { Axios, getAccessToken } from './axios'

interface ApiParams {
  url: string
  body?: {
    params?: any
    [key: string]: any
  }
}

export function checkToken(key: CookieKey) {
  const token = getCookie(key)
  if (!token)
    throw new Error('auth token error')
  return token
}

const apiHandler = {
  Get: async ({ url, body }: ApiParams) => {
    const res = await Axios.get(url, {
      params: body?.params,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': getAccessToken(),
      },
    })
    return res
  },
  GetBlobFile: async ({ url, body }: ApiParams) => {
    const res = await Axios.get(url, {
      params: body?.params,
      headers: { Authorization: getAccessToken() },
      responseType: 'blob',
    })

    return res
  },
  Post: async ({ url, body }: ApiParams) => {
    const res = await Axios.post(url, body, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': getAccessToken(),
      },
    })
    return res
  },
  NoAuthPost: async ({ url, body }: ApiParams) => {
    const res = await axios.post(url, body, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    return res
  },
  FormPost: async ({ url, body }: ApiParams) => {
    const res = await Axios.post(url, body, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': getAccessToken(),
      },
    })
    return res
  },
  Patch: async ({ url, body }: ApiParams) => {
    const res = await Axios.patch(url, body, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': getAccessToken(),
      },
    })
    return res
  },
  Put: async ({ url, body }: ApiParams) => {
    const res = await Axios.put(url, body, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': getAccessToken(),
      },
    })
    return res
  },
  FormPut: async ({ url, body }: ApiParams) => {
    const res = await Axios.put(url, body, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': getAccessToken(),
      },
    })
    return res
  },
  Delete: async ({ url }: ApiParams) => {
    const res = await Axios.delete(url, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': getAccessToken(),
      },
    })
    return res
  },
}

export default apiHandler
