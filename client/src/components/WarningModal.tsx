import { 
  Dialog, 
  DialogContent
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface WarningModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function WarningModal({ isOpen, onClose, onConfirm }: WarningModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-gray-900 text-white p-6 sm:max-w-md max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-bold text-center">Важное уведомление</h3>
        
        <div className="mt-6 space-y-4">
          <p>Эта информация является конфиденциальной и должна использоваться только для получения вашей потерянной вещи.</p>
          
          <p>Перед тем как продолжить, пожалуйста, подтвердите:</p>
          
          <ul className="list-disc pl-5 space-y-2">
            <li>Вы можете подтвердить, что это ваша вещь (по описанию, фотографиям и т.д.)</li>
            <li>Вы будете использовать контактную информацию только для получения этой вещи</li>
            <li>Вы обязуетесь не передавать личную информацию нашедшего другим лицам</li>
            <li>Вы понимаете, что ложные заявления запрещены</li>
          </ul>
          
          <div className="flex gap-4 mt-8">
            <Button 
              variant="secondary" 
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white"
              onClick={onClose}
            >
              Отмена
            </Button>
            <Button 
              className="flex-1"
              onClick={onConfirm}
            >
              Я согласен
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
