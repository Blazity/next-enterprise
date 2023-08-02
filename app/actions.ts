import client from "../lib/mongodb"

const db = client.db("portfolio")

export async function getProjects() {
  return await db.collection("projects").find({}).toArray()
}
