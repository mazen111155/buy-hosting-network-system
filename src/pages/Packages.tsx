import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash, Clock, Wifi, Users } from 'lucide-react';
import AddPackageDialog from '@/components/AddPackageDialog';
import { useToast } from '@/hooks/use-toast';

const Packages = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  const packages = [
    {
      id: 1,
      name: 'باقة يومية',
      price: 5,
      duration: '24 ساعة',
      speed: '10 Mbps',
      dataLimit: '5 GB',
      users: 45,
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 2,
      name: 'باقة أسبوعية',
      price: 25,
      duration: '7 أيام',
      speed: '20 Mbps',
      dataLimit: '25 GB',
      users: 120,
      color: 'from-green-500 to-green-600'
    },
    {
      id: 3,
      name: 'باقة شهرية',
      price: 75,
      duration: '30 يوم',
      speed: '50 Mbps',
      dataLimit: '100 GB',
      users: 230,
      color: 'from-purple-500 to-purple-600'
    },
    {
      id: 4,
      name: 'باقة سنوية',
      price: 600,
      duration: '365 يوم',
      speed: '100 Mbps',
      dataLimit: 'غير محدود',
      users: 85,
      color: 'from-orange-500 to-orange-600'
    }
  ];

  const handleDelete = (name: string) => {
    toast({
      title: 'تم الحذف',
      description: `تم حذف ${name} بنجاح`
    });
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

        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {packages.map((pkg) => (
            <div 
              key={pkg.id} 
              className="bg-white rounded-2xl shadow-sm border overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Header */}
              <div className={`bg-gradient-to-r ${pkg.color} p-6 text-white`}>
                <h3 className="text-xl font-bold mb-2">{pkg.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold">${pkg.price}</span>
                  <span className="text-white/80">/ {pkg.duration}</span>
                </div>
              </div>

              {/* Features */}
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Clock className="w-5 h-5" />
                  <span>المدة: {pkg.duration}</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Wifi className="w-5 h-5" />
                  <span>السرعة: {pkg.speed}</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Users className="w-5 h-5" />
                  <span>{pkg.users} مشترك</span>
                </div>
                <div className="pt-2 border-t text-center">
                  <span className="text-sm text-muted-foreground">حد البيانات: </span>
                  <span className="font-bold">{pkg.dataLimit}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="p-4 bg-slate-50 flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Edit className="w-4 h-4 ml-1" />
                  تعديل
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-red-500 hover:text-red-600"
                  onClick={() => handleDelete(pkg.name)}
                >
                  <Trash className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <AddPackageDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </DashboardLayout>
  );
};

export default Packages;
