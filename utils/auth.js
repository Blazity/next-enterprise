// utils/auth.js
import bcrypt from "bcryptjs"

import { jwtVerify, SignJWT } from "jose"

const secret = new TextEncoder().encode("Swe4g7c?UBm5Nrd96vhsVDtkyJFbqKMTm!TMw5BDRLtaCFAXNvbq?s4rGKQSZnUP")

///

async function generateToken(payload, expiresIn) {
  const algo = "HS256"
  const t = await new SignJWT(payload)
    .setProtectedHeader({ alg: algo })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(secret)

  console.log(t)
  return t
}

// Function to create both access and refresh tokens
export async function createTokens(userId) {
  const accessTokenPayload = {
    userId: userId,
    // exp: Math.floor(Date.now() / 1000) + (15 * 60), // Access token expires in 15 minutes
    // iss: 'your_issuer_here', // Replace with your actual issuer
    // aud: 'your_audience_here', // Replace with your actual audience
    purpose: "access", // Indicate the purpose of this token
  }

  const refreshTokenPayload = {
    userId: userId,
    // exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60), // Refresh token expires in 7 days
    // iss: 'your_issuer_here', // Replace with your actual issuer
    // aud: 'your_audience_here', // Replace with your actual audience
    purpose: "refresh", // Indicate the purpose of this token
  }

  const accessToken = await generateToken(accessTokenPayload, "15m") // 15 minutes expiry
  const refreshToken = await generateToken(refreshTokenPayload, "2d") // 2 days expiry

  return { accessToken, refreshToken }
}
///

export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(password, salt)
}

export const verifyPassword = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword)
}

export const issueAccessToken = async (userId) => {
  const algo = "HS256"
  const accessTokenPayload = {
    userId: userId,
    // exp: Math.floor(Date.now() / 1000) + (15 * 60), // Access token expires in 15 minutes
    // iss: 'your_issuer_here', // Replace with your actual issuer
    // aud: 'your_audience_here', // Replace with your actual audience
    purpose: "access", // Indicate the purpose of this token
  }

  const accessToken = await generateToken(accessTokenPayload, "15m") // 15 minutes expiry

  return accessToken
}

// This function verifies a refresh token using a shared secret key
export async function verifyRefreshToken(refreshToken) {
  try {
    // Verify the refresh token using the shared secret key

    const { payload, protectedHeader } = await jwtVerify(refreshToken, secret)
    console.log(payload)
    // Ensure the token has necessary fields and is not expired
    if (!payload.userId) {
      throw new Error("Invalid token format")
    }

    // Optionally, you can also check if the token is intended for refresh purposes only
    if (payload.purpose !== "refresh") {
      throw new Error("Invalid token purpose")
    }

    // Token is valid, return the decoded token
    return payload
  } catch (error) {
    console.log(error)
    throw new Error("Invalid refresh token")
  }
}

export async function refreshAccessToken(refreshToken) {
  try {
    const response = await fetch("http://localhost:3000/api/refreshtoken", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    })
    const data = await response.json()
    return data.accessToken
  } catch (error) {
    console.error("Error refreshing access token:", error)
    throw new Error("Failed to refresh access token")
  }
}
