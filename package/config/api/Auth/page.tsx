import { BASE_URL_AUTHENTICATION } from "@package/config/ApiPath"
import { FetchData } from "@package/config/FetchData"

async function auth(ae_user: string, ae_password: string): Promise<string> {
  const options: RequestInit = {
    method: "POST",
    mode: 'cors',
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: ae_user,
      password: ae_password,
    }),
  }

  const data = await FetchData<{ token: string }>(BASE_URL_AUTHENTICATION, "login", options)

  console.log(data)
  if (data.correct) {
    if (data.object) {
      return data.object.token
    } else {
      console.error("Error: data.object is null or undefined")
      return "error en la autenticación"
    }
  } else {
    console.error("Error en la autenticación:", data.message)
    return "error en la autenticación, mensaje: " + data.message
  }
}

export { auth }
