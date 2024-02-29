import { issueAccessToken, verifyRefreshToken } from "../../utils/auth"

// Example middleware to attach access token to outgoing requests
async function attachAccessToken(req, res, next) {
  const accessToken = req.cookies.accessToken
  if (!accessToken) {
    return res.status(401).json({ message: "Access token missing" })
  }

  // You might want to check token expiration here and refresh if necessary

  req.headers.Authorization = `Bearer ${accessToken}`
  next()
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" })
  }

  const { refreshToken } = req.body

  try {
    const decoded = await verifyRefreshToken(refreshToken.value)
    // Check if refresh token is valid, then issue a new access token
    const accessToken = await issueAccessToken(decoded.userId)
    console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
    res.setHeader("Set-Cookie", [`token=${accessToken};  Path=/; HttpOnly`])

    return res.status(200).json({ accessToken })
  } catch (error) {
    console.error("Error refreshing token:", error)
    return res.status(401).json({ message: "Invalid refresh token" })
  }
}
