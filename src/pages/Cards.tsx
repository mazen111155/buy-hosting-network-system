import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
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
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Copy, Printer, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Cards = () => {
  const [quantity, setQuantity] = useState('10');
  const [packageType, setPackageType] = useState('');
  const { toast } = useToast();

  const generatedCards = [
    { id: 1, code: 'MKT-A7B9-C3D5-E8F2', package: 'يومي', status: 'متاح', createdAt: '2024-01-15' },
    { id: 2, code: 'MKT-K2L4-M6N8-P9Q1', package: 'أسبوعي', status: 'مستخدم', createdAt: '2024-01-14' },
    { id: 3, code: 'MKT-R3S5-T7U9-V2W4', package: 'شهري', status: 'متاح', createdAt: '2024-01-14' },
    { id: 4, code: 'MKT-X6Y8-Z1A3-B5C7', package: 'يومي', status: 'متاح', createdAt: '2024-01-13' },
    { id: 5, code: 'MKT-D9E2-F4G6-H8I1', package: 'سنوي', status: 'مستخدم', createdAt: '2024-01-12' },
  ];

  const handleGenerate = () => {
    toast({
      title: 'تم التوليد بنجاح',
      description: `تم توليد ${quantity} كرت جديد`
    });
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: 'تم النسخ',
      description: 'تم نسخ الكود إلى الحافظة'
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Generate Cards Section */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold">توليد كروت جديدة</h2>
              <p className="text-muted-foreground">إنشاء كروت إنترنت للبيع</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>الباقة</Label>
              <Select value={packageType} onValueChange={setPackageType}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر الباقة" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="daily">يومي - $5</SelectItem>
                  <SelectItem value="weekly">أسبوعي - $25</SelectItem>
                  <SelectItem value="monthly">شهري - $75</SelectItem>
                  <SelectItem value="yearly">سنوي - $600</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>عدد الكروت</Label>
              <Input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                min="1"
                max="100"
              />
            </div>

            <div className="flex items-end gap-2 md:col-span-2">
              <Button 
                className="gradient-primary text-white flex-1"
                onClick={handleGenerate}
              >
                <CreditCard className="w-5 h-5 ml-2" />
                توليد الكروت
              </Button>
              <Button variant="outline">
                <Printer className="w-5 h-5" />
              </Button>
              <Button variant="outline">
                <Download className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Cards Table */}
        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
          <div className="p-6 border-b">
            <h3 className="font-bold text-lg">الكروت المولدة</h3>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">الكود</TableHead>
                <TableHead className="text-right">الباقة</TableHead>
                <TableHead className="text-right">الحالة</TableHead>
                <TableHead className="text-right">تاريخ الإنشاء</TableHead>
                <TableHead className="text-right">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {generatedCards.map((card) => (
                <TableRow key={card.id}>
                  <TableCell>
                    <code className="bg-slate-100 px-3 py-1 rounded-lg font-mono text-sm">
                      {card.code}
                    </code>
                  </TableCell>
                  <TableCell>{card.package}</TableCell>
                  <TableCell>
                    <Badge variant={card.status === 'متاح' ? 'default' : 'secondary'}>
                      {card.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{card.createdAt}</TableCell>
                  <TableCell>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => copyCode(card.code)}
                    >
                      <Copy className="w-4 h-4 ml-1" />
                      نسخ
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Cards;
