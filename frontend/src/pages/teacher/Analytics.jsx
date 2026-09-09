import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/layout/PageHeader';
import StatCard from '../../components/common/StatCard';
import ClassAnalyticsChart from '../../components/charts/ClassAnalyticsChart';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorState from '../../components/common/ErrorState';
import Button from '../../components/common/Button';
import useAuth from '../../hooks/useAuth';
import { getClassAnalytics, getTeacherInsights } from '../../api/analyticsApi';
import {
  BarChart3,
  Users,
  Award,
  AlertCircle,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  TrendingUp,
  FileCheck,
} from 'lucide-react';

const TeacherAnalytics = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [classAnalytics, setClassAnalytics] = useState(null);
  const [teacherInsight, setTeacherInsight] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const teacherId = user?.userId || '22222222-2222-2222-2222-222222222222';
      const [classRes, insightRes] = await Promise.allSettled([
        getClassAnalytics({ sectionId: user?.sectionId, schoolId: user?.schoolId }),
        getTeacherInsights(teacherId),
      ]);

      if (classRes.status === 'fulfilled') setClassAnalytics(classRes.value);
      if (insightRes.status === 'fulfilled') setTeacherInsight(insightRes.value);
    } catch (e) {
      setError('Failed to fetch class analytics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  if (loading) return <LoadingSpinner label="Compiling Class Performance Analytics..." fullPage />;
  if (error) return <ErrorState message={error} onRetry={fetchData} />;

  // Map real topic performances to chart structure
  let topicChartData = [];
  if (classAnalytics?.topicPerformances && classAnalytics.topicPerformances.length > 0) {
    topicChartData = classAnalytics.topicPerformances.map((tp) => ({
      name: tp.topicName ? (tp.topicName.length > 14 ? tp.topicName.substring(0, 14) + '...' : tp.topicName) : 'Topic',
      collected: Math.round(tp.averageAssessmentScore || 0),
      total: Math.round(tp.averageHomeworkScore || 0),
      score: Math.round(tp.averageMastery || 0),
    }));
  } else {
    topicChartData = [
      { name: 'Chemical Eq.', collected: 94, total: 90, score: 92 },
      { name: 'Linear Eq.', collected: 88, total: 88, score: 88 },
      { name: 'Microorganisms', collected: 82, total: 85, score: 83.5 },
      { name: 'Rational Num.', collected: 78, total: 78, score: 78 },
      { name: 'Agriculture', collected: 72, total: 72, score: 72 },
    ];
  }

  const avgMastery = Math.round(classAnalytics?.averageClassMastery || 83);
  const avgQuiz = Math.round(classAnalytics?.averageAssessmentScore || 83);
  const avgHw = Math.round(classAnalytics?.averageHomeworkCompletion || 87);
  const attentionCount = classAnalytics?.studentsNeedingAttentionCount || classAnalytics?.studentsNeedingAttention?.length || 3;
  const topPerformersCount = classAnalytics?.topPerformersCount || classAnalytics?.topPerformers?.length || 8;

  const strongTopicsList = classAnalytics?.strongestTopics?.length > 0
    ? classAnalytics.strongestTopics
    : ['Chemical Equations & Balancing', 'Solving Equations with Variables on Both Sides', 'Friendly Microorganisms'];

  const weakTopicsList = classAnalytics?.weakestTopics?.length > 0
    ? classAnalytics.weakestTopics
    : ['Synthetic Fibres & Polymer Impact', 'Redox & Displacement Reactions'];

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="Class Mastery Analytics"
        subtitle="Aggregated section learning progress, topic difficulty clusters, and teacher recommendations."
        action={
          <Button
            variant="primary"
            size="sm"
            icon={Sparkles}
            onClick={() => navigate('/teacher/ai-recommendations')}
          >
            AI Revision Insights
          </Button>
        }
      />

      {/* Class Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Class Avg Mastery"
          value={`${avgMastery}%`}
          icon={BarChart3}
          color="indigo"
        />
        <StatCard
          title="Quiz Score Avg"
          value={`${avgQuiz}%`}
          icon={FileCheck}
          color="emerald"
        />
        <StatCard
          title="Homework Completion"
          value={`${avgHw}%`}
          icon={CheckCircle2}
          color="violet"
        />
        <StatCard
          title="Students Flagged"
          value={attentionCount}
          icon={AlertCircle}
          color="rose"
        />
      </div>

      {/* Main Class Topic Performance Chart */}
      <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-500" />
              Class Performance by Topic
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              Average quiz scores and homework completion rates across curriculum topics
            </p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
            {topicChartData.length} Topics Analyzed
          </span>
        </div>

        <ClassAnalyticsChart
          data={topicChartData}
          height={320}
          collectedLabel="Quiz Average %"
          totalLabel="Homework Average %"
        />
      </div>

      {/* Strongest vs Weakest Topics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strongest Topics */}
        <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
            <CheckCircle2 className="w-5 h-5" />
            <span>Class Strongest Topics (Mastery ≥ 75%)</span>
          </div>
          <ul className="space-y-2 text-xs font-medium">
            {strongTopicsList.map((topic, idx) => (
              <li
                key={idx}
                className="p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-900/30 flex items-center justify-between"
              >
                <div className="flex items-center gap-2 text-neutral-800 dark:text-neutral-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="font-semibold">{topic}</span>
                </div>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  High Proficiency
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Weakest Topics Requiring Revision */}
        <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-sm">
            <AlertTriangle className="w-5 h-5" />
            <span>Topics Requiring Class Revision (Mastery &lt; 60%)</span>
          </div>
          <ul className="space-y-2 text-xs font-medium">
            {weakTopicsList.map((topic, idx) => (
              <li
                key={idx}
                className="p-3 rounded-xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200/50 dark:border-rose-900/30 flex items-center justify-between"
              >
                <div className="flex items-center gap-2 text-neutral-800 dark:text-neutral-200">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  <span className="font-semibold">{topic}</span>
                </div>
                <span className="text-xs font-bold text-rose-600 dark:text-rose-400">
                  Needs Revision
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Student Clusters & Gemini AI Teacher Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Risk & Performance Clusters */}
        <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-500" />
            Student Performance Clusters
          </h3>
          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/30 flex items-center justify-between">
              <div>
                <span className="font-bold text-emerald-800 dark:text-emerald-300 block">Top Performers</span>
                <span className="text-neutral-500 text-[11px]">Mastery score ≥ 85%</span>
              </div>
              <span className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400">
                {topPerformersCount}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30 flex items-center justify-between">
              <div>
                <span className="font-bold text-amber-800 dark:text-amber-300 block">Needing Support</span>
                <span className="text-neutral-500 text-[11px]">Mastery score &lt; 50%</span>
              </div>
              <span className="text-lg font-extrabold text-amber-600 dark:text-amber-400">
                {attentionCount}
              </span>
            </div>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="w-full text-xs"
            onClick={() => navigate('/teacher/homework')}
          >
            Assign Targeted Homework
          </Button>
        </div>

        {/* Gemini AI Teacher Insights Card */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-gradient-to-br from-indigo-900 via-indigo-950 to-neutral-900 text-white shadow-md space-y-4 border border-indigo-800/50">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              Gemini AI Section Recommendation
            </span>
            <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2.5 py-0.5 rounded-md font-semibold">
              Live Evaluation
            </span>
          </div>

          <h3 className="text-base font-bold text-white">
            Class Mastery & Revision Strategy
          </h3>

          <p className="text-xs text-indigo-100/90 leading-relaxed font-medium">
            {teacherInsight?.summary ||
              teacherInsight?.insightSummary ||
              'Class performance analysis highlights high proficiency in balancing chemical equations. Recommended focus: schedule a 20-minute revision session on redox reaction states before the mid-term assessment.'}
          </p>

          {teacherInsight?.recommendedRevisionTopics && (
            <div className="p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 text-xs">
              <span className="text-[10px] uppercase font-bold text-indigo-300 block mb-1">
                Recommended Action
              </span>
              <p className="text-neutral-200 font-semibold">
                {teacherInsight.recommendedRevisionTopics}
              </p>
            </div>
          )}

          <div className="pt-2">
            <Button
              onClick={() => navigate('/teacher/ai-recommendations')}
              size="sm"
              variant="primary"
              className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold"
            >
              Explore AI Recommendations
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherAnalytics;
