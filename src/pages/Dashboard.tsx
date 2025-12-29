import DashboardLayout from '@/components/DashboardLayout';
import StatsCard from '@/components/StatsCard';
import RecentActivityCard from '@/components/RecentActivityCard';
import QuickActionsCard from '@/components/QuickActionsCard';
import UsageChart from '@/components/UsageChart';
import { Users, CreditCard, Wifi, TrendingUp } from 'lucide-react';

const Dashboard = () => {
  const stats = [
    {
      title: 'المستخدمين النشطين',
      value: '256',
      change: '+12%',
      changeType: 'positive' as const,
      icon: Users
    },
    {
      title: 'الكروت المباعة',
      value: '1,234',
      change: '+8%',
      changeType: 'positive' as const,
      icon: CreditCard
    },
    {
      title: 'الأجهزة المتصلة',
      value: '189',
      change: '-3%',
      changeType: 'negative' as const,
      icon: Wifi
    },
    {
      title: 'الإيرادات الشهرية',
      value: '12,500$',
      change: '+25%',
      changeType: 'positive' as const,
      icon: TrendingUp
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))}
        </div>

        {/* Charts & Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <UsageChart />
          </div>
          <div>
            <RecentActivityCard />
          </div>
        </div>

        {/* Quick Actions */}
        <QuickActionsCard />
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
