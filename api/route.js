// export const dynamic = 'force-dynamic' // defaults to auto
// export async function GET(request) {}
export default async function handler(req, res) {
  const session = await getSession(req)

  // Check if the user is authenticated
  if (!session) {
    res.status(401).json({
      error: "User is not authenticated",
    })
    return
  }
  console.log("_____________________________________________")
  // Proceed with the route for authorized users
  // ... implementation of the API Route
}
