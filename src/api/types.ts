export type ApiActionText = '新增' | '更改' | '刪除'

export interface ApiDeleteResponse {
  message: string
}

export interface ApiParams {
  url: string
  body?: {
    params?: any
    [key: string]: any
  }
}
