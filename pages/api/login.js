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
  const user = {
    id: 1,
    email: "user@example.com",
    passwordHash: "$2a$10$Zy/TYg6WwOOctCQ6e/KOXebvH3AliSDjdopPxrIUWELVJBf/KE.iq", // hashed password: "password123"
  }

  const isValid = await verifyPassword(password, user.passwordHash)

  if (!isValid) {
    return res.status(401).json({ message: "Invalid credentials" })
  }

  const token = await createTokens(user.id)

  res.setHeader("Set-Cookie", [
    `token=${token.accessToken};  Path=/; HttpOnly`,
    `rtoken=${token.refreshToken}; Path=/; HttpOnly`,
  ])

  return res.status(200).json({ token })
}

//user@example.com
//password123
