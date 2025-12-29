import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative';
  icon: LucideIcon;
}

const StatsCard = ({ title, value, change, changeType, icon: Icon }: StatsCardProps) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-muted-foreground text-sm mb-1">{title}</p>
          <p className="text-3xl font-bold">{value}</p>
          <p className={cn(
            "text-sm mt-2 font-medium",
            changeType === 'positive' ? "text-green-500" : "text-red-500"
          )}>
            {change} من الشهر الماضي
          </p>
        </div>
        <div className={cn(
          "w-12 h-12 rounded-xl flex items-center justify-center",
          changeType === 'positive' ? "bg-green-100" : "bg-red-100"
        )}>
          <Icon className={cn(
            "w-6 h-6",
            changeType === 'positive' ? "text-green-600" : "text-red-600"
          )} />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
