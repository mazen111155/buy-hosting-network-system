import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search, UserPlus, MoreHorizontal, Edit, Trash, Eye } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AddUserDialog from '@/components/AddUserDialog';

const Users = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

  const users = [
    { id: 1, name: 'أحمد محمد', email: 'ahmed@example.com', package: 'شهري', status: 'نشط', expiry: '2024-02-15', usage: '45 GB' },
    { id: 2, name: 'سارة علي', email: 'sara@example.com', package: 'أسبوعي', status: 'نشط', expiry: '2024-01-20', usage: '12 GB' },
    { id: 3, name: 'محمد خالد', email: 'mohammed@example.com', package: 'يومي', status: 'منتهي', expiry: '2024-01-10', usage: '2 GB' },
    { id: 4, name: 'فاطمة أحمد', email: 'fatima@example.com', package: 'شهري', status: 'نشط', expiry: '2024-02-28', usage: '78 GB' },
    { id: 5, name: 'عمر حسن', email: 'omar@example.com', package: 'سنوي', status: 'نشط', expiry: '2024-12-01', usage: '156 GB' },
  ];

  const filteredUsers = users.filter(user => 
    user.name.includes(searchQuery) || 
    user.email.includes(searchQuery)
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="relative w-full sm:w-80">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="البحث عن مستخدم..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10"
            />
          </div>
          <Button 
            className="gradient-primary text-white"
            onClick={() => setDialogOpen(true)}
          >
            <UserPlus className="w-5 h-5 ml-2" />
            إضافة مستخدم
          </Button>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">المستخدم</TableHead>
                <TableHead className="text-right">الباقة</TableHead>
                <TableHead className="text-right">الحالة</TableHead>
                <TableHead className="text-right">تاريخ الانتهاء</TableHead>
                <TableHead className="text-right">الاستخدام</TableHead>
                <TableHead className="text-right">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-white font-bold">
                        {user.name[0]}
                      </div>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{user.package}</TableCell>
                  <TableCell>
                    <Badge variant={user.status === 'نشط' ? 'default' : 'destructive'}>
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{user.expiry}</TableCell>
                  <TableCell>{user.usage}</TableCell>
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
                        <DropdownMenuItem className="gap-2 text-red-500">
                          <Trash className="w-4 h-4" /> حذف
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <AddUserDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </DashboardLayout>
  );
};

export default Users;
