import React, { useState, useEffect } from 'react';
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
import { CreditCard, Copy, Printer, Download, Loader2, Trash } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import db from '@/lib/shared/kliv-database.js';

interface Package {
  _row_id: number;
  name: string;
  price: number;
  duration_days: number;
}

interface Card {
  _row_id: number;
  code: string;
  package_id: number;
  status: string;
  used_by: string;
  used_at: number;
  batch_id: string;
  _created_at: number;
}

const Cards = () => {
  const [quantity, setQuantity] = useState('10');
  const [packageType, setPackageType] = useState('');
  const [packages, setPackages] = useState<Package[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [pkgData, cardsData] = await Promise.all([
        db.query('packages', { is_active: 'eq.1' }),
        db.query('cards', {}, { order: '_created_at.desc', limit: 100 })
      ]);
      console.log('Loaded packages:', pkgData);
      console.log('Loaded cards:', cardsData);
      setPackages(pkgData || []);
      setCards(cardsData || []);
    } catch (error) {
      console.log('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const generateCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const segments = [];
    for (let i = 0; i < 4; i++) {
      let segment = '';
      for (let j = 0; j < 4; j++) {
        segment += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      segments.push(segment);
    }
    return 'MKT-' + segments.join('-');
  };

  const handleGenerate = async () => {
    if (!packageType) {
      toast({
        title: 'خطأ',
        description: 'يرجى اختيار الباقة أولاً',
        variant: 'destructive'
      });
      return;
    }

    const qty = parseInt(quantity);
    if (qty < 1 || qty > 100) {
      toast({
        title: 'خطأ',
        description: 'عدد الكروت يجب أن يكون بين 1 و 100',
        variant: 'destructive'
      });
      return;
    }

    setIsGenerating(true);
    const batchId = `BATCH-${Date.now()}`;

    try {
      for (let i = 0; i < qty; i++) {
        await db.insert('cards', {
          code: generateCode(),
          package_id: parseInt(packageType),
          status: 'unused',
          batch_id: batchId
        });
      }
      
      toast({
        title: 'تم التوليد بنجاح',
        description: `تم توليد ${qty} كرت جديد`
      });
      
      loadData();
    } catch (error) {
      console.log('Error generating cards:', error);
      toast({
        title: 'خطأ',
        description: 'فشل في توليد الكروت',
        variant: 'destructive'
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: 'تم النسخ',
      description: 'تم نسخ الكود إلى الحافظة'
    });
  };

  const handleDelete = async (cardId: number) => {
    try {
      await db.delete('cards', { _row_id: `eq.${cardId}` });
      toast({
        title: 'تم الحذف',
        description: 'تم حذف الكرت بنجاح'
      });
      loadData();
    } catch (error) {
      console.log('Error deleting card:', error);
    }
  };

  const getPackageName = (packageId: number) => {
    const pkg = packages.find(p => p._row_id === packageId);
    return pkg?.name || 'غير معروف';
  };

  const formatDate = (timestamp: number) => {
    if (!timestamp) return '-';
    return new Date(timestamp * 1000).toLocaleDateString('ar-SA');
  };

  const exportCards = () => {
    const unusedCards = cards.filter(c => c.status === 'unused');
    const content = unusedCards.map(c => `${c.code},${getPackageName(c.package_id)}`).join('\n');
    const blob = new Blob([content], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cards-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast({
      title: 'تم التصدير',
      description: `تم تصدير ${unusedCards.length} كرت`
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
                  {packages.map(pkg => (
                    <SelectItem key={pkg._row_id} value={pkg._row_id.toString()}>
                      {pkg.name} - ${pkg.price}
                    </SelectItem>
                  ))}
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
                disabled={isGenerating}
              />
            </div>

            <div className="flex items-end gap-2 md:col-span-2">
              <Button 
                className="gradient-primary text-white flex-1"
                onClick={handleGenerate}
                disabled={isGenerating || packages.length === 0}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 ml-2 animate-spin" />
                    جاري التوليد...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5 ml-2" />
                    توليد الكروت
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={() => window.print()}>
                <Printer className="w-5 h-5" />
              </Button>
              <Button variant="outline" onClick={exportCards}>
                <Download className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Cards Table */}
        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
          <div className="p-6 border-b flex justify-between items-center">
            <h3 className="font-bold text-lg">الكروت المولدة ({cards.length})</h3>
            <div className="flex gap-2">
              <Badge variant="default">{cards.filter(c => c.status === 'unused').length} متاح</Badge>
              <Badge variant="secondary">{cards.filter(c => c.status === 'used').length} مستخدم</Badge>
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : cards.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              لا توجد كروت. قم بتوليد كروت جديدة من الأعلى.
            </div>
          ) : (
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
                {cards.map((card) => (
                  <TableRow key={card._row_id}>
                    <TableCell>
                      <code className="bg-slate-100 px-3 py-1 rounded-lg font-mono text-sm">
                        {card.code}
                      </code>
                    </TableCell>
                    <TableCell>{getPackageName(card.package_id)}</TableCell>
                    <TableCell>
                      <Badge variant={card.status === 'unused' ? 'default' : 'secondary'}>
                        {card.status === 'unused' ? 'متاح' : 'مستخدم'}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(card._created_at)}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => copyCode(card.code)}
                        >
                          <Copy className="w-4 h-4 ml-1" />
                          نسخ
                        </Button>
                        {card.status === 'unused' && (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="text-red-500"
                            onClick={() => handleDelete(card._row_id)}
                          >
                            <Trash className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Cards;
