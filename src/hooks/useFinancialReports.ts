
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';

export interface FinancialSummary {
  total_revenue: number;
  total_fees: number;
  net_revenue: number;
  payment_count: number;
  period: string;
}

export interface PaymentRecord {
  id: string;
  amount: number;
  currency: string;
  type: string;
  description: string;
  status: string;
  completed_at: string | null;
  created_at: string;
}

export const useFinancialReports = () => {
  const [summary, setSummary] = useState<FinancialSummary | null>(null);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchFinancialSummary = async (period: 'day' | 'week' | 'month' | 'year' = 'month') => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('financial-reports', {
        method: 'POST',
        body: { action: 'summary', period }
      });

      if (error) throw error;
      setSummary(data.summary);
    } catch (error: any) {
      console.error('Error fetching financial summary:', error);
      toast({
        title: "Error",
        description: "Failed to fetch financial summary",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchPaymentHistory = async (limit: number = 50) => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Use type assertion for now until Supabase types are regenerated
      const { data, error } = await (supabase as any)
        .from('payments')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      setPayments(data || []);
    } catch (error: any) {
      console.error('Error fetching payment history:', error);
      toast({
        title: "Error",
        description: "Failed to fetch payment history",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const generateTaxReceipt = async (paymentId: string) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase.functions.invoke('generate-tax-receipt', {
        method: 'POST',
        body: { payment_id: paymentId }
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Tax receipt generated successfully!"
      });

      return data.receipt;
    } catch (error: any) {
      console.error('Error generating tax receipt:', error);
      toast({
        title: "Error",
        description: "Failed to generate tax receipt",
        variant: "destructive"
      });
      return null;
    }
  };

  useEffect(() => {
    if (user) {
      fetchFinancialSummary();
      fetchPaymentHistory();
    }
  }, [user]);

  return {
    summary,
    payments,
    loading,
    fetchFinancialSummary,
    fetchPaymentHistory,
    generateTaxReceipt
  };
};
