import axios from 'axios';

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY!;
const baseURL = 'https://api.paystack.co';

const paystackApi = axios.create({
  baseURL,
  headers: {
    Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
    'Content-Type': 'application/json',
  },
});

export interface PaystackTransaction {
  id: number;
  domain: string;
  status: string;
  reference: string;
  amount: number;
  message: string;
  gateway_response: string;
  paid_at: string;
  created_at: string;
  channel: string;
  currency: string;
  ip_address: string;
  metadata: any;
  customer: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    customer_code: string;
    phone: string;
    metadata: any;
    risk_action: string;
  };
}

export async function fetchPaystackTransactions(params: { 
  perPage?: number; 
  page?: number;
  from?: string;
  to?: string;
  status?: 'failed' | 'success' | 'abandoned';
}) {
  try {
    const response = await paystackApi.get('/transaction', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching Paystack transactions:', error);
    throw error;
  }
}

export async function fetchPaystackTransaction(reference: string) {
  try {
    const response = await paystackApi.get(`/transaction/verify/${reference}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching Paystack transaction:', error);
    throw error;
  }
} 