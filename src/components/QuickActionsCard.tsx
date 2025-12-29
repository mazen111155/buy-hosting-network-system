import { Link } from 'react-router-dom';
import { UserPlus, CreditCard, Package, FileText } from 'lucide-react';

const QuickActionsCard = () => {
  const actions = [
    {
      icon: UserPlus,
      title: 'إضافة مستخدم',
      description: 'إنشاء حساب مستخدم جديد',
      path: '/users',
      gradient: 'from-blue-500 to-blue-600'
    },
    {
      icon: CreditCard,
      title: 'توليد كروت',
      description: 'إنشاء كروت إنترنت جديدة',
      path: '/cards',
      gradient: 'from-green-500 to-green-600'
    },
    {
      icon: Package,
      title: 'إضافة باقة',
      description: 'إنشاء باقة اشتراك جديدة',
      path: '/packages',
      gradient: 'from-purple-500 to-purple-600'
    },
    {
      icon: FileText,
      title: 'التقارير',
      description: 'عرض تقارير الاستخدام',
      path: '/reports',
      gradient: 'from-orange-500 to-orange-600'
    }
  ];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border">
      <h3 className="font-bold text-lg mb-6">إجراءات سريعة</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((action, index) => (
          <Link
            key={index}
            to={action.path}
            className="group p-4 rounded-xl border-2 border-dashed border-slate-200 hover:border-transparent hover:shadow-lg transition-all"
          >
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${action.gradient} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
              <action.icon className="w-6 h-6 text-white" />
            </div>
            <h4 className="font-bold mb-1">{action.title}</h4>
            <p className="text-sm text-muted-foreground">{action.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default QuickActionsCard;
