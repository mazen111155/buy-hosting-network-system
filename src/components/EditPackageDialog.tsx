import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import db from '@/lib/shared/kliv-database.js';

interface Package {
  _row_id: number;
  name: string;
  price: number;
  duration_days: number;
  speed_limit: string;
  download_limit: string;
}

interface EditPackageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  package: Package;
  onSuccess?: () => void;
}

const EditPackageDialog = ({ open, onOpenChange, package: pkg, onSuccess }: EditPackageDialogProps) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [duration, setDuration] = useState('');
  const [speed, setSpeed] = useState('');
  const [downloadLimit, setDownloadLimit] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (pkg) {
      setName(pkg.name || '');
      setPrice(pkg.price?.toString() || '');
      setDuration(pkg.duration_days?.toString() || '');
      setSpeed(pkg.speed_limit?.replace(' Mbps', '') || '');
      setDownloadLimit(pkg.download_limit?.replace(' GB', '') || '');
    }
  }, [pkg]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !price || !duration) {
      toast({
        title: 'خطأ',
        description: 'يرجى ملء جميع الحقول المطلوبة',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);
    
    try {
      await db.update('packages', { _row_id: `eq.${pkg._row_id}` }, {
        name: name,
        name_ar: name,
        price: parseFloat(price),
        duration_days: parseInt(duration),
        speed_limit: speed ? `${speed} Mbps` : null,
        download_limit: downloadLimit ? `${downloadLimit} GB` : null
      });
      
      toast({
        title: 'تم التحديث',
        description: `تم تحديث ${name} بنجاح`
      });
      
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.log('Error updating package:', error);
      toast({
        title: 'خطأ',
        description: 'فشل في تحديث الباقة',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>تعديل الباقة</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name">اسم الباقة *</Label>
            <Input
              id="edit-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="مثال: باقة شهرية"
              required
              disabled={isLoading}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-price">السعر ($) *</Label>
              <Input
                id="edit-price"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="50"
                required
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-duration">المدة (أيام) *</Label>
              <Input
                id="edit-duration"
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="30"
                required
                disabled={isLoading}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-speed">السرعة (Mbps)</Label>
              <Input
                id="edit-speed"
                type="number"
                value={speed}
                onChange={(e) => setSpeed(e.target.value)}
                placeholder="50"
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-downloadLimit">حد التحميل (GB)</Label>
              <Input
                id="edit-downloadLimit"
                type="number"
                value={downloadLimit}
                onChange={(e) => setDownloadLimit(e.target.value)}
                placeholder="100"
                disabled={isLoading}
              />
            </div>
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button 
              type="submit" 
              className="flex-1 gradient-primary text-white"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                  جاري الحفظ...
                </>
              ) : (
                'حفظ التغييرات'
              )}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              إلغاء
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditPackageDialog;
