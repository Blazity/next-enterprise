import { createTokens, hashPassword, verifyPassword } from "../../utils/auth"

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" })
  }

  const { email, password } = req.body
  console.log(password)

  // You'd need to fetch user details from your database or any data source
  //fetch data from postgres database where we store password as hash

  // Here, for demonstration, let's assume a hardcoded user
  const response = await fetch(`http://localhost:3001/user`)
  const user_data = await response.json()

  const isValid = await verifyPassword(password, user_data.password)

  if (!isValid) {
    return res.status(401).json({ message: "Invalid credentials" })
  }

  const token = await createTokens(user_data.id)

  res.setHeader("Set-Cookie", [
    `token=${token.accessToken};  Path=/; HttpOnly`,
    `rtoken=${token.refreshToken}; Path=/; HttpOnly`,
  ])

  return res.status(200).json({ token })
}

//user@example.com
//password123
