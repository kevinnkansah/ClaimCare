import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { MedicalScheme } from '../types/MedicalScheme';
import { Info } from 'lucide-react';

interface CostComparisonChartProps {
  data: MedicalScheme[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const total = payload.reduce((sum: number, item: any) => sum + item.value, 0);
    return (
      <div className="border border-gray-200 bg-white rounded-md p-3">
        <p className="text-sm font-medium text-gray-900 mb-2">Scheme ID: {label}</p>
        {payload.map((item: any, index: number) => (
          <div key={index} className="mb-1">
            <p className="text-sm flex items-center justify-between gap-4">
              <span style={{ color: item.color }}>{item.name}:</span>
              <span className="font-medium">R {item.value.toLocaleString()}</span>
            </p>
            <p className="text-xs text-gray-500">
              {((item.value / total) * 100).toFixed(1)}% of total cost
            </p>
          </div>
        ))}
        <div className="mt-2 pt-2 border-t border-gray-100">
          <p className="text-sm font-medium text-gray-900">
            Total: R {total.toLocaleString()}
          </p>
        </div>
      </div>
    );
  }
  return null;
};

export const CostComparisonChart: React.FC<CostComparisonChartProps> = ({ data }) => {
  // Calculate statistics
  const chartData = data.slice(0, 10).map(scheme => ({
    id: scheme.MedicalSchemeId,
    'Main Member': scheme.TotalMonthlyCostMainMember,
    'Adult Dependant': scheme.TotalMonthlyCostAdultDependant,
    'Child Dependant': scheme.TotalMonthlyCostChildDependant,
    Total: scheme.TotalMonthlyCostMainMember + scheme.TotalMonthlyCostAdultDependant + scheme.TotalMonthlyCostChildDependant
  }));

  const averageTotal = chartData.reduce((acc, item) => acc + item.Total, 0) / chartData.length;

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Cost Structure Analysis</h3>
          <p className="text-sm text-gray-500 mt-1">
            Monthly cost breakdown by member type for top 10 schemes
          </p>
        </div>
        <div className="group relative">
          <Info size={18} className="text-gray-400 cursor-help" />
          <div className="absolute right-0 w-64 p-3 bg-white border border-gray-200 rounded-md text-sm hidden group-hover:block z-10">
            <p className="text-gray-600 mb-2">
              This chart shows the cost distribution across different member types.
              The average total cost across schemes is R {averageTotal.toLocaleString()}.
            </p>
            <ul className="text-xs text-gray-500 list-disc pl-4 space-y-1">
              <li>Main Member: Primary insurance holder</li>
              <li>Adult Dependant: Spouse or adult family member</li>
              <li>Child Dependant: Dependent under 21</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border border-gray-200 rounded-md p-4 bg-white">
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis 
              dataKey="id"
              tick={{ fill: '#6B7280' }}
              tickLine={{ stroke: '#E5E7EB' }}
              axisLine={{ stroke: '#E5E7EB' }}
              label={{ value: 'Scheme ID', position: 'insideBottom', offset: -5 }}
            />
            <YAxis
              tick={{ fill: '#6B7280' }}
              tickLine={{ stroke: '#E5E7EB' }}
              axisLine={{ stroke: '#E5E7EB' }}
              tickFormatter={(value) => `R ${value.toLocaleString()}`}
              label={{ value: 'Monthly Cost (R)', angle: -90, position: 'insideLeft', offset: 10 }}
            />
            <ReferenceLine 
              y={averageTotal} 
              stroke="#9CA3AF" 
              strokeDasharray="3 3"
              label={{ value: 'Average Total Cost', position: 'right', fill: '#6B7280' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{
                paddingTop: '20px'
              }}
            />
            <Bar 
              dataKey="Main Member" 
              fill="#2563EB"
              radius={[4, 4, 0, 0]}
            />
            <Bar 
              dataKey="Adult Dependant" 
              fill="#059669"
              radius={[4, 4, 0, 0]}
            />
            <Bar 
              dataKey="Child Dependant" 
              fill="#D97706"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};