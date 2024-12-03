import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ZAxis, Cell } from 'recharts';
import { MedicalScheme } from '../types/MedicalScheme';
import { Info } from 'lucide-react';

interface SavingsToCostRatioChartProps {
  data: MedicalScheme[];
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const scheme = payload[0].payload;
    return (
      <div className="border border-gray-200 bg-white rounded-md p-3">
        <p className="text-sm font-medium text-gray-900 mb-2">Scheme ID: {scheme.id}</p>
        <div className="space-y-1">
          <p className="text-sm text-gray-600">
            Total Cost: R {scheme.totalCost.toLocaleString()}
          </p>
          <p className="text-sm text-gray-600">
            Total Savings: R {scheme.totalSavings.toLocaleString()}
          </p>
          <p className="text-sm text-gray-600">
            Dependents: {scheme.dependents}
          </p>
          <p className="text-sm text-gray-600">
            Savings Ratio: {(scheme.savingsRatio * 100).toFixed(1)}%
          </p>
        </div>
      </div>
    );
  }
  return null;
};

export const SavingsToCostRatioChart: React.FC<SavingsToCostRatioChartProps> = ({ data }) => {
  const chartData = data.map(scheme => {
    const totalCost = 
      scheme.TotalMonthlyCostMainMember + 
      scheme.TotalMonthlyCostAdultDependant + 
      scheme.TotalMonthlyCostChildDependant;
    
    const totalSavings = 
      scheme.MedicalSavingsAccountMainMember + 
      scheme.MedicalSavingsAccountAdultDependant + 
      scheme.MedicalSavingsAccountChildDependant;
    
    const dependents = (scheme.TotalMonthlyCostAdultDependant > 0 ? 1 : 0) + 
                      (scheme.TotalMonthlyCostChildDependant > 0 ? 1 : 0);

    return {
      id: scheme.MedicalSchemeId,
      totalCost,
      totalSavings,
      dependents,
      savingsRatio: totalSavings / totalCost
    };
  });

  const maxDependents = Math.max(...chartData.map(d => d.dependents));

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Savings-to-Cost Analysis</h3>
          <p className="text-sm text-gray-500 mt-1">
            Relationship between monthly costs and savings accounts
          </p>
        </div>
        <div className="group relative">
          <Info size={18} className="text-gray-400 cursor-help" />
          <div className="absolute right-0 w-64 p-3 bg-white border border-gray-200 rounded-md text-sm hidden group-hover:block z-10">
            <p className="text-gray-600 mb-2">
              This chart visualizes the relationship between total monthly costs and savings accounts.
            </p>
            <ul className="text-xs text-gray-500 list-disc pl-4 space-y-1">
              <li>X-axis: Total monthly cost</li>
              <li>Y-axis: Total savings account</li>
              <li>Bubble size: Number of dependents</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border border-gray-200 rounded-md p-4 bg-white">
        <ResponsiveContainer width="100%" height={400}>
          <ScatterChart
            margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis 
              type="number"
              dataKey="totalCost"
              name="Total Cost"
              tick={{ fill: '#6B7280' }}
              tickLine={{ stroke: '#E5E7EB' }}
              axisLine={{ stroke: '#E5E7EB' }}
              label={{ value: 'Total Monthly Cost (R)', position: 'bottom' }}
              tickFormatter={(value) => `R ${(value/1000).toFixed(0)}k`}
            />
            <YAxis 
              type="number"
              dataKey="totalSavings"
              name="Total Savings"
              tick={{ fill: '#6B7280' }}
              tickLine={{ stroke: '#E5E7EB' }}
              axisLine={{ stroke: '#E5E7EB' }}
              label={{ value: 'Total Savings Account (R)', angle: -90, position: 'insideLeft' }}
              tickFormatter={(value) => `R ${(value/1000).toFixed(0)}k`}
            />
            <ZAxis 
              type="number" 
              dataKey="dependents" 
              range={[30, 150]} 
              name="Dependents"
            />
            <Tooltip content={<CustomTooltip />} />
            <Scatter 
              name="Schemes" 
              data={chartData} 
              fill="#059669"
              fillOpacity={0.7}
              shape="circle"
            >
              {
                chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`}
                    fill={entry.savingsRatio > 0.5 ? '#059669' : '#D97706'} 
                  />
                ))
              }
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
