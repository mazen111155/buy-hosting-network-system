import { Users, Wifi, Globe, Clock } from 'lucide-react';

const StatsSection = () => {
  const stats = [
    { icon: Users, value: '10,000+', label: 'مستخدم نشط' },
    { icon: Wifi, value: '500+', label: 'شبكة متصلة' },
    { icon: Globe, value: '50+', label: 'مدينة' },
    { icon: Clock, value: '99.9%', label: 'وقت التشغيل' }
  ];

  return (
    <section className="py-16 px-4">
      <div className="container mx-auto">
        <div className="gradient-primary rounded-3xl p-12 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          </div>
          
          <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center text-white">
                <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-8 h-8" />
                </div>
                <p className="text-3xl md:text-4xl font-bold mb-2">{stat.value}</p>
                <p className="text-white/80">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
