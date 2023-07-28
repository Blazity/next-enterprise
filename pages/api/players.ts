import client from "../../lib/mongodb"

export default async function handler(req, res) {
  const db = client.db("SloppyFuckers")
  switch (req.method) {
    case "POST":
      const myPlayer = await db.collection("players").insertOne(JSON.parse(req.body))
      res.json(myPlayer)
      break
    case "GET":
      const allPlayers = await db.collection("players").find({}).toArray()
      res.json({ status: 200, data: allPlayers })
      break
  }
}
