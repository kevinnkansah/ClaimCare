import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { MedicalScheme } from '../types/MedicalScheme';
import { Info } from 'lucide-react';

interface SavingsDistributionChartProps {
  data: MedicalScheme[];
}

const COLORS = ['#2563EB', '#059669', '#D97706'];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const { name, value, payload: { total, minValue, maxValue } } = payload[0];
    return (
      <div className="border border-gray-200 bg-white rounded-md p-3">
        <p className="text-sm font-medium text-gray-900">{name}</p>
        <div className="mt-2 space-y-1">
          <p className="text-sm" style={{ color: payload[0].payload.fill }}>
            Average: R {value.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
          <p className="text-xs text-gray-500">
            Range: R {minValue.toLocaleString()} - R {maxValue.toLocaleString()}
          </p>
          <p className="text-xs text-gray-500">
            {((value / total) * 100).toFixed(1)}% of total savings
          </p>
        </div>
      </div>
    );
  }
  return null;
};

const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, value }: any) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return percent > 0.15 ? (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="middle"
      className="text-xs font-medium"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  ) : null;
};

export const SavingsDistributionChart: React.FC<SavingsDistributionChartProps> = ({ data }) => {
  // Calculate detailed statistics
  const savingsStats = {
    mainMember: {
      avg: data.reduce((acc, scheme) => acc + scheme.MedicalSavingsAccountMainMember, 0) / data.length,
      min: Math.min(...data.map(scheme => scheme.MedicalSavingsAccountMainMember)),
      max: Math.max(...data.map(scheme => scheme.MedicalSavingsAccountMainMember))
    },
    adultDependant: {
      avg: data.reduce((acc, scheme) => acc + scheme.MedicalSavingsAccountAdultDependant, 0) / data.length,
      min: Math.min(...data.map(scheme => scheme.MedicalSavingsAccountAdultDependant)),
      max: Math.max(...data.map(scheme => scheme.MedicalSavingsAccountAdultDependant))
    },
    childDependant: {
      avg: data.reduce((acc, scheme) => acc + scheme.MedicalSavingsAccountChildDependant, 0) / data.length,
      min: Math.min(...data.map(scheme => scheme.MedicalSavingsAccountChildDependant)),
      max: Math.max(...data.map(scheme => scheme.MedicalSavingsAccountChildDependant))
    }
  };

  const total = savingsStats.mainMember.avg + savingsStats.adultDependant.avg + savingsStats.childDependant.avg;

  const chartData = [
    { 
      name: 'Main Member',
      value: savingsStats.mainMember.avg,
      total,
      minValue: savingsStats.mainMember.min,
      maxValue: savingsStats.mainMember.max
    },
    { 
      name: 'Adult Dependant',
      value: savingsStats.adultDependant.avg,
      total,
      minValue: savingsStats.adultDependant.min,
      maxValue: savingsStats.adultDependant.max
    },
    { 
      name: 'Child Dependant',
      value: savingsStats.childDependant.avg,
      total,
      minValue: savingsStats.childDependant.min,
      maxValue: savingsStats.childDependant.max
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Medical Savings Distribution</h3>
          <p className="text-sm text-gray-500 mt-1">
            Average savings allocation across member types
          </p>
        </div>
        <div className="group relative">
          <Info size={18} className="text-gray-400 cursor-help" />
          <div className="absolute right-0 w-64 p-3 bg-white border border-gray-200 rounded-md text-sm hidden group-hover:block z-10">
            <p className="text-gray-600 mb-2">
              This chart shows how medical savings are distributed among different member types.
              Total average savings: R {total.toLocaleString()}
            </p>
            <ul className="text-xs text-gray-500 list-disc pl-4 space-y-1">
              <li>Hover over segments for detailed statistics</li>
              <li>Percentages show proportion of total savings</li>
              <li>Range indicates variation across schemes</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border border-gray-200 rounded-md p-4 bg-white">
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={<CustomLabel />}
              outerRadius={160}
              innerRadius={80}
              dataKey="value"
              paddingAngle={2}
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]}
                  stroke="white"
                  strokeWidth={2}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value, entry: any) => (
                <span className="text-sm text-gray-700">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};