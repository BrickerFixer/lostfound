import { 
  Dialog, 
  DialogContent
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Item } from "@shared/schema";

interface ContactInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmReturn: () => void;
  item: Item;
  isPending: boolean;
}

export default function ContactInfoModal({ 
  isOpen, 
  onClose, 
  onConfirmReturn, 
  item,
  isPending
}: ContactInfoModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-bold">Контактная информация</h3>
        
        <div className="mt-4 space-y-3">
          <div>
            <h4 className="text-sm font-medium text-gray-500">Имя нашедшего</h4>
            <p className="mt-1 font-semibold">{item.finderName}</p>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-500">Номер телефона</h4>
            <p className="mt-1 font-semibold">{item.finderPhone}</p>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-500">Email</h4>
            <p className="mt-1 font-semibold">{item.finderEmail}</p>
          </div>
          
          <div className="mt-6 pt-4 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-500">Следующие шаги</h4>
            <p className="mt-1">Свяжитесь с нашедшим, используя указанную выше информацию, чтобы договориться о встрече для получения вашей вещи.</p>
            <p className="mt-3">После получения вещи, пожалуйста, подтвердите возврат, чтобы удалить это объявление.</p>
          </div>
          
          <div className="flex gap-4 mt-6">
            <Button 
              variant="secondary" 
              className="flex-1" 
              onClick={onClose}
              disabled={isPending}
            >
              Закрыть
            </Button>
            <Button 
              variant="default"
              className="flex-1 bg-green-500 hover:bg-green-600"
              onClick={onConfirmReturn}
              disabled={isPending}
            >
              {isPending ? "Обработка..." : "Подтвердить возврат"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
