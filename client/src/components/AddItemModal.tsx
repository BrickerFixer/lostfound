import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { insertItemSchema } from "@shared/schema";
import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { FileUpload } from "@/components/ui/file-upload";

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Extend schema to ensure image is required and text fields are properly validated
const extendedSchema = insertItemSchema.extend({
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  location: z.string().min(3, "Location must be at least 3 characters"),
  dateFound: z.string().min(1, "Date found is required"),
  finderName: z.string().min(3, "Your name must be at least 3 characters"),
  finderPhone: z.string().min(10, "Please enter a valid phone number"),
  finderEmail: z.string().email("Please enter a valid email address"),
  additionalInfo: z.string().optional(),
});

export default function AddItemModal({ isOpen, onClose }: AddItemModalProps) {
  const { toast } = useToast();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  
  const form = useForm<z.infer<typeof extendedSchema>>({
    resolver: zodResolver(extendedSchema),
    defaultValues: {
      name: "",
      description: "",
      location: "",
      dateFound: new Date().toISOString().slice(0, 10),
      additionalInfo: "",
      finderName: "",
      finderPhone: "",
      finderEmail: "",
    },
  });

  const addItemMutation = useMutation({
    mutationFn: async (data: z.infer<typeof extendedSchema>) => {
      if (!selectedImage) {
        throw new Error("Image is required");
      }

      const formData = new FormData();
      
      // Append item data
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value);
        }
      });
      
      // Append image file
      formData.append("image", selectedImage);
      
      const response = await fetch("/api/items", {
        method: "POST",
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create item");
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/items"] });
      toast({
        title: "Success!",
        description: "Item successfully added to the lost & found board!",
      });
      onClose();
      form.reset();
      setSelectedImage(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: z.infer<typeof extendedSchema>) => {
    if (!selectedImage) {
      toast({
        title: "Error",
        description: "Please upload an image of the item",
        variant: "destructive",
      });
      return;
    }
    
    addItemMutation.mutate(data);
  };

  // Prepare today's date for max date constraint
  const today = new Date().toISOString().slice(0, 10);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between mb-2">
            <DialogTitle className="text-xl font-bold">Found an Item?</DialogTitle>
            <Button 
              variant="ghost" 
              size="icon" 
              className="p-1 rounded-full hover:bg-gray-100"
              onClick={onClose}
            >
              <X className="w-6 h-6" />
            </Button>
          </div>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Item Name</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="E.g. Wallet, Headphones, Keys" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <FormLabel className="block text-sm font-medium mb-1">Item Photo</FormLabel>
              <FileUpload 
                onFileSelect={(file) => setSelectedImage(file)} 
                selectedFile={selectedImage}
              />
              {form.formState.isSubmitted && !selectedImage && (
                <p className="text-sm font-medium text-destructive mt-1">
                  Please upload an image of the item
                </p>
              )}
            </div>
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Color, brand, condition, any identifying features..." 
                      {...field} 
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Where Found</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="E.g. Central Park, Main Street Bus Stop" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="dateFound"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date Found</FormLabel>
                  <FormControl>
                    <Input 
                      type="date" 
                      max={today}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="additionalInfo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Info (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Any other details that might help identify the owner..." 
                      {...field} 
                      rows={2}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="pt-4 border-t border-gray-200">
              <h4 className="text-lg font-medium">Your Contact Information</h4>
              <p className="text-sm text-gray-500 mt-1">
                This will only be shared with the person who claims the item
              </p>
              
              <div className="mt-3 space-y-4">
                <FormField
                  control={form.control}
                  name="finderName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="finderPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input type="tel" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="finderEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full py-3 mt-6"
              disabled={addItemMutation.isPending}
            >
              {addItemMutation.isPending ? "Submitting..." : "Submit Found Item"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
