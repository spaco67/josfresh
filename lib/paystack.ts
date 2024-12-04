import { PaystackOptions } from '@paystack/inline-js';
import axios from 'axios';

export const PAYSTACK_PUBLIC_KEY = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY!;
export const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY!;

export function getPaystackConfig(
  amount: number,
  email: string,
  metadata: any = {},
  callback?: (response: any) => void,
  onClose?: () => void
): PaystackOptions {
  return {
    key: PAYSTACK_PUBLIC_KEY,
    email,
    amount: Math.round(amount * 100), // Convert to kobo
    currency: 'NGN',
    metadata: {
      ...metadata,
      custom_fields: [
        {
          display_name: "Payment For",
          variable_name: "payment_for",
          value: metadata.type || "purchase"
        }
      ]
    },
    callback,
    onClose
  };
}

export async function verifyPaystackPayment(reference: string) {
  try {
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Paystack verification error:', error);
    return null;
  }
}

export async function initializePayment(email: string, amount: number) {
  try {
    const response = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        amount: amount * 100, // Convert to kobo
        callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/wallet/verify`,
      }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Paystack initialization error:', error);
    throw error;
  }
}

export async function verifyPayment(reference: string) {
  try {
    const response = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Paystack verification error:', error);
    throw error;
  }
}