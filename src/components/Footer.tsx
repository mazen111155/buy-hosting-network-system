import { Wifi, Mail, Globe } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white py-12 px-4">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Logo & Description */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                <Wifi className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold">مكروتك هوستبت</span>
            </div>
            <p className="text-slate-400 max-w-sm">
              نظام متكامل لإدارة شبكات الواي فاي والهوتسبوت بأعلى معايير الجودة والأمان
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-bold mb-4">روابط سريعة</h4>
            <ul className="space-y-2 text-slate-400">
              <li><a href="#" className="hover:text-white transition-colors">الرئيسية</a></li>
              <li><a href="#" className="hover:text-white transition-colors">المميزات</a></li>
              <li><a href="#" className="hover:text-white transition-colors">الأسعار</a></li>
              <li><a href="#" className="hover:text-white transition-colors">الدعم الفني</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold mb-4">تواصل معنا</h4>
            <ul className="space-y-3 text-slate-400">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>support@mikrotik.com</span>
              </li>
              <li className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                <span>www.mikrotik-hotspot.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-slate-800 pt-8 text-center text-slate-400">
          <p>© 2024 مكروتك هوستبت. جميع الحقوق محفوظة</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
