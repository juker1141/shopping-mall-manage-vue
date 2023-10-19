import type { AxiosResponse } from 'axios'
import apiHandler from '@/api/apiHandler'
import type { ApiDeleteResponse } from '@/api/types'
import type { GetProductsResponse, ProductForm, ProductResponse } from '@/api/product/types'

export async function getProducts(page: number, page_size = 10): Promise<GetProductsResponse> {
  const url = `${import.meta.env.VITE_BACKEND_HOST}/admin/products`

  const body = {
    params: {
      page,
      page_size,
    },
  }

  const res: AxiosResponse<GetProductsResponse> = await apiHandler.Get({
    url,
    body,
  })
  return res.data
}

export async function getProduct(id: string): Promise<ProductResponse> {
  const url = `${import.meta.env.VITE_BACKEND_HOST}/admin/product/${id}`

  const body = {}

  const res: AxiosResponse<ProductResponse> = await apiHandler.Get({
    url,
    body,
  })
  return res.data
}

export async function createProduct(form: ProductForm): Promise<ProductResponse> {
  const url = `${import.meta.env.VITE_BACKEND_HOST}/admin/product`

  const body = new FormData()

  Object.keys(form).forEach((key) => {
    console.log(form[key], key)
    if (key === 'image_file' && form[key].length > 0) {
      body.append(key, form[key][0])
    }

    else if (key === 'status') {
      body.append(key, form[key].toString())
    }

    else if (form[key].length > 0 || form[key] > 0) {
      console.log(form[key])
      body.append(key, form[key].toString())
    }
  })
  console.log(body)

  const res: AxiosResponse<ProductResponse> = await apiHandler.FormPost({
    url,
    body,
  })
  return res.data
}

export async function updateProduct(form: ProductForm, id: string): Promise<ProductResponse> {
  const url = `${import.meta.env.VITE_BACKEND_HOST}/admin/product/${id}`

  const body = new FormData()

  Object.keys(form).forEach((key) => {
    if (key === 'image_file' && form[key].length > 0)
      body.append(key, form[key][0])

    else if (form[key].length > 0 || form[key] > 0)
      body.append(key, form[key])
  })

  if (form.image_file && form.image_url.length > 0)
    body.delete('image_url')

  const res: AxiosResponse<ProductResponse> = await apiHandler.FormPatch({
    url,
    body,
  })
  return res.data
}

export async function updateProductStatus(status: number, id: number): Promise<ProductResponse> {
  const url = `${import.meta.env.VITE_BACKEND_HOST}/admin/product/${id}`

  const body = {
    status,
  }

  const res: AxiosResponse<ProductResponse> = await apiHandler.Patch({
    url,
    body,
  })
  return res.data
}

export async function deleteProduct(id: string): Promise<ApiDeleteResponse> {
  const url = `${import.meta.env.VITE_BACKEND_HOST}/admin/product/${id}`

  const body = {}

  const res: AxiosResponse<ApiDeleteResponse> = await apiHandler.Delete({
    url,
    body,
  })
  return res.data
}
