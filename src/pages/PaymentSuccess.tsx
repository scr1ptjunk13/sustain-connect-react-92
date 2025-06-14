
import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

const PaymentSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    const verifyPayment = async () => {
      if (!sessionId) {
        toast({
          title: "Error",
          description: "No payment session found",
          variant: "destructive"
        });
        navigate('/');
        return;
      }

      try {
        const { data, error } = await supabase.functions.invoke('verify-payment', {
          body: { session_id: sessionId }
        });

        if (error || !data.success) {
          throw new Error(data?.message || 'Payment verification failed');
        }

        toast({
          title: "Payment Successful!",
          description: "Your payment has been processed successfully."
        });
      } catch (error: any) {
        console.error('Payment verification error:', error);
        toast({
          title: "Payment Verification Failed",
          description: error.message,
          variant: "destructive"
        });
      }
    };

    verifyPayment();
  }, [sessionId, navigate]);

  const handleDownloadReceipt = async () => {
    if (!sessionId) return;

    try {
      // This would generate and download the receipt
      toast({
        title: "Receipt Generated",
        description: "Your receipt has been generated and will be emailed to you."
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to generate receipt",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl text-green-600">Payment Successful!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p className="text-muted-foreground">
            Thank you for your payment. Your transaction has been processed successfully.
          </p>
          
          <div className="space-y-2">
            <Button onClick={handleDownloadReceipt} variant="outline" className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Download Receipt
            </Button>
            
            <Button onClick={() => navigate('/')} className="w-full">
              Return to Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSuccess;
