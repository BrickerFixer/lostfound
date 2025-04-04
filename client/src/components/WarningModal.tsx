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
        <h3 className="text-xl font-bold text-center">Important Notice</h3>
        
        <div className="mt-6 space-y-4">
          <p>This information is private and should only be used to retrieve your lost item.</p>
          
          <p>Before proceeding, please confirm:</p>
          
          <ul className="list-disc pl-5 space-y-2">
            <li>You can verify this is your item (through description, photos, etc.)</li>
            <li>You will use the contact information only for retrieving this item</li>
            <li>You agree not to share the finder's personal information with others</li>
            <li>You understand that false claims are prohibited</li>
          </ul>
          
          <div className="flex gap-4 mt-8">
            <Button 
              variant="secondary" 
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button 
              className="flex-1"
              onClick={onConfirm}
            >
              I Agree
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
