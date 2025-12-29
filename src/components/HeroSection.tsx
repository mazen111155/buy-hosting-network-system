import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Wifi, Play } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="pt-32 pb-20 px-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="text-center lg:text-right animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-600 font-medium mb-6">
              <Wifi className="w-4 h-4" />
              <span>نظام إدارة شبكات متكامل</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
              إدارة شبكتك
              <br />
              <span className="gradient-text">بكل سهولة</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-lg mx-auto lg:mx-0">
              نظام مكروتك هوستبت يوفر لك حلولاً متكاملة لإدارة شبكات الواي فاي 
              والهوتسبوت مع لوحة تحكم سهلة وتقارير تفصيلية
            </p>
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
              <Link to="/dashboard">
                <Button size="lg" className="gradient-primary text-white font-bold btn-glow">
                  ابدأ الآن مجاناً
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="font-medium">
                <Play className="w-4 h-4 ml-2" />
                شاهد الفيديو
              </Button>
            </div>
          </div>

          {/* Hero Image/Illustration */}
          <div className="relative animate-float">
            <div className="relative w-full max-w-md mx-auto">
              {/* Main Card */}
              <div className="glass-card rounded-3xl p-8 relative z-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center">
                    <Wifi className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">شبكة مكروتك</h3>
                    <p className="text-sm text-green-500">● متصل</p>
                  </div>
                </div>
                
                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-blue-50 rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold text-blue-600">256</p>
                    <p className="text-sm text-muted-foreground">مستخدم نشط</p>
                  </div>
                  <div className="bg-cyan-50 rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold text-cyan-600">99.9%</p>
                    <p className="text-sm text-muted-foreground">وقت التشغيل</p>
                  </div>
                </div>

                {/* Speed Meter */}
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">سرعة الاتصال</span>
                    <span className="text-sm font-bold text-blue-600">100 Mbps</span>
                  </div>
                  <div className="h-2 bg-white rounded-full overflow-hidden">
                    <div className="h-full w-4/5 gradient-primary rounded-full"></div>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-blue-500 rounded-2xl flex items-center justify-center shadow-lg animate-pulse-slow">
                <span className="text-white font-bold text-xl">5G</span>
              </div>
              <div className="absolute -bottom-4 -left-4 glass-card rounded-xl p-3 shadow-lg">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                    <span className="text-green-600">✓</span>
                  </div>
                  <span className="text-sm font-medium">آمن 100%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
