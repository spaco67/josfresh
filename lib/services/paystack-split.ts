import axios from 'axios';

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY!;

const paystackApi = axios.create({
  baseURL: 'https://api.paystack.co',
  headers: {
    Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
    'Content-Type': 'application/json',
  },
});

interface PaymentConfig {
  amount: number;
  email: string;
  reference: string;
  metadata?: any;
}

export async function initializePayment({
  amount,
  email,
  reference,
  metadata = {},
}: PaymentConfig) {
  try {
    const response = await paystackApi.post('/transaction/initialize', {
      amount: Math.round(amount * 100), // Convert to kobo
      email,
      reference,
      metadata,
      callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/marketplace/verify`,
    });

    return response.data;
  } catch (error) {
    console.error('Error initializing payment:', error);
    throw error;
  }
} 