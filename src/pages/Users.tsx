import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search, UserPlus, MoreHorizontal, Edit, Trash, Eye, Loader2, RefreshCw } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AddSubscriberDialog from '@/components/AddSubscriberDialog';
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

interface Subscriber {
  _row_id: number;
  username: string;
  password: string;
  full_name: string;
  phone: string;
  email: string;
  mac_address: string;
  ip_address: string;
  package_id: number;
  status: string;
  started_at: number;
  expires_at: number;
  total_download: number;
  total_upload: number;
  last_seen: number;
  _created_at: number;
}

interface Package {
  _row_id: number;
  name: string;
}

const Users = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [selectedSubscriber, setSelectedSubscriber] = useState<Subscriber | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [subsData, pkgData] = await Promise.all([
        db.query('subscribers', {}, { order: '_created_at.desc' }),
        db.query('packages', { is_active: 'eq.1' })
      ]);
      console.log('Loaded subscribers:', subsData);
      setSubscribers(subsData || []);
      setPackages(pkgData || []);
    } catch (error) {
      console.log('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const getPackageName = (packageId: number) => {
    const pkg = packages.find(p => p._row_id === packageId);
    return pkg?.name || '-';
  };

  const formatDate = (timestamp: number) => {
    if (!timestamp) return '-';
    return new Date(timestamp * 1000).toLocaleDateString('ar-SA');
  };

  const formatBytes = (bytes: number) => {
    if (!bytes) return '0 B';
    const gb = bytes / (1024 * 1024 * 1024);
    if (gb >= 1) return `${gb.toFixed(1)} GB`;
    const mb = bytes / (1024 * 1024);
    if (mb >= 1) return `${mb.toFixed(1)} MB`;
    return `${(bytes / 1024).toFixed(1)} KB`;
  };

  const getStatus = (subscriber: Subscriber) => {
    if (subscriber.status !== 'active') return 'منتهي';
    if (subscriber.expires_at && subscriber.expires_at < Date.now() / 1000) return 'منتهي';
    return 'نشط';
  };

  const handleDelete = async () => {
    if (!selectedSubscriber) return;
    try {
      await db.delete('subscribers', { _row_id: `eq.${selectedSubscriber._row_id}` });
      toast({
        title: 'تم الحذف',
        description: 'تم حذف المشترك بنجاح'
      });
      loadData();
    } catch (error) {
      console.log('Error deleting subscriber:', error);
      toast({
        title: 'خطأ',
        description: 'فشل في حذف المشترك',
        variant: 'destructive'
      });
    } finally {
      setDeleteDialogOpen(false);
      setSelectedSubscriber(null);
    }
  };

  const filteredUsers = subscribers.filter(user => 
    (user.full_name || '').includes(searchQuery) || 
    (user.username || '').includes(searchQuery) ||
    (user.phone || '').includes(searchQuery)
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="flex gap-2 items-center w-full sm:w-auto">
            <div className="relative flex-1 sm:w-80">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="البحث عن مشترك..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
            </div>
            <Button variant="outline" size="icon" onClick={loadData}>
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
          <Button 
            className="gradient-primary text-white"
            onClick={() => setDialogOpen(true)}
          >
            <UserPlus className="w-5 h-5 ml-2" />
            إضافة مشترك
          </Button>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              {searchQuery ? 'لا توجد نتائج للبحث' : 'لا يوجد مشتركين بعد'}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">المشترك</TableHead>
                  <TableHead className="text-right">الباقة</TableHead>
                  <TableHead className="text-right">الحالة</TableHead>
                  <TableHead className="text-right">تاريخ الانتهاء</TableHead>
                  <TableHead className="text-right">الاستخدام</TableHead>
                  <TableHead className="text-right">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user._row_id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-white font-bold">
                          {(user.full_name || user.username || '?')[0]}
                        </div>
                        <div>
                          <p className="font-medium">{user.full_name || user.username}</p>
                          <p className="text-sm text-muted-foreground">{user.phone || user.username}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getPackageName(user.package_id)}</TableCell>
                    <TableCell>
                      <Badge variant={getStatus(user) === 'نشط' ? 'default' : 'destructive'}>
                        {getStatus(user)}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(user.expires_at)}</TableCell>
                    <TableCell>{formatBytes(user.total_download + user.total_upload)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="w-5 h-5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-white">
                          <DropdownMenuItem className="gap-2">
                            <Eye className="w-4 h-4" /> عرض
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2">
                            <Edit className="w-4 h-4" /> تعديل
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="gap-2 text-red-500"
                            onClick={() => {
                              setSelectedSubscriber(user);
                              setDeleteDialogOpen(true);
                            }}
                          >
                            <Trash className="w-4 h-4" /> حذف
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>

      <AddSubscriberDialog 
        open={dialogOpen} 
        onOpenChange={setDialogOpen}
        packages={packages}
        onSuccess={loadData}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>هل أنت متأكد من الحذف؟</AlertDialogTitle>
            <AlertDialogDescription>
              سيتم حذف المشترك "{selectedSubscriber?.full_name || selectedSubscriber?.username}" نهائياً.
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

export default Users;
