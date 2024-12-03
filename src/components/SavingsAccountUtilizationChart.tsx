import { Treemap, ResponsiveContainer, Tooltip } from 'recharts';
import { MedicalScheme } from '../types/MedicalScheme';
import { Info } from 'lucide-react';

interface SavingsAccountUtilizationChartProps {
  data: MedicalScheme[];
}

const COLORS = ['#2563EB', '#059669', '#D97706'];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="border border-gray-200 bg-white rounded-md p-3">
        <p className="text-sm font-medium text-gray-900 mb-2">
          {data.name}
        </p>
        <div className="space-y-1">
          <p className="text-sm text-gray-600">
            Total Cost: R {data.value?.toLocaleString() ?? 0}
          </p>
          {data.savingsPercentage && (
            <p className="text-sm text-gray-600">
              Savings: {data.savingsPercentage.toFixed(1)}%
            </p>
          )}
        </div>
      </div>
    );
  }
  return null;
};

interface CustomContentProps {
  root?: any;
  depth?: number;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  name?: string;
  value?: number;
  savingsPercentage?: number;
}

const CustomContent = ({ 
  depth = 0, 
  x = 0, 
  y = 0, 
  width = 0, 
  height = 0, 
  name = '', 
  value = 0,
  savingsPercentage 
}: CustomContentProps) => {
  if (!width || !height) return null;
  
  const fontSize = width < 50 ? 0 : width < 100 ? 10 : 12;
  const shortName = name.length > 15 ? name.slice(0, 12) + '...' : name;

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={COLORS[depth % COLORS.length]}
        fillOpacity={savingsPercentage ? Math.max(0.3, savingsPercentage / 100) : 0.7}
        stroke="#fff"
      />
      {fontSize > 0 && width > 30 && height > 30 && (
        <>
          <text
            x={x + width / 2}
            y={y + height / 2 - 8}
            textAnchor="middle"
            fill="#fff"
            fontSize={fontSize}
            fontWeight="500"
          >
            {shortName}
          </text>
          <text
            x={x + width / 2}
            y={y + height / 2 + 8}
            textAnchor="middle"
            fill="#fff"
            fontSize={fontSize - 2}
          >
            {savingsPercentage ? `${savingsPercentage.toFixed(1)}%` : `R ${(value/1000).toFixed(0)}k`}
          </text>
        </>
      )}
    </g>
  );
};

export const SavingsAccountUtilizationChart: React.FC<SavingsAccountUtilizationChartProps> = ({ data }) => {
  const processedData = data
    .filter(scheme => scheme.TotalMonthlyCostMainMember > 0) // Filter out invalid schemes
    .slice(0, 10)
    .map(scheme => {
      const mainMemberTotal = scheme.TotalMonthlyCostMainMember || 0;
      const adultDependantTotal = scheme.TotalMonthlyCostAdultDependant || 0;
      const childDependantTotal = scheme.TotalMonthlyCostChildDependant || 0;

      const mainMemberSavings = mainMemberTotal ? 
        (scheme.MedicalSavingsAccountMainMember / mainMemberTotal) * 100 : 0;
      const adultDependantSavings = adultDependantTotal ? 
        (scheme.MedicalSavingsAccountAdultDependant / adultDependantTotal) * 100 : 0;
      const childDependantSavings = childDependantTotal ?
        (scheme.MedicalSavingsAccountChildDependant / childDependantTotal) * 100 : 0;

      return {
        name: `Scheme ${scheme.MedicalSchemeId}`,
        children: [
          {
            name: 'Main Member',
            value: mainMemberTotal,
            savingsPercentage: mainMemberSavings
          },
          ...(adultDependantTotal > 0 ? [{
            name: 'Adult Dependant',
            value: adultDependantTotal,
            savingsPercentage: adultDependantSavings
          }] : []),
          ...(childDependantTotal > 0 ? [{
            name: 'Child Dependant',
            value: childDependantTotal,
            savingsPercentage: childDependantSavings
          }] : [])
        ].filter(child => child.value > 0) // Filter out zero-value children
      };
    })
    .filter(scheme => scheme.children.length > 0); // Filter out schemes with no valid children

  if (processedData.length === 0) {
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
          <h3 className="text-lg font-semibold text-gray-900">Savings Account Utilization</h3>
          <p className="text-sm text-gray-500 mt-1">
            Cost distribution and savings percentage by scheme and member type
          </p>
        </div>
        <div className="group relative">
          <Info size={18} className="text-gray-400 cursor-help" />
          <div className="absolute right-0 w-64 p-3 bg-white border border-gray-200 rounded-md text-sm hidden group-hover:block z-10">
            <p className="text-gray-600 mb-2">
              This treemap shows the cost structure and savings utilization across schemes.
            </p>
            <ul className="text-xs text-gray-500 list-disc pl-4 space-y-1">
              <li>Box size: Total monthly cost</li>
              <li>Color intensity: Savings percentage</li>
              <li>Sections: Member types within schemes</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border border-gray-200 rounded-md p-4 bg-white">
        <ResponsiveContainer width="100%" height={400}>
          <Treemap
            data={processedData}
            dataKey="value"
            aspectRatio={4/3}
            stroke="#fff"
            content={<CustomContent />}
          >
            <Tooltip content={<CustomTooltip />} />
          </Treemap>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
