/* eslint-disable @typescript-eslint/no-explicit-any */
// utils/xendit.ts
import axios, { AxiosInstance } from "axios";

const XENDIT_SECRET_KEY =
  "xnd_development_jydaSm7ruK3UHAtluPZPDfVUadjurStJHpSJ5EK6f5swoDPfKOh9YEnjINKq4Q2";
const XENDIT_API_URL = "https://api.xendit.co";

// Ensure API key exists
if (!XENDIT_SECRET_KEY) {
  throw new Error("XENDIT_SECRET_KEY is not set in environment variables.");
}

// Define payment data type
interface PaymentData {
  external_id: string;
  payer_email?: string;
  description: string;
  amount: number;
  currency?: string;
  success_redirect_url?: string;
  failure_redirect_url?: string;
}

// Create Axios client for Xendit
const xenditClient: AxiosInstance = axios.create({
  baseURL: XENDIT_API_URL,
  auth: {
    username: XENDIT_SECRET_KEY,
    password: "",
  },
});

/**
 * Create a payment invoice in Xendit.
 * @param paymentData - The payment details.
 * @returns The created invoice data.
 */
export const createPayment = async (paymentData: PaymentData) => {
  try {
    const response = await xenditClient.post("/v2/invoices", paymentData);
    return response.data;
  } catch (error: any) {
    console.error(
      "Error creating payment:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to create payment"
    );
  }
};

/**
 * Get the status of a payment invoice.
 * @param invoiceId - The invoice ID to fetch.
 * @returns The invoice status data.
 */
export const getPaymentStatus = async (invoiceId: string) => {
  try {
    const response = await xenditClient.get(`/v2/invoices/${invoiceId}`);
    return response.data;
  } catch (error: any) {
    console.error(
      "Error fetching payment status:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to fetch payment status"
    );
  }
};
