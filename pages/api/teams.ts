import client from "../../lib/mongodb"

export default async function handler(req, res) {
  const db = client.db("SloppyFuckers")
  switch (req.method) {
    case "POST":
      const myEvent = await db.collection("teams").insertOne(JSON.parse(req.body))
      res.json(myEvent)
      break
    case "GET":
      const allEvents = await db.collection("teams").find({}).toArray()
      res.json({ status: 200, data: allEvents })
      break
  }
}
