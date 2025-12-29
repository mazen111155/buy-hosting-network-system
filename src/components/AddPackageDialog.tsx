import React, { useState } from 'react';
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

interface AddPackageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddPackageDialog = ({ open, onOpenChange }: AddPackageDialogProps) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [duration, setDuration] = useState('');
  const [speed, setSpeed] = useState('');
  const [dataLimit, setDataLimit] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    toast({
      title: 'تمت إضافة الباقة',
      description: `تم إضافة ${name} بنجاح`
    });
    
    setName('');
    setPrice('');
    setDuration('');
    setSpeed('');
    setDataLimit('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>إضافة باقة جديدة</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">اسم الباقة</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="مثال: باقة شهرية"
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">السعر ($)</Label>
              <Input
                id="price"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="50"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="duration">المدة (أيام)</Label>
              <Input
                id="duration"
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="30"
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="speed">السرعة (Mbps)</Label>
              <Input
                id="speed"
                type="number"
                value={speed}
                onChange={(e) => setSpeed(e.target.value)}
                placeholder="50"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dataLimit">حد البيانات (GB)</Label>
              <Input
                id="dataLimit"
                value={dataLimit}
                onChange={(e) => setDataLimit(e.target.value)}
                placeholder="100 أو غير محدود"
                required
              />
            </div>
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1 gradient-primary text-white">
              إضافة الباقة
            </Button>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              إلغاء
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddPackageDialog;
