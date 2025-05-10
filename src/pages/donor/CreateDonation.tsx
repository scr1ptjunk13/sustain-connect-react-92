
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Utensils, Image } from 'lucide-react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import DonorLayout from '@/components/donor/DonorLayout';

const formSchema = z.object({
  foodType: z.string({
    required_error: "Please select a food type",
  }),
  foodName: z.string().min(3, {
    message: "Food name must be at least 3 characters",
  }),
  quantity: z.string().min(1, {
    message: "Please enter a quantity",
  }),
  unit: z.string({
    required_error: "Please select a unit",
  }),
  prepDate: z.string().min(1, {
    message: "Please enter preparation date",
  }),
  expiryTime: z.string().min(1, {
    message: "Please enter expiry time",
  }),
  specialInstructions: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const CreateDonation: React.FC = () => {
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      foodType: "",
      foodName: "",
      quantity: "",
      unit: "",
      prepDate: "",
      expiryTime: "",
      specialInstructions: "",
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (data: FormValues) => {
    console.log(data);
    // In a real app, you would save this data to state or context
    // before navigating to the next screen
    navigate('/donor/location-pickup');
  };

  return (
    <DonorLayout title="Create Donation">
      <div className="py-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <FormField
                control={form.control}
                name="foodType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Food Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select food type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="cooked">Cooked Food</SelectItem>
                        <SelectItem value="packaged">Packaged Food</SelectItem>
                        <SelectItem value="fresh">Fresh Produce</SelectItem>
                        <SelectItem value="bakery">Bakery Items</SelectItem>
                        <SelectItem value="dairy">Dairy Products</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="foodName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Food Name/Description</FormLabel>
                    <FormControl>
                      <Input placeholder="E.g. Pasta with tomato sauce" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="unit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Unit</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select unit" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="kg">Kilograms (kg)</SelectItem>
                          <SelectItem value="g">Grams (g)</SelectItem>
                          <SelectItem value="l">Liters (L)</SelectItem>
                          <SelectItem value="ml">Milliliters (ml)</SelectItem>
                          <SelectItem value="pcs">Pieces</SelectItem>
                          <SelectItem value="servings">Servings</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="prepDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preparation Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="expiryTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expiry Time</FormLabel>
                      <FormControl>
                        <Input type="datetime-local" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="specialInstructions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Special Handling Instructions</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="E.g. Keep refrigerated, contains allergens..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div>
                <FormLabel>Photo Upload (Optional)</FormLabel>
                <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center">
                  {imagePreview ? (
                    <div className="relative w-full">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-md"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="mt-2"
                        onClick={() => setImagePreview(null)}
                      >
                        Remove Photo
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <Image className="h-10 w-10 text-gray-400" />
                      <p className="mt-2 text-sm text-gray-500">Click to add photo of the food</p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full">
              Continue to Pickup Details
            </Button>
          </form>
        </Form>
      </div>
    </DonorLayout>
  );
};

export default CreateDonation;
