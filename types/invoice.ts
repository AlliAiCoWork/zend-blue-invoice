export type PaymentMethod = 'debit' | 'credit' | 'premium' | 'zelle' | 'venmo' | 'paypal' | 'other' | null;

export interface Invoice {
  id: string;
  invoiceNumber: string;
  status: 'draft' | 'sent' | 'viewed' | 'pending' | 'paid' | 'overdue' | 'cancelled';
  baseTotal: number;
  adjustedTotal: number;
  dueDate: Date | string;
  customer: {
    id: string;
    name: string;
    email: string;
    phone?: string;
  };
  lineItems: LineItem[];
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface PaymentSelection {
  id: string;
  invoiceId: string;
  selectedMethod: PaymentMethod;
  originalTotal: number;
  adjustedTotal: number;
  processingFee: number;
  discount: number;
  createdAt: Date;
}

export interface PaymentRecord {
  id: string;
  invoiceId: string;
  transactionId: string;
  amount: number;
  method: PaymentMethod;
  status: 'pending' | 'success' | 'failed';
  createdAt: Date;
}
