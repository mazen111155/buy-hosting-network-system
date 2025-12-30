import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Wifi, Shield, Zap, Users, Globe, Clock, Download, CreditCard } from 'lucide-react';
import HeroSection from '@/components/HeroSection';
import FeatureCard from '@/components/FeatureCard';
import StatsSection from '@/components/StatsSection';
import Footer from '@/components/Footer';

const Index = () => {
  const features = [
    {
      icon: Wifi,
      title: 'شبكة سريعة وموثوقة',
      description: 'اتصال إنترنت عالي السرعة مع ضمان استقرار الخدمة على مدار الساعة'
    },
    {
      icon: Shield,
      title: 'حماية متقدمة',
      description: 'نظام أمان متكامل لحماية شبكتك ومستخدميك من التهديدات'
    },
    {
      icon: Zap,
      title: 'إعداد سريع',
      description: 'ابدأ في دقائق مع واجهة سهلة الاستخدام ودعم فني متواصل'
    },
    {
      icon: Users,
      title: 'إدارة المستخدمين',
      description: 'تحكم كامل في المشتركين مع تقارير تفصيلية للاستخدام'
    },
    {
      icon: Globe,
      title: 'باقات مرنة',
      description: 'أنشئ باقات متنوعة تناسب جميع احتياجات عملائك'
    },
    {
      icon: Clock,
      title: 'دعم 24/7',
      description: 'فريق دعم فني متخصص جاهز لمساعدتك في أي وقت'
    }
  ];

  return (
    <div className="min-h-screen gradient-bg">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
              <Wifi className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">مكروتك هوستبت</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/activate">
              <Button variant="outline" className="font-medium gap-2">
                <CreditCard className="w-4 h-4" />
                تفعيل كرت
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="ghost" className="font-medium">
                تسجيل الدخول
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button className="gradient-primary text-white font-medium btn-glow">
                لوحة التحكم
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              لماذا تختار <span className="gradient-text">مكروتك هوستبت</span>؟
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              نوفر لك أفضل الحلول لإدارة شبكات الواي فاي والهوتسبوت بكفاءة عالية
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <StatsSection />

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="glass-card rounded-3xl p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 gradient-primary opacity-5"></div>
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                ابدأ الآن مع مكروتك هوستبت
              </h2>
              <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
                انضم إلى آلاف العملاء الذين يثقون بنا لإدارة شبكاتهم
              </p>
              <Link to="/dashboard">
                <Button size="lg" className="gradient-primary text-white font-bold text-lg px-8 btn-glow">
                  جرب مجاناً الآن
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;