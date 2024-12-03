import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Wallet, PiggyBank } from 'lucide-react';
import { MedicalScheme } from './types/MedicalScheme';
import { DashboardCard } from './components/DashboardCard';
import { CostComparisonChart } from './components/CostComparisonChart';
import { SavingsDistributionChart } from './components/SavingsDistributionChart';
import { SavingsToCostRatioChart } from './components/SavingsToCostRatioChart';
import { SavingsAccountUtilizationChart } from './components/SavingsAccountUtilizationChart';
import { CostEfficiencyMatrixChart } from './components/CostEfficiencyMatrixChart';

function App() {
  const [data, setData] = useState<MedicalScheme[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/finance.json');
        const jsonData = await response.json();

        // Transform the data into an array of objects
        const transformedData = Object.keys(jsonData.MedicalSchemeId).map(index => ({
          MedicalSchemeId: jsonData.MedicalSchemeId[index],
          TotalMonthlyCostMainMember: jsonData.TotalMonthlyCostMainMember[index],
          MedicalSavingsAccountMainMember: jsonData.MedicalSavingsAccountMainMember[index],
          TotalMonthlyCostAdultDependant: jsonData.TotalMonthlyCostAdultDependant[index],
          MedicalSavingsAccountAdultDependant: jsonData.MedicalSavingsAccountAdultDependant[index],
          TotalMonthlyCostChildDependant: jsonData.TotalMonthlyCostChildDependant[index],
          MedicalSavingsAccountChildDependant: jsonData.MedicalSavingsAccountChildDependant[index],
        }));

        setData(transformedData as MedicalScheme[]);
      } catch (error) {
        console.error('Error loading JSON data:', error);
      }
    };

    fetchData();
  }, []);

  const averageCosts = {
    mainMember: data.reduce((acc, scheme) => acc + scheme.TotalMonthlyCostMainMember, 0) / data.length,
    adultDependant: data.reduce((acc, scheme) => acc + scheme.TotalMonthlyCostAdultDependant, 0) / data.length,
    childDependant: data.reduce((acc, scheme) => acc + scheme.TotalMonthlyCostChildDependant, 0) / data.length,
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 fixed h-full">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900">ClaimCare</h2>
          <p className="text-sm text-gray-500 mt-1">by Team DataHolics</p>
        </div>
        <nav className="mt-6">
          <div className="px-6 py-2 text-sm font-medium text-blue-600 border-l-2 border-blue-600 bg-blue-50">
            Dashboard Overview
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64">
        <header className="bg-white border-b border-gray-200 px-8 py-5">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-xl font-semibold text-gray-900">Medical Insurance Analytics</h1>
            <p className="text-sm text-gray-500 mt-1">Comprehensive analysis of South African Medical Schemes</p>
          </motion.div>
        </header>

        <main className="p-8 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <DashboardCard
              title="Average Main Member Cost"
              value={averageCosts.mainMember.toFixed(2)}
              icon={<Users size={20} />}
              trend={2.5}
              subtitle="Per month"
              description="Average monthly cost for the primary insurance holder across all schemes"
            />
            <DashboardCard
              title="Average Adult Dependant Cost"
              value={averageCosts.adultDependant.toFixed(2)}
              icon={<Wallet size={20} />}
              trend={-1.2}
              subtitle="Per month"
              description="Average monthly cost for adult dependants (spouse or adult family member)"
            />
            <DashboardCard
              title="Average Child Dependant Cost"
              value={averageCosts.childDependant.toFixed(2)}
              icon={<PiggyBank size={20} />}
              trend={0.8}
              subtitle="Per month"
              description="Average monthly cost for child dependants (under 21 years)"
            />
          </div>

          {/* Charts Section */}
          <div className="space-y-6">
            {/* First Row - 2 Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CostComparisonChart data={data} />
              <SavingsDistributionChart data={data} />
            </div>
            
            {/* Second Row - Full Width Chart */}
            <div>
              <SavingsAccountUtilizationChart data={data} />
            </div>
            
            {/* Third Row - 2 Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SavingsToCostRatioChart data={data} />
              <CostEfficiencyMatrixChart data={data} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
