import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import StatsCard from '@/components/StatsCard';
import RecentActivityCard from '@/components/RecentActivityCard';
import QuickActionsCard from '@/components/QuickActionsCard';
import UsageChart from '@/components/UsageChart';
import { Users, CreditCard, Wifi, TrendingUp, Loader2 } from 'lucide-react';
import db from '@/lib/shared/kliv-database.js';

const Dashboard = () => {
  const [stats, setStats] = useState([
    {
      title: 'المشتركين النشطين',
      value: '0',
      change: '',
      changeType: 'positive' as const,
      icon: Users
    },
    {
      title: 'الكروت المتاحة',
      value: '0',
      change: '',
      changeType: 'positive' as const,
      icon: CreditCard
    },
    {
      title: 'الباقات',
      value: '0',
      change: '',
      changeType: 'positive' as const,
      icon: Wifi
    },
    {
      title: 'الإيرادات المتوقعة',
      value: '$0',
      change: '',
      changeType: 'positive' as const,
      icon: TrendingUp
    }
  ]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [activeSubscribers, availableCards, totalPackages, subscribers, packages] = await Promise.all([
          db.count('subscribers', { status: 'eq.active' }),
          db.count('cards', { status: 'eq.unused' }),
          db.count('packages', { is_active: 'eq.1' }),
          db.query('subscribers', { status: 'eq.active' }),
          db.query('packages', { is_active: 'eq.1' })
        ]);

        // Calculate expected revenue
        let expectedRevenue = 0;
        if (subscribers && packages) {
          for (const sub of subscribers) {
            const pkg = packages.find((p: { _row_id: number; price: number }) => p._row_id === sub.package_id);
            if (pkg) {
              expectedRevenue += pkg.price;
            }
          }
        }

        setStats([
          {
            title: 'المشتركين النشطين',
            value: activeSubscribers.toString(),
            change: '',
            changeType: 'positive' as const,
            icon: Users
          },
          {
            title: 'الكروت المتاحة',
            value: availableCards.toString(),
            change: '',
            changeType: 'positive' as const,
            icon: CreditCard
          },
          {
            title: 'الباقات',
            value: totalPackages.toString(),
            change: '',
            changeType: 'positive' as const,
            icon: Wifi
          },
          {
            title: 'الإيرادات المتوقعة',
            value: `$${expectedRevenue}`,
            change: '',
            changeType: 'positive' as const,
            icon: TrendingUp
          }
        ]);
      } catch (error) {
        console.log('Error loading stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStats();
  }, []);

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
