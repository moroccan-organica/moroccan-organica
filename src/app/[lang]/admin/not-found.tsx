"use client";

import Link from "next/link";
import { AlertCircle, ArrowLeft, LayoutDashboard, Shield } from "lucide-react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

export default function AdminNotFound() {
  const pathname = usePathname();
  const lang = pathname?.startsWith('/ar') ? 'ar' : 'en';
  const isRTL = lang === 'ar';

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className="min-h-[85vh] flex flex-col items-center justify-center p-8 bg-slate-50 relative overflow-hidden">
      {/* Structural background details */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="relative z-10 max-w-md w-full bg-white rounded-3xl shadow-soft p-10 md:p-14 border border-slate-200/60 flex flex-col items-center text-center">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
          className="relative mb-10"
        >
          <div className="size-24 rounded-2xl bg-slate-900 flex items-center justify-center shadow-2xl relative">
            <Shield className="size-10 text-white opacity-20 absolute" />
            <AlertCircle className="size-12 text-white" strokeWidth={1.5} />
          </div>
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute -bottom-3 -right-3 size-12 rounded-full bg-forest border-4 border-white flex items-center justify-center shadow-lg"
          >
            <LayoutDashboard className="size-5 text-white" />
          </motion.div>
        </motion.div>

        <div className="space-y-4 mb-12">
          <h1 className="text-3xl font-bold text-slate-900 font-sans tracking-tight">
            {isRTL ? 'خطأ في التوجيه' : 'System Exception'}
          </h1>
          <p className="text-slate-500 leading-relaxed">
            {isRTL
              ? 'الصفحة المطلوبة غير موجودة في سجلات النظام. يرجى التحقق من المسار أو العودة للوحة التحكم.'
              : "The administrative resource you requested is not registered in our current namespace. Please verify the URI or return to the dashboard."}
          </p>
          <div className="inline-block px-3 py-1 rounded bg-slate-100 text-slate-400 font-mono text-xs uppercase tracking-widest mt-2">
            Status: 404_NOT_FOUND
          </div>
        </div>

        <div className="w-full flex flex-col gap-3">
          <Link
            href={`/${lang}/admin`}
            className="w-full py-4 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-all flex items-center justify-center gap-3 shadow-xl"
          >
            <LayoutDashboard className="size-5" />
            {isRTL ? 'لوحة التحكم الرئيسية' : 'Admin Dashboard'}
          </Link>

          <Link
            href={`/${lang}`}
            className="w-full py-4 bg-white text-slate-600 border border-slate-200 rounded-xl font-semibold hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
          >
            <ArrowLeft className={`size-4 ${isRTL ? 'rotate-180' : ''}`} />
            {isRTL ? 'الرجوع للمتجر' : 'Return to Website'}
          </Link>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-12 flex items-center gap-2 text-slate-400 text-sm font-medium"
      >
        <span className="size-1.5 rounded-full bg-forest animate-pulse" />
        {isRTL ? 'نظام أورجانيكا الإداري' : 'Organica Admin Gateway'}
      </motion.div>
    </div>
  );
}
