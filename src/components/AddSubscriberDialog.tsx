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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import db from '@/lib/shared/kliv-database.js';

interface Package {
  _row_id: number;
  name: string;
  duration_days: number;
}

interface AddSubscriberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  packages: Package[];
  onSuccess?: () => void;
}

const AddSubscriberDialog = ({ open, onOpenChange, packages, onSuccess }: AddSubscriberDialogProps) => {
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [packageId, setPackageId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const generateUsername = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = 'user_';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setUsername(result);
  };

  const generatePassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(result);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password || !packageId) {
      toast({
        title: 'خطأ',
        description: 'يرجى ملء جميع الحقول المطلوبة',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const selectedPackage = packages.find(p => p._row_id === parseInt(packageId));
      const now = Math.floor(Date.now() / 1000);
      const expiresAt = selectedPackage 
        ? now + (selectedPackage.duration_days * 24 * 60 * 60)
        : now + (30 * 24 * 60 * 60);

      await db.insert('subscribers', {
        full_name: fullName || null,
        username: username,
        password: password,
        phone: phone || null,
        package_id: parseInt(packageId),
        status: 'active',
        started_at: now,
        expires_at: expiresAt,
        total_download: 0,
        total_upload: 0
      });
      
      toast({
        title: 'تمت إضافة المشترك',
        description: `تم إضافة ${fullName || username} بنجاح`
      });
      
      // Reset form
      setFullName('');
      setUsername('');
      setPassword('');
      setPhone('');
      setPackageId('');
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.log('Error adding subscriber:', error);
      let message = 'فشل في إضافة المشترك';
      const errorMessage = error instanceof Error ? error.message : '';
      if (errorMessage.includes('UNIQUE')) {
        message = 'اسم المستخدم موجود مسبقاً';
      }
      toast({
        title: 'خطأ',
        description: message,
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
          <DialogTitle>إضافة مشترك جديد</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">الاسم الكامل</Label>
            <Input
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="أدخل الاسم"
              disabled={isLoading}
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="username">اسم المستخدم *</Label>
              <Button type="button" variant="link" size="sm" onClick={generateUsername}>
                توليد تلقائي
              </Button>
            </div>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="username"
              dir="ltr"
              required
              disabled={isLoading}
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="password">كلمة المرور *</Label>
              <Button type="button" variant="link" size="sm" onClick={generatePassword}>
                توليد تلقائي
              </Button>
            </div>
            <Input
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              dir="ltr"
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">رقم الهاتف</Label>
            <Input
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="05xxxxxxxx"
              dir="ltr"
              disabled={isLoading}
            />
          </div>
          
          <div className="space-y-2">
            <Label>الباقة *</Label>
            <Select value={packageId} onValueChange={setPackageId} disabled={isLoading}>
              <SelectTrigger>
                <SelectValue placeholder="اختر الباقة" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {packages.map(pkg => (
                  <SelectItem key={pkg._row_id} value={pkg._row_id.toString()}>
                    {pkg.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
                  جاري الإضافة...
                </>
              ) : (
                'إضافة المشترك'
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

export default AddSubscriberDialog;
