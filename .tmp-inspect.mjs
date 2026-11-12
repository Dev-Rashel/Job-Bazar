import fs from "node:fs"
import { MongoClient, ObjectId } from "mongodb"

const env = Object.fromEntries(
  fs
    .readFileSync(".env", "utf8")
    .split(/\r?\n/)
    .map((line) => line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)$/))
    .filter(Boolean)
    .map(([, key, value]) => [key, value.trim().replace(/^["']|["']$/g, "")])
)

const client = new MongoClient(env.MONGODB_URI)
await client.connect()
const db = client.db("hireloop")
const user = await db.collection("user").findOne({ email: "rashelmahmudnoyon@gmail.com" })

if (!user) {
  console.log("admin user not found")
} else {
  const oid = new ObjectId(user._id.toString())
  const accounts = await db
    .collection("account")
    .find({ $or: [{ userId: oid }, { userId: user.id }] })
    .toArray()
  console.log("user._id type:", typeof user._id, "| user.id:", user.id)
  console.log("accounts:", accounts.length)
  for (const account of accounts) {
    console.log("- providerId:", account.providerId, "| userId type:", typeof account.userId, "| keys:", Object.keys(account).join(","))
  }
}

await client.close()
