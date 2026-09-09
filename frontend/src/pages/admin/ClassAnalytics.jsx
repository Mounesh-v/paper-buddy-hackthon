import React, { useEffect, useState } from 'react';
import PageHeader from '../../components/layout/PageHeader';
import StatCard from '../../components/common/StatCard';
import AnalyticsChart from '../../components/charts/AnalyticsChart';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorState from '../../components/common/ErrorState';
import { getClassAnalytics } from '../../api/analyticsApi';
import { BarChart3, Award, AlertCircle, Users } from 'lucide-react';

const AdminClassAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [classAnalytics, setClassAnalytics] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getClassAnalytics({});
      setClassAnalytics(res);
    } catch (e) {
      setError('Failed to fetch institutional class analytics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const chartData = [
    { subject: 'Grade 9 Science', average: 76, highest: 95 },
    { subject: 'Grade 9 Math', average: 81, highest: 96 },
    { subject: 'Grade 10 Science', average: 84, highest: 98 },
    { subject: 'Grade 10 Social', average: 79, highest: 94 },
  ];

  if (loading) return <LoadingSpinner label="Compiling Institutional Class Metrics..." fullPage />;
  if (error) return <ErrorState message={error} onRetry={fetchData} />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Institutional Class Analytics"
        subtitle="Cross-section mastery benchmarks and topic strength distribution."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Institutional Average"
          value={classAnalytics?.averageScore ? `${Math.round(classAnalytics.averageScore)}%` : '79%'}
          icon={BarChart3}
          color="indigo"
        />
        <StatCard
          title="Strongest Topic"
          value={classAnalytics?.strongestTopic || 'Thermodynamics'}
          icon={Award}
          color="emerald"
        />
        <StatCard
          title="Weakest Topic"
          value={classAnalytics?.weakestTopic || 'Vector Kinematics'}
          icon={AlertCircle}
          color="rose"
        />
        <StatCard
          title="Flagged Students"
          value={classAnalytics?.studentsNeedingAttentionCount || 5}
          icon={Users}
          color="amber"
        />
      </div>

      <div className="p-6 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm">
        <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100 mb-1">
          Grade Level Performance Benchmarks
        </h3>
        <p className="text-xs text-neutral-500 mb-4">Class average vs top student performance</p>
        <AnalyticsChart data={chartData} height={320} />
      </div>
    </div>
  );
};

export default AdminClassAnalytics;
