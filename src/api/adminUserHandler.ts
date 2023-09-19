export async function loginAdminUserHandler({ account, password }: LoginFormValue) {
  const options = {
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      account,
      password,
    }),
    method: 'POST',
  }

  const result = await fetch(`${import.meta.env.VITE_BACKEND_API_URL}/login`, options)
  return await result.json()
}
