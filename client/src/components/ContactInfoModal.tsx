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
      <DialogContent className="sm:max-w-md">
        <h3 className="text-xl font-bold">Contact Information</h3>
        
        <div className="mt-4 space-y-3">
          <div>
            <h4 className="text-sm font-medium text-gray-500">Finder's Name</h4>
            <p className="mt-1 font-semibold">{item.finderName}</p>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-500">Phone Number</h4>
            <p className="mt-1 font-semibold">{item.finderPhone}</p>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-500">Email</h4>
            <p className="mt-1 font-semibold">{item.finderEmail}</p>
          </div>
          
          <div className="mt-6 pt-4 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-500">Next Steps</h4>
            <p className="mt-1">Contact the finder using the information above to arrange a meeting to retrieve your item.</p>
            <p className="mt-3">Once you've received your item, please confirm the return to remove this listing.</p>
          </div>
          
          <div className="flex gap-4 mt-6">
            <Button 
              variant="secondary" 
              className="flex-1" 
              onClick={onClose}
              disabled={isPending}
            >
              Close
            </Button>
            <Button 
              variant="default"
              className="flex-1 bg-green-500 hover:bg-green-600"
              onClick={onConfirmReturn}
              disabled={isPending}
            >
              {isPending ? "Processing..." : "Confirm Return"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
