import DashboardLayout from '@/components/DashboardLayout';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { TrendingUp, Users, CreditCard, DollarSign } from 'lucide-react';

const Reports = () => {
  const monthlyData = [
    { month: 'يناير', sales: 4000, users: 120 },
    { month: 'فبراير', sales: 5500, users: 150 },
    { month: 'مارس', sales: 6200, users: 180 },
    { month: 'أبريل', sales: 7800, users: 220 },
    { month: 'مايو', sales: 7200, users: 200 },
    { month: 'يونيو', sales: 8500, users: 256 },
  ];

  const packageDistribution = [
    { name: 'يومي', value: 35, color: '#3B82F6' },
    { name: 'أسبوعي', value: 25, color: '#10B981' },
    { name: 'شهري', value: 30, color: '#8B5CF6' },
    { name: 'سنوي', value: 10, color: '#F59E0B' },
  ];

  const dailyUsage = [
    { day: 'السبت', usage: 150 },
    { day: 'الأحد', usage: 180 },
    { day: 'الإثنين', usage: 220 },
    { day: 'الثلاثاء', usage: 200 },
    { day: 'الأربعاء', usage: 250 },
    { day: 'الخميس', usage: 280 },
    { day: 'الجمعة', usage: 190 },
  ];

  const summaryCards = [
    { title: 'إجمالي الإيرادات', value: '$39,200', change: '+15%', icon: DollarSign, color: 'bg-green-100 text-green-600' },
    { title: 'إجمالي المستخدمين', value: '1,256', change: '+8%', icon: Users, color: 'bg-blue-100 text-blue-600' },
    { title: 'الكروت المباعة', value: '3,420', change: '+12%', icon: CreditCard, color: 'bg-purple-100 text-purple-600' },
    { title: 'معدل النمو', value: '24%', change: '+5%', icon: TrendingUp, color: 'bg-orange-100 text-orange-600' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {summaryCards.map((card, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl ${card.color} flex items-center justify-center`}>
                  <card.icon className="w-6 h-6" />
                </div>
                <span className="text-green-500 text-sm font-medium">{card.change}</span>
              </div>
              <p className="text-muted-foreground text-sm">{card.title}</p>
              <p className="text-2xl font-bold">{card.value}</p>
            </div>
          ))}
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Sales Chart */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border">
            <h3 className="font-bold text-lg mb-6">المبيعات الشهرية</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="month" stroke="#9CA3AF" fontSize={12} />
                  <YAxis stroke="#9CA3AF" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #E5E7EB',
                      borderRadius: '12px'
                    }}
                  />
                  <Bar dataKey="sales" fill="#3B82F6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Package Distribution */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border">
            <h3 className="font-bold text-lg mb-6">توزيع الباقات</h3>
            <div className="h-72 flex items-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={packageDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {packageDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-3">
                {packageDistribution.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-sm text-muted-foreground">{item.name}: {item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border">
          <h3 className="font-bold text-lg mb-6">استخدام البيانات اليومي (GB)</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyUsage}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="day" stroke="#9CA3AF" fontSize={12} />
                <YAxis stroke="#9CA3AF" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #E5E7EB',
                    borderRadius: '12px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="usage" 
                  stroke="#06B6D4" 
                  strokeWidth={3}
                  dot={{ fill: '#06B6D4', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Reports;
