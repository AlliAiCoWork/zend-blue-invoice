'use client';

import { useEffect, useState } from 'react';
import type { Invoice, PaymentMethod } from '@/types/invoice';

interface DashboardInvoice {
  id: string;
  invoiceNumber: string;
  status: string;
  baseTotal: number;
  adjustedTotal: number;
  dueDate: string | Date;
  customer: {
    name: string;
    email: string;
  };
  lineItems: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;
}

const HELCIM_PURPLE = '#815af0';

export default function ZendBlueDashboard() {
  const [invoices, setInvoices] = useState<DashboardInvoice[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<DashboardInvoice | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null);
  const [adjustedTotal, setAdjustedTotal] = useState<number>(0);
  const [processingFee, setProcessingFee] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Fetch invoices on mount
  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const res = await fetch('/api/invoice');
      const data = await res.json();
      setInvoices(data.invoices || []);
    } catch (error) {
      console.error('Failed to fetch invoices:', error);
    }
  };

  const handlePaymentMethodSelect = async (method: PaymentMethod) => {
    if (!selectedInvoice) return;

    setLoading(true);
    setMessage('Processing payment method...');

    try {
      const res = await fetch('/api/invoice/select-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          invoiceId: selectedInvoice.id,
          paymentMethod: method,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setSelectedPaymentMethod(method);
        setAdjustedTotal(data.paymentSelection.adjustedTotal);
        setProcessingFee(data.paymentSelection.processingFee);
        setMessage(`Ready to pay $${data.paymentSelection.adjustedTotal.toFixed(2)} via ${method}`);

        // Redirect to payment link after 2 seconds
        if (data.paymentSelection.paymentLink) {
          setTimeout(() => {
            window.location.href = data.paymentSelection.paymentLink;
          }, 2000);
        }
      } else {
        setMessage('Error processing payment method. Please try again.');
      }
    } catch (error) {
      console.error('Failed to select payment method:', error);
      setMessage('Error processing payment method. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const paymentMethods: PaymentMethod[] = [
    'debit',
    'credit',
    'premium',
    'zelle',
    'venmo',
    'paypal',
  ];

  const getPaymentMethodInfo = (method: string) => {
    const methodMap: Record<string, { icon: string; label: string; color: string }> = {
      debit: { icon: '🏧', label: 'Debit Card', color: 'from-blue-500 to-cyan-500' },
      credit: { icon: '💳', label: 'Credit Card', color: 'from-purple-500 to-pink-500' },
      premium: { icon: '✨', label: 'Premium Card', color: 'from-yellow-500 to-orange-500' },
      zelle: { icon: '🏦', label: 'Zelle', color: 'from-green-500 to-emerald-500' },
      venmo: { icon: '📱', label: 'Venmo', color: 'from-blue-600 to-blue-400' },
      paypal: { icon: '🅿️', label: 'PayPal', color: 'from-amber-500 to-orange-500' },
      other: { icon: '💰', label: 'Other', color: 'from-slate-500 to-gray-500' },
    };
    return methodMap[method] || { icon: '💳', label: method, color: 'from-purple-500 to-indigo-500' };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-purple-50 to-purple-100 p-8">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        * { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
      `}</style>

      <div className="max-w-7xl mx-auto">
        {/* Header with Logo */}
        <div className="mb-12 flex justify-between items-center">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg" style={{ background: `linear-gradient(135deg, ${HELCIM_PURPLE}, #6d42d6)` }}></div>
              <h1 className="text-4xl font-800" style={{ color: HELCIM_PURPLE }}>Zend Blue</h1>
            </div>
            <p className="text-gray-600 text-sm font-500 ml-1">Invoicing & Payments</p>
          </div>
          <div className="text-right">
            <p className="text-gray-500 text-xs">Powered by Helcim</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Invoices List - Refined */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-8">
              <h2 className="text-lg font-700 text-gray-900 mb-6">Active Invoices</h2>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {invoices.length === 0 ? (
                  <p className="text-gray-500 text-sm">No invoices yet</p>
                ) : (
                  invoices.map((invoice) => (
                    <button
                      key={invoice.id}
                      onClick={() => {
                        setSelectedInvoice(invoice);
                        setSelectedPaymentMethod(null);
                        setAdjustedTotal(invoice.baseTotal);
                        setProcessingFee(0);
                        setMessage('');
                      }}
                      className="w-full text-left p-4 rounded-xl transition-all duration-200 border-2"
                      style={{
                        backgroundColor: selectedInvoice?.id === invoice.id ? `${HELCIM_PURPLE}15` : '#f9fafb',
                        borderColor: selectedInvoice?.id === invoice.id ? HELCIM_PURPLE : '#e5e7eb',
                      }}
                    >
                      <div className="font-600 text-sm text-gray-900">
                        {invoice.invoiceNumber}
                      </div>
                      <div className="text-xs text-gray-600 mt-1">
                        {invoice.customer.name}
                      </div>
                      <div className="text-sm font-700 mt-2" style={{ color: HELCIM_PURPLE }}>
                        ${invoice.baseTotal.toFixed(2)}
                      </div>
                      <span
                        className="inline-block text-xs px-2.5 py-1.5 rounded-full font-500 mt-2"
                        style={{
                          backgroundColor:
                            invoice.status === 'paid' ? '#dcfce7' :
                            invoice.status === 'overdue' ? '#fee2e2' :
                            `${HELCIM_PURPLE}20`,
                          color:
                            invoice.status === 'paid' ? '#166534' :
                            invoice.status === 'overdue' ? '#991b1b' :
                            HELCIM_PURPLE,
                        }}
                      >
                        {invoice.status}
                      </span>
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Invoice Details & Payment - Premium */}
          <div className="lg:col-span-3 space-y-8">
            {selectedInvoice ? (
              <>
                {/* Invoice Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <h2 className="text-3xl font-800 text-gray-900 mb-1">
                        {selectedInvoice.invoiceNumber}
                      </h2>
                      <p className="text-gray-600 font-500">
                        {selectedInvoice.customer.name}
                      </p>
                    </div>
                    <span
                      className="px-5 py-2 rounded-full text-sm font-600"
                      style={{
                        backgroundColor:
                          selectedInvoice.status === 'paid' ? '#dcfce7' :
                          selectedInvoice.status === 'overdue' ? '#fee2e2' :
                          `${HELCIM_PURPLE}20`,
                        color:
                          selectedInvoice.status === 'paid' ? '#166534' :
                          selectedInvoice.status === 'overdue' ? '#991b1b' :
                          HELCIM_PURPLE,
                      }}
                    >
                      {selectedInvoice.status.charAt(0).toUpperCase() + selectedInvoice.status.slice(1)}
                    </span>
                  </div>

                  {/* Line Items */}
                  <div className="mb-8 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-gray-700 border-b border-gray-200">
                          <th className="text-left py-3 font-600">Description</th>
                          <th className="text-right py-3 font-600 w-16">Qty</th>
                          <th className="text-right py-3 font-600 w-24">Price</th>
                          <th className="text-right py-3 font-600 w-24">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedInvoice.lineItems.map((item, idx) => (
                          <tr key={idx} className="text-gray-900 border-b border-gray-200">
                            <td className="py-3 font-500">{item.description}</td>
                            <td className="text-right">{item.quantity}</td>
                            <td className="text-right">
                              ${item.unitPrice.toFixed(2)}
                            </td>
                            <td className="text-right font-600">
                              ${item.total.toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {/* Totals */}
                    <div className="mt-6 space-y-3 text-sm border-t border-gray-200 pt-6">
                      <div className="flex justify-between text-gray-700">
                        <span className="font-500">Subtotal</span>
                        <span>${selectedInvoice.baseTotal.toFixed(2)}</span>
                      </div>
                      {processingFee > 0 && (
                        <div className="flex justify-between text-gray-700">
                          <span className="font-500">Processing Fee</span>
                          <span className="text-orange-600 font-600">
                            +${processingFee.toFixed(2)}
                          </span>
                        </div>
                      )}
                      <div
                        className="flex justify-between font-800 text-lg pt-3 border-t-2"
                        style={{ borderColor: HELCIM_PURPLE, color: HELCIM_PURPLE }}
                      >
                        <span>Total Due</span>
                        <span>${adjustedTotal.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-600 text-xs font-500">
                    Due: {new Date(selectedInvoice.dueDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>

                {/* Payment Method Selection - Premium */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                  <h3 className="text-2xl font-800 text-gray-900 mb-1">Select Payment Method</h3>
                  <p className="text-gray-600 text-sm mb-8">Choose how you\'d like to pay</p>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    {paymentMethods.map((method) => {
                      const info = getPaymentMethodInfo(method as string);
                      const isSelected = selectedPaymentMethod === method;
                      return (
                        <button
                          key={method}
                          onClick={() => handlePaymentMethodSelect(method)}
                          disabled={loading}
                          className={`p-5 rounded-xl font-600 transition-all duration-200 border-2 relative overflow-hidden group ${
                            isSelected
                              ? `bg-gradient-to-br ${info.color} text-white border-opacity-0 shadow-lg`
                              : 'bg-white text-gray-900 border-gray-200 hover:border-gray-300'
                          } disabled:opacity-50 disabled:cursor-not-allowed`}
                          style={!isSelected ? { borderColor: '#e5e7eb' } : {}}
                        >
                          <div className="absolute top-2 right-2 w-5 h-5 text-lg opacity-40 group-hover:opacity-60 transition-opacity">
                            {info.icon}
                          </div>
                          <div className="text-2xl mb-2">{info.icon}</div>
                          <div className="text-sm">{info.label}</div>
                        </button>
                      );
                    })}
                  </div>

                  <button
                    className="w-full p-4 rounded-xl font-600 transition-all duration-200 border-2 text-gray-700 border-gray-300 hover:bg-gray-50 bg-white"
                    onClick={() => {
                      setSelectedInvoice(null);
                      setSelectedPaymentMethod(null);
                      setMessage('');
                    }}
                  >
                    Other Payment Options
                  </button>

                  {message && (
                    <div
                      className={`mt-6 p-4 rounded-xl text-sm font-600 ${
                        message.includes('Error')
                          ? 'bg-red-50 text-red-700 border border-red-200'
                          : 'bg-green-50 text-green-700 border border-green-200'
                      }`}
                    >
                      {message}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-16 text-center border-2 border-dashed" style={{ borderColor: `${HELCIM_PURPLE}40` }}>
                <div className="text-4xl mb-4">📋</div>
                <p className="text-gray-600 font-500 text-lg">
                  Select an invoice to view details and pay
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
