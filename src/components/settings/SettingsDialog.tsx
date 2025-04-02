
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
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useTheme } from '@/hooks/use-theme';
import { Sun, Moon, Info } from 'lucide-react';

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SettingsDialog: React.FC<SettingsDialogProps> = ({ open, onOpenChange }) => {
  const { theme, setTheme } = useTheme();
  
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
            <h3 className="text-sm font-medium">Appearance</h3>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {theme === 'dark' ? (
                  <Moon className="h-4 w-4 text-blue-500" />
                ) : (
                  <Sun className="h-4 w-4 text-blue-500" />
                )}
                <Label htmlFor="theme-toggle">Theme Mode</Label>
              </div>
              <Switch 
                id="theme-toggle" 
                checked={theme === 'dark'}
                onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
              />
            </div>
          </div>
          
          {/* Add more settings sections as needed */}
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
