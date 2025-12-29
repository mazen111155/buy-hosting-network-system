import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Wifi, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Demo login - في النسخة الحقيقية سيتم الاتصال بالـ API
    setTimeout(() => {
      if (email && password) {
        toast({
          title: 'تم تسجيل الدخول بنجاح',
          description: 'مرحباً بك في لوحة التحكم'
        });
        navigate('/dashboard');
      } else {
        toast({
          title: 'خطأ',
          description: 'يرجى إدخال البريد الإلكتروني وكلمة المرور',
          variant: 'destructive'
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl"></div>

      <div className="w-full max-w-md relative z-10 animate-scale-in">
        <div className="glass-card rounded-3xl p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-3 mb-4">
              <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center">
                <Wifi className="w-8 h-8 text-white" />
              </div>
            </Link>
            <h1 className="text-2xl font-bold">تسجيل الدخول</h1>
            <p className="text-muted-foreground mt-2">
              أدخل بياناتك للوصول إلى لوحة التحكم
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12"
                dir="ltr"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">كلمة المرور</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 pl-12"
                  dir="ltr"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded border-gray-300" />
                <span>تذكرني</span>
              </label>
              <a href="#" className="text-primary hover:underline">نسيت كلمة المرور؟</a>
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 gradient-primary text-white font-bold btn-glow"
              disabled={isLoading}
            >
              {isLoading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
            </Button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-blue-50 rounded-xl">
            <p className="text-sm text-center text-muted-foreground">
              <strong>للتجربة:</strong> أدخل أي بريد وكلمة مرور
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
