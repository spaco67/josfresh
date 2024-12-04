import { Db, ObjectId } from "mongodb";
import clientPromise from "../mongodb";
import { Payment } from "../models/payment";

let db: Db;

async function getDb() {
  if (!db) {
    const client = await clientPromise;
    db = client.db("josfresh");
  }
  return db;
}

export async function createPayment(data: Omit<Payment, "createdAt" | "updatedAt">) {
  const db = await getDb();
  
  const payment = {
    ...data,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const result = await db.collection("payments").insertOne(payment);
  return { id: result.insertedId, ...payment };
}

export async function updatePaymentStatus(id: string, status: Payment["status"]) {
  const db = await getDb();
  return db.collection("payments").updateOne(
    { _id: new ObjectId(id) },
    { 
      $set: { 
        status,
        updatedAt: new Date()
      } 
    }
  );
}

export async function getPaymentByReference(reference: string) {
  const db = await getDb();
  return db.collection("payments").findOne({ reference });
}

export async function getUserPayments(userId: string) {
  const db = await getDb();
  return db.collection("payments")
    .find({ userId: new ObjectId(userId) })
    .sort({ createdAt: -1 })
    .toArray();
}