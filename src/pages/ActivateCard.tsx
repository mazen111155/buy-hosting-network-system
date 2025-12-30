import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Wifi, CreditCard, Loader2, CheckCircle, XCircle, Clock, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import db from '@/lib/shared/kliv-database.js';

interface PackageInfo {
  name: string;
  duration_days: number;
  speed_limit: string;
  download_limit: string;
}

interface CardInfo {
  code: string;
  package_id: number;
  status: string;
}

const ActivateCard = () => {
  const [code, setCode] = useState('');
  const [username, setUsername] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isActivating, setIsActivating] = useState(false);
  const [cardInfo, setCardInfo] = useState<CardInfo | null>(null);
  const [packageInfo, setPackageInfo] = useState<PackageInfo | null>(null);
  const [activationResult, setActivationResult] = useState<{ success: boolean; password?: string; expires?: string } | null>(null);
  const { toast } = useToast();

  const verifyCard = async () => {
    if (!code || code.length < 5) {
      toast({
        title: 'خطأ',
        description: 'يرجى إدخال كود الكرت',
        variant: 'destructive'
      });
      return;
    }

    setIsVerifying(true);
    setCardInfo(null);
    setPackageInfo(null);
    setActivationResult(null);

    try {
      const cards = await db.query('cards', { code: `eq.${code}` });
      console.log('Card query result:', cards);
      
      if (!cards || cards.length === 0) {
        toast({
          title: 'كرت غير صالح',
          description: 'الكود المدخل غير موجود',
          variant: 'destructive'
        });
        return;
      }

      const card = cards[0];
      setCardInfo(card);

      if (card.status === 'used') {
        toast({
          title: 'كرت مستخدم',
          description: 'هذا الكرت تم استخدامه مسبقاً',
          variant: 'destructive'
        });
        return;
      }

      // Get package info
      const packages = await db.query('packages', { _row_id: `eq.${card.package_id}` });
      if (packages && packages.length > 0) {
        setPackageInfo(packages[0]);
      }

      toast({
        title: 'كرت صالح',
        description: 'يمكنك الآن تفعيل الكرت'
      });
    } catch (error) {
      console.log('Error verifying card:', error);
      toast({
        title: 'خطأ',
        description: 'حدث خطأ أثناء التحقق من الكرت',
        variant: 'destructive'
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const activateCard = async () => {
    if (!username) {
      toast({
        title: 'خطأ',
        description: 'يرجى إدخال اسم المستخدم',
        variant: 'destructive'
      });
      return;
    }

    if (!cardInfo || !packageInfo) {
      toast({
        title: 'خطأ',
        description: 'يرجى التحقق من الكرت أولاً',
        variant: 'destructive'
      });
      return;
    }

    setIsActivating(true);

    try {
      const now = Math.floor(Date.now() / 1000);
      const expiresAt = now + (packageInfo.duration_days * 24 * 60 * 60);
      const password = Math.random().toString(36).substring(2, 10);

      // Check if subscriber exists
      const existingSubs = await db.query('subscribers', { username: `eq.${username}` });
      
      if (existingSubs && existingSubs.length > 0) {
        // Update existing subscriber
        await db.update('subscribers', 
          { _row_id: `eq.${existingSubs[0]._row_id}` },
          {
            expires_at: expiresAt,
            package_id: cardInfo.package_id,
            status: 'active'
          }
        );
      } else {
        // Create new subscriber
        await db.insert('subscribers', {
          username: username,
          password: password,
          package_id: cardInfo.package_id,
          status: 'active',
          started_at: now,
          expires_at: expiresAt,
          total_download: 0,
          total_upload: 0
        });
      }

      // Mark card as used
      await db.update('cards',
        { code: `eq.${code}` },
        {
          status: 'used',
          used_by: username,
          used_at: now
        }
      );

      setActivationResult({
        success: true,
        password: existingSubs && existingSubs.length > 0 ? undefined : password,
        expires: new Date(expiresAt * 1000).toLocaleDateString('ar-SA')
      });

      toast({
        title: 'تم التفعيل بنجاح!',
        description: 'يمكنك الآن استخدام الإنترنت'
      });
    } catch (error) {
      console.log('Error activating card:', error);
      toast({
        title: 'خطأ',
        description: 'حدث خطأ أثناء التفعيل',
        variant: 'destructive'
      });
      setActivationResult({ success: false });
    } finally {
      setIsActivating(false);
    }
  };

  const reset = () => {
    setCode('');
    setUsername('');
    setCardInfo(null);
    setPackageInfo(null);
    setActivationResult(null);
  };

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl"></div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center">
              <Wifi className="w-8 h-8 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">مكروتك هوستبت</span>
          </Link>
        </div>

        {activationResult?.success ? (
          /* Success Result */
          <Card className="glass-card">
            <CardHeader className="text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <CardTitle className="text-2xl text-green-600">تم التفعيل بنجاح!</CardTitle>
              <CardDescription>يمكنك الآن الاتصال بالإنترنت</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-slate-100 rounded-xl p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">اسم المستخدم:</span>
                  <span className="font-bold font-mono">{username}</span>
                </div>
                {activationResult.password && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">كلمة المرور:</span>
                    <span className="font-bold font-mono">{activationResult.password}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">تاريخ الانتهاء:</span>
                  <span className="font-bold">{activationResult.expires}</span>
                </div>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-sm text-yellow-800">
                <strong>هام:</strong> احفظ بيانات الدخول في مكان آمن
              </div>

              <Button onClick={reset} className="w-full gradient-primary text-white">
                تفعيل كرت آخر
              </Button>
            </CardContent>
          </Card>
        ) : (
          /* Main Form */
          <Card className="glass-card">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <CreditCard className="w-8 h-8 text-primary" />
                <CardTitle>تفعيل كرت الإنترنت</CardTitle>
              </div>
              <CardDescription>أدخل كود الكرت لتفعيل اشتراكك</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Step 1: Enter Code */}
              <div className="space-y-3">
                <Label htmlFor="code">كود الكرت</Label>
                <div className="flex gap-2">
                  <Input
                    id="code"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    placeholder="MKT-XXXX-XXXX-XXXX"
                    className="font-mono"
                    dir="ltr"
                    disabled={isVerifying || (cardInfo?.status === 'unused')}
                  />
                  <Button 
                    onClick={verifyCard}
                    disabled={isVerifying || (cardInfo?.status === 'unused')}
                    variant={cardInfo?.status === 'unused' ? 'outline' : 'default'}
                  >
                    {isVerifying ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : cardInfo?.status === 'unused' ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      'تحقق'
                    )}
                  </Button>
                </div>
              </div>

              {/* Package Info */}
              {packageInfo && cardInfo?.status === 'unused' && (
                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl p-4 text-white">
                  <h3 className="font-bold text-lg mb-3">{packageInfo.name}</h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{packageInfo.duration_days} يوم</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4" />
                      <span>{packageInfo.speed_limit || 'غير محدود'}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Card Error */}
              {cardInfo?.status === 'used' && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
                  <XCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-red-800">كرت مستخدم</p>
                    <p className="text-sm text-red-600">هذا الكرت تم استخدامه مسبقاً</p>
                  </div>
                </div>
              )}

              {/* Step 2: Enter Username */}
              {packageInfo && cardInfo?.status === 'unused' && (
                <div className="space-y-3 pt-4 border-t">
                  <Label htmlFor="username">اسم المستخدم</Label>
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                    placeholder="أدخل اسم المستخدم"
                    className="font-mono"
                    dir="ltr"
                    disabled={isActivating}
                  />
                  <p className="text-xs text-muted-foreground">
                    استخدم أحرف إنجليزية صغيرة وأرقام فقط
                  </p>

                  <Button 
                    onClick={activateCard}
                    className="w-full gradient-primary text-white h-12 text-lg"
                    disabled={isActivating || !username}
                  >
                    {isActivating ? (
                      <>
                        <Loader2 className="w-5 h-5 ml-2 animate-spin" />
                        جاري التفعيل...
                      </>
                    ) : (
                      'تفعيل الكرت'
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Footer */}
        <div className="text-center mt-6">
          <Link to="/" className="text-white/70 hover:text-white text-sm">
            الرجوع للصفحة الرئيسية
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ActivateCard;
