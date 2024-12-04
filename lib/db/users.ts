import { hash } from "bcryptjs";
import clientPromise from "../mongodb";
import { Db } from "mongodb";

let db: Db;

async function getDb() {
  if (!db) {
    const client = await clientPromise;
    db = client.db("josfresh");
  }
  return db;
}

export async function createUser(userData: {
  email: string;
  password: string;
  name: string;
  role: "farmer" | "customer" | "admin";
  farmName?: string;
  location?: string;
  state?: string;
  lga?: string;
  phone?: string;
  description?: string;
}) {
  const db = await getDb();
  const existingUser = await db.collection("users").findOne({ email: userData.email });
  
  if (existingUser) {
    throw new Error("Email already exists");
  }

  const hashedPassword = await hash(userData.password, 12);
  
  const result = await db.collection("users").insertOne({
    ...userData,
    password: hashedPassword,
    createdAt: new Date(),
  });

  return { id: result.insertedId, ...userData };
}

export async function getUserByEmail(email: string) {
  const db = await getDb();
  return db.collection("users").findOne({ email });
}

export async function getUserById(id: string) {
  const db = await getDb();
  return db.collection("users").findOne({ _id: id });
}