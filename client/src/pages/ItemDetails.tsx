import { useState } from "react";
import { useRoute, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Item } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { X } from "lucide-react";
import WarningModal from "@/components/WarningModal";
import ContactInfoModal from "@/components/ContactInfoModal";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function ItemDetails() {
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/items/:id");
  const itemId = params?.id ? parseInt(params.id) : null;
  
  const { toast } = useToast();
  
  const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const { data: item, isLoading, isError } = useQuery<Item>({
    queryKey: [`/api/items/${itemId}`],
    enabled: itemId !== null,
  });

  const returnMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("POST", "/api/items/return", { id });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/items"] });
      toast({
        title: "Успех!",
        description: "Возврат предмета подтвержден! Объявление будет удалено.",
        variant: "default",
      });
      setIsContactModalOpen(false);
      setTimeout(() => {
        setLocation("/");
      }, 2000);
    },
    onError: () => {
      toast({
        title: "Ошибка",
        description: "Не удалось подтвердить возврат предмета. Пожалуйста, попробуйте снова.",
        variant: "destructive",
      });
    }
  });

  const handleClaim = () => {
    setIsWarningModalOpen(true);
  };

  const handleWarningConfirm = () => {
    setIsWarningModalOpen(false);
    setIsContactModalOpen(true);
  };

  const handleReturnConfirm = () => {
    if (item) {
      returnMutation.mutate(item.id);
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
        <div className="relative pb-[75%] bg-gray-200">
          <Skeleton className="absolute inset-0 w-full h-full" />
          <div className="absolute top-4 right-4 p-2 rounded-full bg-white shadow-md">
            <X className="w-6 h-6" />
          </div>
        </div>
        <div className="p-6">
          <Skeleton className="h-8 w-3/4 mb-4" />
          <div className="space-y-3">
            <div>
              <Skeleton className="h-4 w-1/3 mb-1" />
              <Skeleton className="h-5 w-full" />
            </div>
            <div>
              <Skeleton className="h-4 w-1/3 mb-1" />
              <Skeleton className="h-5 w-full" />
            </div>
            <div>
              <Skeleton className="h-4 w-1/3 mb-1" />
              <Skeleton className="h-5 w-2/3" />
            </div>
            <div>
              <Skeleton className="h-4 w-1/3 mb-1" />
              <Skeleton className="h-5 w-full" />
            </div>
            <Skeleton className="h-12 w-full mt-4" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !item) {
    return (
      <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
        <div className="p-6 text-center">
          <p className="text-red-500 mb-4">Не удалось загрузить информацию о предмете</p>
          <Button onClick={() => setLocation("/")}>Вернуться на главную</Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="fixed inset-0 bg-white z-40 overflow-y-auto">
        <div className="relative pb-[75%] bg-gray-200">
          <img 
            src={item.imageUrl} 
            alt={item.name} 
            className="absolute inset-0 w-full h-full object-cover"
          />
          <Button 
            variant="outline" 
            size="icon" 
            className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-md"
            onClick={() => setLocation("/")}
          >
            <X className="w-6 h-6" />
          </Button>
        </div>
        
        <div className="p-6">
          <h3 className="text-2xl font-bold">{item.name}</h3>
          
          <div className="mt-4 space-y-3">
            <div>
              <h4 className="text-sm font-medium text-gray-500">Описание</h4>
              <p className="mt-1">{item.description}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-500">Место находки</h4>
              <p className="mt-1">{item.location}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-500">Дата находки</h4>
              <p className="mt-1">{item.dateFound}</p>
            </div>
            
            {item.additionalInfo && (
              <div>
                <h4 className="text-sm font-medium text-gray-500">Дополнительная информация</h4>
                <p className="mt-1">{item.additionalInfo}</p>
              </div>
            )}
            
            <Button 
              className="mt-6 w-full py-3"
              onClick={handleClaim}
              disabled={item.isReturned}
            >
              {item.isReturned ? "Предмет уже возвращен" : "Я потерял этот предмет"}
            </Button>
          </div>
        </div>
      </div>

      <WarningModal 
        isOpen={isWarningModalOpen} 
        onClose={() => setIsWarningModalOpen(false)}
        onConfirm={handleWarningConfirm}
      />

      <ContactInfoModal 
        isOpen={isContactModalOpen} 
        onClose={() => setIsContactModalOpen(false)}
        onConfirmReturn={handleReturnConfirm}
        item={item}
        isPending={returnMutation.isPending}
      />
    </>
  );
}
