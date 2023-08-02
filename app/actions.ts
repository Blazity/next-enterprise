import client from "@/lib/mongodb";

export async function getTeamPlayers() {
    const db = client.db("SloppyFuckers")
    return  await db.collection("players").find({}).toArray();
}

export async function getEvents() {
    const db = client.db("SloppyFuckers")
    return  await db.collection("events").find({}).toArray();
}
