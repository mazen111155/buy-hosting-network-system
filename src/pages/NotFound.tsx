import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, Wifi } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
      <div className="text-center">
        <div className="w-24 h-24 rounded-3xl gradient-primary flex items-center justify-center mx-auto mb-8 animate-float">
          <Wifi className="w-12 h-12 text-white" />
        </div>
        <h1 className="text-8xl font-bold gradient-text mb-4">404</h1>
        <h2 className="text-2xl font-bold mb-4">الصفحة غير موجودة</h2>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها
        </p>
        <Link to="/">
          <Button className="gradient-primary text-white">
            <Home className="w-5 h-5 ml-2" />
            العودة للرئيسية
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;