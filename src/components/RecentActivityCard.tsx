import { User, CreditCard, Wifi, Clock } from 'lucide-react';

const RecentActivityCard = () => {
  const activities = [
    {
      icon: User,
      title: 'مستخدم جديد',
      description: 'أحمد محمد سجل حساب جديد',
      time: 'منذ 5 دقائق',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    {
      icon: CreditCard,
      title: 'كرت مباع',
      description: 'باقة شهرية - 50$',
      time: 'منذ 15 دقيقة',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600'
    },
    {
      icon: Wifi,
      title: 'جهاز متصل',
      description: 'iPhone 15 Pro متصل الآن',
      time: 'منذ 30 دقيقة',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600'
    },
    {
      icon: User,
      title: 'تجديد اشتراك',
      description: 'محمد علي جدد اشتراكه',
      time: 'منذ ساعة',
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600'
    }
  ];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-lg">النشاط الأخير</h3>
        <Clock className="w-5 h-5 text-muted-foreground" />
      </div>

      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-start gap-3">
            <div className={`w-10 h-10 rounded-xl ${activity.iconBg} flex items-center justify-center flex-shrink-0`}>
              <activity.icon className={`w-5 h-5 ${activity.iconColor}`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm">{activity.title}</p>
              <p className="text-muted-foreground text-sm truncate">{activity.description}</p>
              <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivityCard;
