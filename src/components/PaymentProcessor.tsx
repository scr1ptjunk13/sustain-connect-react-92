
import React, { useState } from 'react';
import { CreditCard, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface PaymentProcessorProps {
  donationId?: string;
  defaultAmount?: number;
  defaultType?: 'donation_fee' | 'premium_subscription' | 'processing_fee';
  onSuccess?: () => void;
}

const PaymentProcessor: React.FC<PaymentProcessorProps> = ({
  donationId,
  defaultAmount = 500, // $5.00 default
  defaultType = 'donation_fee',
  onSuccess
}) => {
  const [amount, setAmount] = useState(defaultAmount);
  const [paymentType, setPaymentType] = useState(defaultType);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handlePayment = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to process payments",
        variant: "destructive"
      });
      return;
    }

    if (!amount || amount < 50) { // Minimum $0.50
      toast({
        title: "Invalid Amount",
        description: "Amount must be at least $0.50",
        variant: "destructive"
      });
      return;
    }

    if (!description.trim()) {
      toast({
        title: "Description Required",
        description: "Please provide a description for this payment",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-payment', {
        body: {
          amount: amount,
          currency: 'usd',
          type: paymentType,
          description: description,
          donation_id: donationId
        }
      });

      if (error) throw error;

      if (data.url) {
        // Open Stripe checkout in a new tab
        window.open(data.url, '_blank');
        
        toast({
          title: "Payment Initiated",
          description: "Redirecting to payment page..."
        });

        if (onSuccess) {
          onSuccess();
        }
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      toast({
        title: "Payment Error",
        description: error.message || "Failed to process payment",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const formatAmount = (cents: number) => {
    return (cents / 100).toFixed(2);
  };

  const handleAmountChange = (value: string) => {
    const dollars = parseFloat(value) || 0;
    setAmount(Math.round(dollars * 100)); // Convert to cents
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center">
          <CreditCard className="h-5 w-5 mr-2" />
          Process Payment
        </CardTitle>
        <CardDescription>
          {paymentType === 'donation_fee' && 'Processing fee for donation'}
          {paymentType === 'premium_subscription' && 'Upgrade to premium features'}
          {paymentType === 'processing_fee' && 'Platform processing fee'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="paymentType">Payment Type</Label>
          <Select value={paymentType} onValueChange={(value: any) => setPaymentType(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="donation_fee">Donation Processing Fee</SelectItem>
              <SelectItem value="premium_subscription">Premium Subscription</SelectItem>
              <SelectItem value="processing_fee">Platform Fee</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="amount">Amount (USD)</Label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0.50"
              value={formatAmount(amount)}
              onChange={(e) => handleAmountChange(e.target.value)}
              className="pl-9"
              placeholder="5.00"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter payment description"
          />
        </div>

        <Button 
          onClick={handlePayment} 
          disabled={loading || !amount || !description.trim()}
          className="w-full"
        >
          {loading ? 'Processing...' : `Pay $${formatAmount(amount)}`}
        </Button>
      </CardContent>
    </Card>
  );
};

export default PaymentProcessor;
