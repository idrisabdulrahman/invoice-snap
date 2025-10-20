import { useState, useEffect, useCallback } from 'react';
import { pb } from '../lib/pocketbase';
import { useAuth } from './useAuth';
import toast from 'react-hot-toast';
import type { RecordModel } from 'pocketbase';

interface LineItem {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface Invoice extends RecordModel {
  invoiceNumber: string;
  clientName: string;
  clientEmail: string;
  clientAddress?: string;
  amount: number;
  currency: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  dueDate: string;
  lineItems: LineItem[];
  notes?: string;
  customization?: {
    template: string;
    primaryColor: string;
    showTax: boolean;
  };
  userId: string;
}

export function useInvoices() {
  const { user } = useAuth();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchInvoices = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    try {
      const records = await pb.collection('invoices').getFullList<Invoice>({
        filter: `userId = "${user.id}"`,
        sort: '-created',
      });
      setInvoices(records);
    } catch (error) {
      console.error('Failed to fetch invoices:', error);
      toast.error('Failed to load invoices');
    } finally {
      setLoading(false);
    }
  }, [user]);

  const createInvoice = async (invoiceData: Omit<Invoice, 'id' | 'userId' | 'created' | 'updated' | 'collectionId' | 'collectionName' | 'expand'>) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const newInvoice = await pb.collection('invoices').create<Invoice>({
        ...invoiceData,
        userId: user.id,
      });
      setInvoices(prev => [newInvoice, ...prev]);
      toast.success('Invoice created successfully');
      return newInvoice;
    } catch (error) {
      console.error('Failed to create invoice:', error);
      toast.error('Failed to create invoice');
      throw error;
    }
  };

  const updateInvoice = async (invoiceId: string, updates: Partial<Invoice>) => {
    try {
      const updatedInvoice = await pb.collection('invoices').update<Invoice>(invoiceId, updates);
      setInvoices(prev => prev.map(inv => inv.id === invoiceId ? updatedInvoice : inv));
      toast.success('Invoice updated successfully');
      return updatedInvoice;
    } catch (error) {
      console.error('Failed to update invoice:', error);
      toast.error('Failed to update invoice');
      throw error;
    }
  };

  const deleteInvoice = async (invoiceId: string) => {
    try {
      await pb.collection('invoices').delete(invoiceId);
      setInvoices(prev => prev.filter(inv => inv.id !== invoiceId));
      toast.success('Invoice deleted successfully');
    } catch (error) {
      console.error('Failed to delete invoice:', error);
      toast.error('Failed to delete invoice');
      throw error;
    }
  };

  const generateInvoiceNumber = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const timestamp = Date.now().toString().slice(-4);
    return `INV-${year}-${month}-${timestamp}`;
  };

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  return {
    invoices,
    loading,
    fetchInvoices,
    createInvoice,
    updateInvoice,
    deleteInvoice,
    generateInvoiceNumber,
  };
}
