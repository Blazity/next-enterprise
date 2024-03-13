import { NextRequest, NextResponse } from "next/server"
import { refreshAccessToken } from "./utils/auth"
import { jwtVerify } from "jose"
const secretKey = new TextEncoder().encode("Swe4g7c?UBm5Nrd96vhsVDtkyJFbqKMTm!TMw5BDRLtaCFAXNvbq?s4rGKQSZnUP")

const verifyJWT = async (token) => {
  const { payload, protectedHeader } = await jwtVerify(token, secretKey)
  return payload
}

export default async function middleware(req, res) {
  // Extract token from request headers or cookies or wherever it's stored
  const token = req.cookies.get("token")


  if (!token || token.value == "") {
    if (req.url == "http://localhost:3000/login") {
    } else {
      return NextResponse.redirect(new URL("/login", req.url))
    }
  } else {
    if (req.url == "http://localhost:3000/login") {
      return NextResponse.redirect("http://localhost:3000/home")
    }
  }

  try {
    // Verify the token
    console.log("ASdasdasssssssssssss")
    console.log(token.value)
    const payload = await verifyJWT(token.value)

    // Attach the decoded user object to the request
    // req.user = decoded.user;
    //  return NextResponse.redirect(new URL( req.url, '/home'))
    // Validate if the user is the one that is present in cookie
  } catch (error) {
    if (error.name === "JWTExpired") {
      console.log(error)
      //delete the token from cookie
      console.log("deleting the token")
      //renew the token
      // console.log(req.cookies.get('rtoken'));

      const rtoken = req.cookies.get("rtoken")
      if (rtoken == undefined) {
        console.log("undefined")
      }
      console.log("defined")

      const newtoken = await refreshAccessToken(rtoken)
      if (newtoken == undefined) {
        const res = NextResponse.redirect(new URL("/login", req.url)) // creates an actual instance
        res.cookies.set("token", newtoken)
        return res
      }
      console.log("defined")
      const res = NextResponse.next() // creates an actual instance
      res.cookies.set("token", newtoken)
      return res
    }
    console.log(error)
    // Handle other JWT errors
    // return Response.json({ message: 'Unauthorized' }, { status: 401 });

    // const res = NextResponse.redirect(new URL( '/login',req.url))  // creates an actual instance
    // res.cookies.delete('token') // can be called on an instance
    // return res
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|sw.js|manifest.json|test.html|icon*|images/*).*)"],
}
