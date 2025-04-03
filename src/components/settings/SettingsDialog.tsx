
import React from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Info } from 'lucide-react';

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SettingsDialog: React.FC<SettingsDialogProps> = ({ open, onOpenChange }) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="animate-slide-in-right">
        <SheetHeader className="text-left mb-4">
          <SheetTitle className="text-xl font-semibold text-blue-700 flex items-center">
            <Info className="mr-2 h-5 w-5 text-blue-600" />
            Settings
          </SheetTitle>
          <SheetDescription>
            Customize your application preferences
          </SheetDescription>
        </SheetHeader>

        <Separator className="my-4" />
        
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Application Settings</h3>
            
            {/* Add future settings options here */}
            <p className="text-sm text-gray-500">More settings will be available in future updates.</p>
          </div>
        </div>
        
        <SheetFooter className="mt-6">
          <Button 
            onClick={() => onOpenChange(false)}
            className="w-full"
          >
            Close
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default SettingsDialog;
