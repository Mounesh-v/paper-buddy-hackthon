import React, { useEffect, useState } from 'react';
import PageHeader from '../../components/layout/PageHeader';
import StatCard from '../../components/common/StatCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorState from '../../components/common/ErrorState';
import { getTeacherInsights } from '../../api/analyticsApi';
import { TrendingUp, Sparkles, Brain, Award } from 'lucide-react';

const AdminTeacherAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [insight, setInsight] = useState(null);

  const fetchTeacherInsight = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getTeacherInsights('22222222-2222-2222-2222-222222222222');
      setInsight(res);
    } catch (e) {
      setError('Failed to load teacher insights.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeacherInsight();
  }, []);

  if (loading) return <LoadingSpinner label="Fetching Teacher Evaluation Insights..." fullPage />;
  if (error) return <ErrorState message={error} onRetry={fetchTeacherInsight} />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Teacher Evaluation Insights"
        subtitle="Pedagogical analytics and Gemini AI revision guidance for educators."
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Teaching Velocity"
          value="OPTIMAL"
          icon={TrendingUp}
          color="emerald"
        />
        <StatCard
          title="Curriculum Completion"
          value="84%"
          icon={Award}
          color="indigo"
        />
        <StatCard
          title="AI Recommendations"
          value="GENERATED"
          icon={Sparkles}
          color="violet"
        />
      </div>

      {/* Insight Banner */}
      <div className="p-8 rounded-lg bg-neutral-900 text-white shadow-xl border border-neutral-800 space-y-4">
        <div className="flex items-center gap-2 text-neutral-500 font-bold text-sm">
          <Brain className="w-5 h-5" />
          Gemini AI Teaching Diagnostic Report
        </div>
        <p className="text-sm text-neutral-200 leading-relaxed">
          {insight?.insightSummary ||
            'Class concept analysis indicates high student retention on core theory, but recommends a 30-minute review session on numerical application problems before the upcoming term assessment.'}
        </p>
      </div>
    </div>
  );
};

export default AdminTeacherAnalytics;
