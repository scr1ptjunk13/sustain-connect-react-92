
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  Phone,
  CheckCircle,
  ChevronRight,
  ArrowLeft,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from '@/hooks/use-toast';
import Map from '@/components/ngo/Map';

const InTransit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [arrived, setArrived] = useState(false);
  const [issueDialogOpen, setIssueDialogOpen] = useState(false);
  const [issueDescription, setIssueDescription] = useState('');
  
  // Mock delivery data
  const delivery = {
    id,
    title: 'Fresh Vegetables',
    dropoffAddress: 'Food Bank, 789 Charity Ave',
    dropoffContact: {
      name: 'Food Bank Coordinator',
      phone: '+1 (555) 987-6543'
    },
    eta: '8 min',
    nextDirection: 'Turn left onto Charity Avenue',
    distance: '0.8 miles to destination'
  };
  
  const handleCall = (phone: string) => {
    toast({
      title: "Calling",
      description: phone
    });
  };
  
  const handleMarkArrival = () => {
    setArrived(true);
    toast({
      title: "Arrived at Destination",
      description: "Please proceed with delivery handover."
    });
    
    // In a real app, this would update the status in the database
    // and then redirect after a short delay
    setTimeout(() => {
      navigate(`/delivery/delivery-confirmation/${id}`);
    }, 1500);
  };
  
  const handleReportIssue = () => {
    if (!issueDescription.trim()) {
      toast({
        title: "Description Required",
        description: "Please provide details about the issue.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Issue Reported",
      description: "Support team has been notified."
    });
    
    setIssueDialogOpen(false);
  };

  return (
    <>
      <div className="flex flex-col h-screen">
        <div className="p-4 flex items-center bg-background border-b">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 mr-2" 
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-lg font-semibold">In Transit to NGO</h1>
            <p className="text-sm text-muted-foreground">
              ETA: {delivery.eta}
            </p>
          </div>
        </div>
        
        <div className="relative flex-1">
          <Map height="h-full" />
          
          <div className="absolute bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm p-4 border-t">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <div className="bg-primary/10 p-2 rounded-full mr-3">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{delivery.title}</p>
                  <p className="text-sm text-muted-foreground">{delivery.dropoffAddress}</p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8"
                onClick={() => handleCall(delivery.dropoffContact.phone)}
              >
                <Phone className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="bg-secondary/5 rounded-lg p-3 mb-3">
              <div className="flex items-center">
                <ChevronRight className="h-5 w-5 text-secondary mr-2" />
                <div>
                  <p className="font-medium">{delivery.nextDirection}</p>
                  <p className="text-sm text-muted-foreground">{delivery.distance}</p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 mb-3">
              <Button 
                variant="outline"
                onClick={() => setIssueDialogOpen(true)}
              >
                <AlertCircle className="h-4 w-4 mr-2" />
                Report Issue
              </Button>
              
              <Button 
                onClick={handleMarkArrival}
                disabled={arrived}
              >
                {arrived ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Arrived
                  </>
                ) : (
                  "Mark Arrival"
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <Dialog open={issueDialogOpen} onOpenChange={setIssueDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Report Delivery Issue</DialogTitle>
            <DialogDescription>
              Describe the issue you're experiencing with this delivery. Our support team will assist you promptly.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <Textarea
              placeholder="Please describe the issue in detail..."
              className="min-h-[120px]"
              value={issueDescription}
              onChange={(e) => setIssueDescription(e.target.value)}
            />
          </div>
          
          <DialogFooter className="sm:justify-between">
            <Button variant="outline" onClick={() => setIssueDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleReportIssue}>
              Submit Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default InTransit;
