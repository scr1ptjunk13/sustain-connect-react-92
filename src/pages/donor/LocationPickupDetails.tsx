
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Clock, Phone } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import DonorLayout from '@/components/donor/DonorLayout';

const formSchema = z.object({
  address: z.string().min(5, {
    message: "Address must be at least 5 characters",
  }),
  pickupDate: z.string().min(1, {
    message: "Please select a pickup date",
  }),
  pickupTimeStart: z.string().min(1, {
    message: "Please select a start time",
  }),
  pickupTimeEnd: z.string().min(1, {
    message: "Please select an end time",
  }),
  contactName: z.string().min(2, {
    message: "Contact name must be at least 2 characters",
  }),
  contactPhone: z.string().min(10, {
    message: "Please enter a valid phone number",
  }),
  pickupInstructions: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const LocationPickupDetails: React.FC = () => {
  const navigate = useNavigate();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      address: "",
      pickupDate: "",
      pickupTimeStart: "",
      pickupTimeEnd: "",
      contactName: "",
      contactPhone: "",
      pickupInstructions: "",
    },
  });

  const onSubmit = (data: FormValues) => {
    console.log(data);
    // In a real app, you would combine this with the previous screen data
    // and save it to state or context before navigating
    navigate('/donor/review-submit');
  };

  return (
    <DonorLayout title="Pickup Details">
      <div className="py-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-6">
              <div>
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-primary mr-2" />
                  <h3 className="text-lg font-medium">Address Confirmation</h3>
                </div>

                {/* This would be replaced with an actual map component */}
                <div className="mt-2 bg-gray-200 h-40 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">Map View Would Appear Here</p>
                </div>

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem className="mt-3">
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter pickup address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-primary mr-2" />
                  <h3 className="text-lg font-medium">Pickup Window</h3>
                </div>

                <FormField
                  control={form.control}
                  name="pickupDate"
                  render={({ field }) => (
                    <FormItem className="mt-3">
                      <FormLabel>Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4 mt-3">
                  <FormField
                    control={form.control}
                    name="pickupTimeStart"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>From</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="pickupTimeEnd"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>To</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center">
                  <Phone className="h-5 w-5 text-primary mr-2" />
                  <h3 className="text-lg font-medium">Contact Person</h3>
                </div>

                <div className="space-y-3 mt-3">
                  <FormField
                    control={form.control}
                    name="contactName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Contact person name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="contactPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input type="tel" placeholder="Contact phone number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="pickupInstructions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Special Pickup Instructions (Optional)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="E.g. Ring doorbell, call when arrived..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full">
              Continue to Review
            </Button>
          </form>
        </Form>
      </div>
    </DonorLayout>
  );
};

export default LocationPickupDetails;
