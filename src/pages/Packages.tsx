import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash, Clock, Wifi, Users, Loader2 } from 'lucide-react';
import AddPackageDialog from '@/components/AddPackageDialog';
import EditPackageDialog from '@/components/EditPackageDialog';
import { useToast } from '@/hooks/use-toast';
import db from '@/lib/shared/kliv-database.js';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Package {
  _row_id: number;
  name: string;
  name_ar: string;
  description: string;
  price: number;
  duration_days: number;
  speed_limit: string;
  download_limit: string;
  upload_limit: string;
  simultaneous_users: number;
  is_active: number;
  sort_order: number;
}

const packageColors = [
  'from-blue-500 to-blue-600',
  'from-green-500 to-green-600',
  'from-purple-500 to-purple-600',
  'from-orange-500 to-orange-600',
  'from-pink-500 to-pink-600',
  'from-cyan-500 to-cyan-600',
];

const Packages = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [packages, setPackages] = useState<Package[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [subscriberCounts, setSubscriberCounts] = useState<Record<number, number>>({});
  const { toast } = useToast();

  const loadPackages = async () => {
    try {
      setIsLoading(true);
      const data = await db.query('packages', { is_active: 'eq.1' });
      console.log('Loaded packages:', data);
      setPackages(data || []);
      
      // Load subscriber counts
      const counts: Record<number, number> = {};
      for (const pkg of (data || [])) {
        const count = await db.count('subscribers', { package_id: `eq.${pkg._row_id}` });
        counts[pkg._row_id] = count;
      }
      setSubscriberCounts(counts);
    } catch (error) {
      console.log('Error loading packages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPackages();
  }, []);

  const handleDelete = async () => {
    if (!selectedPackage) return;
    
    try {
      await db.update('packages', { _row_id: `eq.${selectedPackage._row_id}` }, { is_active: 0 });
      toast({
        title: 'تم الحذف',
        description: `تم حذف ${selectedPackage.name} بنجاح`
      });
      loadPackages();
    } catch (error) {
      console.log('Error deleting package:', error);
      toast({
        title: 'خطأ',
        description: 'فشل في حذف الباقة',
        variant: 'destructive'
      });
    } finally {
      setDeleteDialogOpen(false);
      setSelectedPackage(null);
    }
  };

  const getDurationText = (days: number) => {
    if (days === 1) return 'يوم واحد';
    if (days === 7) return '7 أيام';
    if (days === 30) return '30 يوم';
    if (days === 365) return '365 يوم';
    return `${days} يوم`;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">الباقات</h2>
            <p className="text-muted-foreground">إدارة باقات الاشتراك</p>
          </div>
          <Button 
            className="gradient-primary text-white"
            onClick={() => setDialogOpen(true)}
          >
            <Plus className="w-5 h-5 ml-2" />
            إضافة باقة
          </Button>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : packages.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border">
            <p className="text-muted-foreground mb-4">لا توجد باقات حتى الآن</p>
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="w-5 h-5 ml-2" />
              إضافة أول باقة
            </Button>
          </div>
        ) : (
          /* Packages Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {packages.map((pkg, index) => (
              <div 
                key={pkg._row_id} 
                className="bg-white rounded-2xl shadow-sm border overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Header */}
                <div className={`bg-gradient-to-r ${packageColors[index % packageColors.length]} p-6 text-white`}>
                  <h3 className="text-xl font-bold mb-2">{pkg.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold">${pkg.price}</span>
                    <span className="text-white/80">/ {getDurationText(pkg.duration_days)}</span>
                  </div>
                </div>

                {/* Features */}
                <div className="p-6 space-y-4">
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Clock className="w-5 h-5" />
                    <span>المدة: {getDurationText(pkg.duration_days)}</span>
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Wifi className="w-5 h-5" />
                    <span>السرعة: {pkg.speed_limit || 'غير محدود'}</span>
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Users className="w-5 h-5" />
                    <span>{subscriberCounts[pkg._row_id] || 0} مشترك</span>
                  </div>
                  <div className="pt-2 border-t text-center">
                    <span className="text-sm text-muted-foreground">حد التحميل: </span>
                    <span className="font-bold">{pkg.download_limit || 'غير محدود'}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="p-4 bg-slate-50 flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => {
                      setSelectedPackage(pkg);
                      setEditDialogOpen(true);
                    }}
                  >
                    <Edit className="w-4 h-4 ml-1" />
                    تعديل
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-red-500 hover:text-red-600"
                    onClick={() => {
                      setSelectedPackage(pkg);
                      setDeleteDialogOpen(true);
                    }}
                  >
                    <Trash className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <AddPackageDialog 
        open={dialogOpen} 
        onOpenChange={setDialogOpen}
        onSuccess={loadPackages}
      />
      
      {selectedPackage && (
        <EditPackageDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          package={selectedPackage}
          onSuccess={loadPackages}
        />
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>هل أنت متأكد من الحذف؟</AlertDialogTitle>
            <AlertDialogDescription>
              سيتم حذف الباقة "{selectedPackage?.name}" ولن يمكن استرجاعها.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">
              حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
};

export default Packages;
