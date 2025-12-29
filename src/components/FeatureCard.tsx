import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  index: number;
}

const FeatureCard = ({ icon: Icon, title, description, index }: FeatureCardProps) => {
  return (
    <div 
      className="glass-card rounded-2xl p-6 card-hover animate-fade-in"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center mb-4">
        <Icon className="w-7 h-7 text-white" />
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

export default FeatureCard;
