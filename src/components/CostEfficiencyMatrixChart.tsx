import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { MedicalScheme } from '../types/MedicalScheme';
import { Info } from 'lucide-react';

interface CostEfficiencyMatrixChartProps {
  data: MedicalScheme[];
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: {
    payload: {
      id: number;
      adultMainRatio: number;
      childMainRatio: number;
      totalCost: number;
      savingsPercentage: number;
    };
  }[];
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const scheme = payload[0].payload;
    return (
      <div className="border border-gray-200 bg-white rounded-md p-3">
        <p className="text-sm font-medium text-gray-900 mb-2">Scheme ID: {scheme.id}</p>
        <div className="space-y-1">
          <p className="text-sm text-gray-600">
            Adult/Main Cost Ratio: {scheme.adultMainRatio.toFixed(2)}
          </p>
          <p className="text-sm text-gray-600">
            Child/Main Cost Ratio: {scheme.childMainRatio.toFixed(2)}
          </p>
          <p className="text-sm text-gray-600">
            Total Cost: R {scheme.totalCost.toLocaleString()}
          </p>
          <p className="text-sm text-gray-600">
            Savings %: {scheme.savingsPercentage.toFixed(1)}%
          </p>
        </div>
      </div>
    );
  }
  return null;
};

export const CostEfficiencyMatrixChart: React.FC<CostEfficiencyMatrixChartProps> = ({ data }) => {
  const chartData = data
    .filter(scheme => scheme.TotalMonthlyCostMainMember > 0) // Only include schemes with valid main member cost
    .map(scheme => {
      const totalCost = 
        (scheme.TotalMonthlyCostMainMember || 0) + 
        (scheme.TotalMonthlyCostAdultDependant || 0) + 
        (scheme.TotalMonthlyCostChildDependant || 0);
      
      const totalSavings = 
        (scheme.MedicalSavingsAccountMainMember || 0) + 
        (scheme.MedicalSavingsAccountAdultDependant || 0) + 
        (scheme.MedicalSavingsAccountChildDependant || 0);

      return {
        id: scheme.MedicalSchemeId,
        adultMainRatio: scheme.TotalMonthlyCostMainMember ? 
          (scheme.TotalMonthlyCostAdultDependant || 0) / scheme.TotalMonthlyCostMainMember : 0,
        childMainRatio: scheme.TotalMonthlyCostMainMember ? 
          (scheme.TotalMonthlyCostChildDependant || 0) / scheme.TotalMonthlyCostMainMember : 0,
        totalCost,
        savingsPercentage: totalCost > 0 ? (totalSavings / totalCost) * 100 : 0
      };
    })
    .filter(scheme => scheme.totalCost > 0); // Filter out schemes with no costs

  if (chartData.length === 0) {
    return (
      <div className="space-y-4">
        <div className="text-center p-8 border border-gray-200 rounded-md bg-white">
          <p className="text-gray-500">No valid data available for visualization</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Cost Efficiency Matrix</h3>
          <p className="text-sm text-gray-500 mt-1">
            Analyzing cost ratios and savings efficiency
          </p>
        </div>
        <div className="group relative">
          <Info size={18} className="text-gray-400 cursor-help" />
          <div className="absolute right-0 w-64 p-3 bg-white border border-gray-200 rounded-md text-sm hidden group-hover:block z-10">
            <p className="text-gray-600 mb-2">
              This matrix shows the relationship between different cost ratios and overall efficiency.
            </p>
            <ul className="text-xs text-gray-500 list-disc pl-4 space-y-1">
              <li>X-axis: Adult/Main Member cost ratio</li>
              <li>Y-axis: Child/Main Member cost ratio</li>
              <li>Bubble size: Total scheme cost</li>
              <li>Color intensity: Savings percentage</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border border-gray-200 rounded-md p-4 bg-white">
        <ResponsiveContainer width="100%" height={400}>
          <ScatterChart
            margin={{ top: 10, right: 10, bottom: 40, left: 40 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis 
              type="number"
              dataKey="adultMainRatio"
              name="Adult/Main Ratio"
              tick={{ fill: '#6B7280', fontSize: 12 }}
              tickLine={{ stroke: '#E5E7EB' }}
              axisLine={{ stroke: '#E5E7EB' }}
              label={{ 
                value: 'Adult/Main Member Cost Ratio', 
                position: 'bottom',
                offset: 20,
                style: { fill: '#4B5563', fontSize: 12 }
              }}
            />
            <YAxis 
              type="number"
              dataKey="childMainRatio"
              name="Child/Main Ratio"
              tick={{ fill: '#6B7280', fontSize: 12 }}
              tickLine={{ stroke: '#E5E7EB' }}
              axisLine={{ stroke: '#E5E7EB' }}
              label={{ 
                value: 'Child/Main Member Cost Ratio', 
                angle: -90, 
                position: 'insideLeft',
                offset: -20,
                style: { fill: '#4B5563', fontSize: 12 }
              }}
            />
            <ZAxis 
              type="number" 
              dataKey="totalCost" 
              range={[50, 200]} 
              name="Total Cost"
            />
            <Tooltip content={<CustomTooltip />} />
            <Scatter 
              name="Schemes" 
              data={chartData} 
              fill="#2563EB"
              fillOpacity={0.6}
              shape="circle"
            >
              {
                chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} />
                ))
              }
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
