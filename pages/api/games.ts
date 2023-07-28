import client from "../../lib/mongodb"

export default async function handler(req, res) {
  const db = client.db("SloppyFuckers")
  switch (req.method) {
    case "POST":
      const myEvent = await db.collection("games").insertOne(JSON.parse(req.body))
      res.json(myEvent)
      break
    case "GET":
      const allEvents = await db.collection("games").find({}).toArray()
      res.json({ status: 200, data: allEvents })
      break
  }
}
