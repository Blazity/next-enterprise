import client from "../../lib/mongodb"

export default async function handler(req, res) {
  const db = client.db("SloppyFuckers")
  switch (req.method) {
    case "POST":
      let bodyObject = JSON.parse(req.body)
      let myPost = await db.collection("players").insertOne(bodyObject)
      res.json(myPost.ops[0])
      break
    case "GET":
      const allPosts = await db.collection("players").find({}).toArray()
      res.json({ status: 200, data: allPosts })
      break
  }
}
