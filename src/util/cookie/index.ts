import Cookies from 'js-cookie'

export const RememberAccount = 'REMEMBER_ACCOUNT'
export const AuthToken = 'AUTH_TOKEN'
export const RefreshToken = 'REFRESH_TOKEN'

export type CookieKey = typeof RememberAccount | typeof AuthToken | typeof RefreshToken

export const getCookie = (key: CookieKey) => Cookies.get(key)

export const removeCookie = (key: CookieKey) => Cookies.remove(key)

export function setCookie(key: CookieKey, value: string) {
  return Cookies.set(key, value, { expires: 7 })
}
