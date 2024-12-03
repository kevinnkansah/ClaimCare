import { motion } from 'framer-motion';
import React from 'react';
import { TrendingUp, TrendingDown, HelpCircle } from 'lucide-react';

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: number;
  subtitle?: string;
  description?: string;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({ 
  title, 
  value, 
  icon, 
  trend = 0,
  subtitle,
  description
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-colors duration-200"
    >
      <div className="flex items-start justify-between">
        <div className="p-2 rounded-md bg-gray-50 border border-gray-100">
          <div className="text-gray-600">{icon}</div>
        </div>
        <div className="flex items-center gap-2">
          <div className={`px-2.5 py-0.5 rounded-md text-sm flex items-center border ${
            trend >= 0 
              ? 'text-green-700 border-green-200 bg-green-50' 
              : 'text-red-700 border-red-200 bg-red-50'
          }`}>
            {trend >= 0 ? <TrendingUp size={14} className="mr-1" /> : <TrendingDown size={14} className="mr-1" />}
            {Math.abs(trend)}%
          </div>
          {description && (
            <div className="group relative">
              <HelpCircle size={16} className="text-gray-400 cursor-help" />
              <div className="absolute bottom-full right-0 mb-2 w-48 p-2 bg-white border border-gray-200 rounded-md text-xs text-gray-600 hidden group-hover:block">
                {description}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="mt-4">
        <div className="flex items-baseline gap-1">
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        </div>
        <div className="mt-2">
          <h2 className="text-2xl font-semibold text-gray-900">
            R {typeof value === 'number' ? value.toLocaleString() : value}
          </h2>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
};