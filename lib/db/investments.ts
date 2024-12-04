import { Db, ObjectId } from "mongodb";
import clientPromise from "../mongodb";
import { Investment, InvestmentTransaction } from "../models/investment";

let db: Db;

async function getDb() {
  if (!db) {
    const client = await clientPromise;
    db = client.db("josfresh");
  }
  return db;
}

export async function createInvestment(data: Omit<Investment, "createdAt" | "updatedAt">) {
  const db = await getDb();
  
  const investment = {
    ...data,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const result = await db.collection("investments").insertOne(investment);
  return { id: result.insertedId, ...investment };
}

export async function getInvestmentById(id: string) {
  const db = await getDb();
  return db.collection("investments").findOne({ _id: new ObjectId(id) });
}

export async function getInvestmentsByFarmer(farmerId: string) {
  const db = await getDb();
  return db.collection("investments")
    .find({ farmerId: new ObjectId(farmerId) })
    .toArray();
}

export async function getInvestmentsByInvestor(investorId: string) {
  const db = await getDb();
  const transactions = await db.collection("investment_transactions")
    .find({ investorId: new ObjectId(investorId) })
    .toArray();
    
  const investmentIds = transactions.map(t => t.investmentId);
  
  return db.collection("investments")
    .find({ _id: { $in: investmentIds } })
    .toArray();
}

export async function createInvestmentTransaction(data: Omit<InvestmentTransaction, "date">) {
  const db = await getDb();
  
  const transaction = {
    ...data,
    date: new Date()
  };

  const result = await db.collection("investment_transactions").insertOne(transaction);
  return { id: result.insertedId, ...transaction };
}

export async function getInvestmentTransactions(investmentId: string) {
  const db = await getDb();
  return db.collection("investment_transactions")
    .find({ investmentId: new ObjectId(investmentId) })
    .toArray();
}

export async function updateInvestmentStatus(id: string, status: Investment["status"]) {
  const db = await getDb();
  return db.collection("investments").updateOne(
    { _id: new ObjectId(id) },
    { 
      $set: { 
        status,
        updatedAt: new Date()
      } 
    }
  );
}