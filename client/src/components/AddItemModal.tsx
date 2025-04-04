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

// Create a custom schema for form validation
const extendedSchema = z.object({
  name: z.string().min(3, "Название должно содержать минимум 3 символа"),
  description: z.string().min(10, "Описание должно содержать минимум 10 символов"),
  location: z.string().min(3, "Место находки должно содержать минимум 3 символа"),
  dateFound: z.string().min(1, "Дата находки обязательна"),
  finderName: z.string().min(3, "Ваше имя должно содержать минимум 3 символа"),
  finderPhone: z.string().min(10, "Пожалуйста, введите корректный номер телефона"),
  finderEmail: z.string().email("Пожалуйста, введите корректный email"),
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
        throw new Error("Необходимо загрузить изображение");
      }

      const formData = new FormData();
      
      // Append item data
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });
      
      // Append image file
      formData.append("image", selectedImage);
      
      console.log("Submitting form data with FormData...");
      
      // Just log that we're submitting form data
      console.log("Form data ready for submission with the following fields:", 
        Object.keys(data).map(key => key).join(", ") + ", image");
      
      const response = await fetch("/api/items", {
        method: "POST",
        body: formData,
        // Important: Do NOT set Content-Type header when using FormData
        // The browser will automatically set the correct Content-Type with boundary
      });
      
      if (!response.ok) {
        let errorMessage = "Не удалось создать запись";
        try {
          const errorData = await response.json();
          console.error("Server returned error:", errorData);
          errorMessage = errorData.message || errorMessage;
        } catch (parseError) {
          console.error("Could not parse error response:", parseError);
        }
        throw new Error(errorMessage);
      }
      
      const result = await response.json();
      console.log("Form submission successful:", result);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/items"] });
      toast({
        title: "Успех!",
        description: "Предмет успешно добавлен на доску находок!",
      });
      onClose();
      form.reset();
      setSelectedImage(null);
    },
    onError: (error) => {
      console.error("Mutation error:", error);
      toast({
        title: "Ошибка",
        description: error instanceof Error ? error.message : "Произошла ошибка",
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data: z.infer<typeof extendedSchema>) => {
    if (!selectedImage) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, загрузите изображение предмета",
        variant: "destructive",
      });
      return;
    }
    
    // Use the mutation to submit the form
    try {
      await addItemMutation.mutateAsync(data);
    } catch (error) {
      // Error is already handled in mutation's onError
      console.error("Form submission error caught in submit handler:", error);
    }
  };

  // Prepare today's date for max date constraint
  const today = new Date().toISOString().slice(0, 10);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between mb-2">
            <DialogTitle className="text-xl font-bold">Нашли предмет?</DialogTitle>
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
                  <FormLabel>Название предмета</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Например: кошелек, наушники, ключи" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <FormLabel className="block text-sm font-medium mb-1">Фото предмета</FormLabel>
              <FileUpload 
                onFileSelect={(file) => setSelectedImage(file)} 
                selectedFile={selectedImage}
              />
              {form.formState.isSubmitted && !selectedImage && (
                <p className="text-sm font-medium text-destructive mt-1">
                  Пожалуйста, загрузите изображение предмета
                </p>
              )}
            </div>
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Описание</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Цвет, фирма, состояние, отличительные особенности..." 
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
                  <FormLabel>Где найдено</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Например: Центральный парк, остановка на Главной улице" 
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
                  <FormLabel>Дата находки</FormLabel>
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
                  <FormLabel>Дополнительная информация (необязательно)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Любые другие детали, которые могут помочь идентифицировать владельца..." 
                      {...field} 
                      rows={2}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="pt-4 border-t border-gray-200">
              <h4 className="text-lg font-medium">Ваша контактная информация</h4>
              <p className="text-sm text-gray-500 mt-1">
                Будет доступна только человеку, который заявит о своих правах на эту вещь
              </p>
              
              <div className="mt-3 space-y-4">
                <FormField
                  control={form.control}
                  name="finderName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ваше имя</FormLabel>
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
                      <FormLabel>Номер телефона</FormLabel>
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
              {addItemMutation.isPending ? "Отправка..." : "Отправить информацию о находке"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
