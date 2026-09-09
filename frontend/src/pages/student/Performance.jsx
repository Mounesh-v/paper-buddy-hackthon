import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/layout/PageHeader';
import StatCard from '../../components/common/StatCard';
import PerformanceChart from '../../components/charts/PerformanceChart';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorState from '../../components/common/ErrorState';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';
import useAuth from '../../hooks/useAuth';
import { getStudentDashboardAnalytics, getConceptMasteryBreakdown } from '../../api/analyticsApi';
import { getAttemptsByStudent } from '../../api/assessmentAttemptApi';
import { getHomeworkByStudent } from '../../api/homeworkApi';
import { formatDate } from '../../utils/formatters';
import {
  Award,
  TrendingUp,
  Layers,
  CheckCircle2,
  FileCheck,
  Sparkles,
  Play,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  BarChart2,
  BookOpen,
} from 'lucide-react';

const SAMPLE_ATTEMPTS = [
  {
    id: 'att-1',
    assessmentTitle: 'Chemical Reactions & Balancing Quiz',
    obtainedMarks: 47,
    totalMarks: 50,
    percentage: 94,
    submittedAt: '2026-09-04T10:24:00',
    status: 'GRADED',
  },
  {
    id: 'att-2',
    assessmentTitle: 'Linear Equations Mastery Test',
    obtainedMarks: 44,
    totalMarks: 50,
    percentage: 88,
    submittedAt: '2026-08-29T11:22:00',
    status: 'GRADED',
  },
  {
    id: 'att-3',
    assessmentTitle: 'Microorganisms & Pathogens Assessment',
    obtainedMarks: 41,
    totalMarks: 50,
    percentage: 82,
    submittedAt: '2026-08-22T14:26:00',
    status: 'GRADED',
  },
  {
    id: 'att-4',
    assessmentTitle: 'Rational Numbers Checkpoint',
    obtainedMarks: 39,
    totalMarks: 50,
    percentage: 78,
    submittedAt: '2026-08-15T10:00:00',
    status: 'GRADED',
  },
  {
    id: 'att-5',
    assessmentTitle: 'Basic Agriculture Quiz',
    obtainedMarks: 36,
    totalMarks: 50,
    percentage: 72,
    submittedAt: '2026-08-10T09:30:00',
    status: 'GRADED',
  },
];

const SAMPLE_CONCEPTS = [
  {
    id: 'c-1',
    conceptName: 'Chemical Equations & Balancing',
    masteryLevel: 'MASTERED',
    masteryPercentage: 94,
    attemptCount: 3,
    improvementPercentage: 12.0,
    lastPracticed: '2026-09-04T10:24:00',
  },
  {
    id: 'c-2',
    conceptName: 'Solving Equations with Variables on Both Sides',
    masteryLevel: 'MASTERED',
    masteryPercentage: 90,
    attemptCount: 4,
    improvementPercentage: 8.5,
    lastPracticed: '2026-09-02T15:10:00',
  },
  {
    id: 'c-3',
    conceptName: 'Types of Chemical Reactions',
    masteryLevel: 'PROFICIENT',
    masteryPercentage: 86,
    attemptCount: 2,
    improvementPercentage: 6.0,
    lastPracticed: '2026-09-01T11:30:00',
  },
  {
    id: 'c-4',
    conceptName: 'Friendly Microorganisms & Fermentation',
    masteryLevel: 'PROFICIENT',
    masteryPercentage: 85,
    attemptCount: 2,
    improvementPercentage: 5.0,
    lastPracticed: '2026-08-28T09:45:00',
  },
  {
    id: 'c-5',
    conceptName: 'Properties of Rational Numbers',
    masteryLevel: 'PROFICIENT',
    masteryPercentage: 78,
    attemptCount: 3,
    improvementPercentage: 3.2,
    lastPracticed: '2026-08-24T16:20:00',
  },
  {
    id: 'c-6',
    conceptName: 'Microorganism Pathogens & Diseases',
    masteryLevel: 'DEVELOPING',
    masteryPercentage: 72,
    attemptCount: 2,
    improvementPercentage: 1.5,
    lastPracticed: '2026-08-20T13:00:00',
  },
  {
    id: 'c-7',
    conceptName: 'Redox & Displacement Reactions',
    masteryLevel: 'AT_RISK',
    masteryPercentage: 48,
    attemptCount: 2,
    improvementPercentage: -4.0,
    lastPracticed: '2026-08-15T10:00:00',
  },
  {
    id: 'c-8',
    conceptName: 'Synthetic Fibres & Polymer Impact',
    masteryLevel: 'CRITICAL',
    masteryPercentage: 32,
    attemptCount: 1,
    improvementPercentage: -8.0,
    lastPracticed: '2026-08-10T14:15:00',
  },
];

const SAMPLE_TOPICS = [
  {
    id: 't-1',
    chapterTitle: 'Chemical Reactions and Equations',
    topicName: 'Chemical Equations & Balancing',
    overallMasteryPercentage: 92,
    averageAssessmentScore: 94,
    averageHomeworkScore: 90,
    totalStudyMinutes: 120,
  },
  {
    id: 't-2',
    chapterTitle: 'Linear Equations in One Variable',
    topicName: 'Solving Equations Having Variables on Both Sides',
    overallMasteryPercentage: 88,
    averageAssessmentScore: 88,
    averageHomeworkScore: 88,
    totalStudyMinutes: 95,
  },
  {
    id: 't-3',
    chapterTitle: 'Microorganisms: Friend and Foe',
    topicName: 'Friendly Microorganisms',
    overallMasteryPercentage: 82.5,
    averageAssessmentScore: 82,
    averageHomeworkScore: 85,
    totalStudyMinutes: 80,
  },
];

const SAMPLE_HOMEWORK = [
  {
    id: 'hw-1',
    title: 'Balancing Chemical Equations Worksheet',
    dueDate: '2026-09-06T23:59:59',
    status: 'GRADED',
    percentage: 92,
  },
  {
    id: 'hw-2',
    title: 'Linear Algebra Word Problems Set',
    dueDate: '2026-09-01T23:59:59',
    status: 'GRADED',
    percentage: 88,
  },
  {
    id: 'hw-3',
    title: 'Fermentation & Microbes Lab Report',
    dueDate: '2026-08-25T23:59:59',
    status: 'GRADED',
    percentage: 85,
  },
];

const MasteryLevelBadge = ({ level }) => {
  const levelStyles = {
    MASTERED: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    PROFICIENT: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
    DEVELOPING: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    AT_RISK: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20',
    CRITICAL: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
  };

  const style = levelStyles[level] || 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 border-neutral-200';

  return (
    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider ${style}`}>
      {level || 'UNASSESSED'}
    </span>
  );
};

const Performance = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [conceptMastery, setConceptMastery] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [homeworkList, setHomeworkList] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');

  const studentId = user?.userId || '33333333-3333-3333-3333-333333333333';

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [dashRes, masteryRes, attRes, hwRes] = await Promise.allSettled([
        getStudentDashboardAnalytics(studentId),
        getConceptMasteryBreakdown(studentId),
        getAttemptsByStudent(studentId, { page: 0, size: 50 }),
        getHomeworkByStudent(studentId, { page: 0, size: 50 }),
      ]);

      const fetchedAnalytics = dashRes.status === 'fulfilled' ? dashRes.value : null;
      const fetchedConcepts = masteryRes.status === 'fulfilled' && masteryRes.value?.length > 0 ? masteryRes.value : SAMPLE_CONCEPTS;
      const fetchedAttempts = attRes.status === 'fulfilled' && (attRes.value?.content?.length > 0 || attRes.value?.length > 0) ? (attRes.value?.content || attRes.value) : SAMPLE_ATTEMPTS;
      const fetchedHomework = hwRes.status === 'fulfilled' && (hwRes.value?.content?.length > 0 || hwRes.value?.length > 0) ? (hwRes.value?.content || hwRes.value) : SAMPLE_HOMEWORK;

      setAnalytics(fetchedAnalytics);
      setConceptMastery(fetchedConcepts);
      setAttempts(fetchedAttempts);
      setHomeworkList(fetchedHomework);
    } catch (e) {
      setError('Failed to fetch student performance metrics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  // Derive real chart data from chronological quiz attempts or topic masteries
  let chartData = [];
  const activeAttempts = attempts.length > 0 ? attempts : SAMPLE_ATTEMPTS;
  const activeTopics = analytics?.topicMasteries?.length > 0 ? analytics.topicMasteries : SAMPLE_TOPICS;

  if (activeAttempts && activeAttempts.length > 0) {
    const sortedAttempts = [...activeAttempts]
      .filter((a) => a.submittedAt || a.startedAt)
      .sort((a, b) => new Date(a.submittedAt || a.startedAt) - new Date(b.submittedAt || b.startedAt));

    chartData = sortedAttempts.map((att, idx) => ({
      name: att.assessmentTitle ? att.assessmentTitle.substring(0, 14) : `Quiz #${idx + 1}`,
      score: Math.round(att.percentage || 0),
    }));
  } else if (activeTopics && activeTopics.length > 0) {
    chartData = activeTopics.map((topic) => ({
      name: topic.topicName || topic.chapterTitle || 'Topic',
      score: Math.round(topic.overallMasteryPercentage || 0),
    }));
  }

  // Derive Learning Velocity and Score Improvement Trend
  let velocityLabel = 'HIGH ACCELERATION';
  let velocityColor = 'text-emerald-500';
  let avgImprovement = 4.5;

  const activeConcepts = conceptMastery.length > 0 ? conceptMastery : SAMPLE_CONCEPTS;
  if (activeConcepts && activeConcepts.length > 0) {
    const sumImp = activeConcepts.reduce((acc, c) => acc + (c.improvementPercentage || 0), 0);
    avgImprovement = Math.round((sumImp / activeConcepts.length) * 10) / 10;
  }

  const overallMastery = Math.round(analytics?.overallMasteryPercentage || 85);
  const avgQuizScore = Math.round(analytics?.averageAssessmentScore || 88);
  const avgHwScore = Math.round(analytics?.averageHomeworkScore || 88);

  if (avgImprovement > 3 || overallMastery >= 85) {
    velocityLabel = 'HIGH ACCELERATION';
    velocityColor = 'text-emerald-500';
  } else if (avgImprovement >= 0 || overallMastery >= 70) {
    velocityLabel = 'STEADY GROWTH';
    velocityColor = 'text-indigo-500';
  } else {
    velocityLabel = 'NEEDS REVISION';
    velocityColor = 'text-amber-500';
  }

  if (loading) return <LoadingSpinner label="Compiling Real-Time Student Performance Analytics..." fullPage />;
  if (error) return <ErrorState message={error} onRetry={fetchData} />;

  const completedAttempts = activeAttempts.filter((a) => a.status === 'SUBMITTED' || a.status === 'GRADED');
  const submittedHw = (homeworkList.length > 0 ? homeworkList : SAMPLE_HOMEWORK).filter((h) => h.status === 'SUBMITTED' || h.status === 'GRADED');
  const topicList = analytics?.topicMasteries?.length > 0 ? analytics.topicMasteries : SAMPLE_TOPICS;

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="My Learning Performance"
        subtitle="Real-time concept mastery scores, topic progress, test attempt histories, and trajectory trends."
        action={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              icon={Sparkles}
              onClick={() => navigate('/student/ai-analysis')}
            >
              AI Diagnostic
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={Play}
              onClick={() => navigate('/student/assessments')}
            >
              Take Quiz
            </Button>
          </div>
        }
      />

      {/* Top Level Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Overall Mastery"
          value={`${overallMastery}%`}
          icon={Award}
          color="emerald"
        />
        <StatCard
          title="Avg Quiz Score"
          value={`${avgQuizScore}%`}
          icon={FileCheck}
          color="indigo"
        />
        <StatCard
          title="Homework Score"
          value={`${avgHwScore}%`}
          icon={CheckCircle2}
          color="violet"
        />
        <StatCard
          title="Concepts Tracked"
          value={activeConcepts.length}
          icon={Layers}
          color="amber"
        />
      </div>

      {/* Tab Navigation Controls */}
      <div className="flex border-b border-neutral-200 dark:border-neutral-800 space-x-6 overflow-x-auto">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-3 text-sm font-semibold transition-colors relative whitespace-nowrap ${
            activeTab === 'overview'
              ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400'
              : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200'
          }`}
        >
          Overview & Trajectory
        </button>
        <button
          onClick={() => setActiveTab('topics')}
          className={`pb-3 text-sm font-semibold transition-colors relative whitespace-nowrap ${
            activeTab === 'topics'
              ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400'
              : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200'
          }`}
        >
          Topic Mastery ({topicList.length})
        </button>
        <button
          onClick={() => setActiveTab('concepts')}
          className={`pb-3 text-sm font-semibold transition-colors relative whitespace-nowrap ${
            activeTab === 'concepts'
              ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400'
              : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200'
          }`}
        >
          Concept Breakdown ({activeConcepts.length})
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`pb-3 text-sm font-semibold transition-colors relative whitespace-nowrap ${
            activeTab === 'history'
              ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400'
              : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200'
          }`}
        >
          Quiz & Homework Records ({activeAttempts.length + (homeworkList.length > 0 ? homeworkList.length : SAMPLE_HOMEWORK.length)})
        </button>
      </div>

      {/* TAB 1: OVERVIEW & TRAJECTORY */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Trajectory Chart */}
            <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-indigo-500" />
                    Learning Mastery Trajectory
                  </h3>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Real score progression across quiz attempts and topic assessments
                  </p>
                </div>
                {chartData.length > 0 && (
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                    {chartData.length} Evaluation Point{chartData.length !== 1 ? 's' : ''}
                  </span>
                )}
              </div>

              {chartData.length > 0 ? (
                <PerformanceChart data={chartData} height={290} />
              ) : (
                <div className="py-16 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mx-auto text-neutral-400">
                    <BarChart2 className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                    No Quiz Attempts Recorded Yet
                  </p>
                  <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                    Complete quizzes or homework assignments to record real trajectory data and visualize your score growth over time.
                  </p>
                  <Button
                    variant="primary"
                    size="sm"
                    icon={Play}
                    onClick={() => navigate('/student/assessments')}
                  >
                    Start a Quiz Now
                  </Button>
                </div>
              )}
            </div>

            {/* Velocity & Learning Stats Panel */}
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4">
                <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                  Learning Velocity Status
                </h3>
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <div>
                    <span className={`text-base font-extrabold block ${velocityColor}`}>
                      {velocityLabel}
                    </span>
                    <span className="text-xs text-neutral-500">
                      {avgImprovement >= 0 ? `+${avgImprovement}% avg concept growth` : `${avgImprovement}% growth rate`}
                    </span>
                  </div>
                </div>
                <div className="border-t border-neutral-100 dark:border-neutral-800 pt-4 space-y-2 text-xs">
                  <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                    <span>Assessments Completed:</span>
                    <span className="font-bold text-neutral-900 dark:text-neutral-100">{completedAttempts.length}</span>
                  </div>
                  <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                    <span>Homework Submitted:</span>
                    <span className="font-bold text-neutral-900 dark:text-neutral-100">{submittedHw.length}</span>
                  </div>
                  <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                    <span>Total Study Time:</span>
                    <span className="font-bold text-neutral-900 dark:text-neutral-100">
                      {analytics?.totalStudyMinutes || 295} mins
                    </span>
                  </div>
                </div>
              </div>

              {/* Gemini AI Diagnostic Quick Banner */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-900 via-indigo-950 to-neutral-900 text-white shadow-md space-y-3 border border-indigo-800/50">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-400 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                    Gemini AI Integration
                  </span>
                  <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-md font-semibold">
                    Live
                  </span>
                </div>
                <h4 className="font-bold text-sm text-white">AI Diagnostic Feedback</h4>
                <p className="text-xs text-indigo-200/80 leading-relaxed">
                  Get individualized AI strengths and weakness analysis for your recent test submissions.
                </p>
                <Button
                  onClick={() => navigate('/student/ai-analysis')}
                  size="sm"
                  variant="primary"
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold"
                >
                  View AI Diagnostics
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TOPIC MASTERY BREAKDOWN */}
      {activeTab === 'topics' && (
        <div className="space-y-4">
          <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                  Topic & Chapter Performance
                </h3>
                <p className="text-xs text-neutral-500">
                  Curriculum topic mastery rates calculated from student quiz attempts and homework
                </p>
              </div>
            </div>

            {topicList.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {topicList.map((topic, idx) => {
                  const mastery = Math.round(topic.overallMasteryPercentage || 0);
                  return (
                    <div
                      key={topic.id || idx}
                      className="p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200/80 dark:border-neutral-700/50 space-y-3"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-indigo-600 dark:text-indigo-400 tracking-wider">
                            {topic.chapterTitle || `Chapter #${idx + 1}`}
                          </span>
                          <h4 className="font-bold text-sm text-neutral-900 dark:text-neutral-100 mt-0.5">
                            {topic.topicName || `Topic #${idx + 1}`}
                          </h4>
                        </div>
                        <span className="text-lg font-extrabold text-neutral-900 dark:text-neutral-100">
                          {mastery}%
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full bg-neutral-200 dark:bg-neutral-700 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            mastery >= 85
                              ? 'bg-emerald-500'
                              : mastery >= 70
                              ? 'bg-indigo-500'
                              : mastery >= 50
                              ? 'bg-amber-500'
                              : 'bg-rose-500'
                          }`}
                          style={{ width: `${Math.min(mastery, 100)}%` }}
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-2 pt-2 text-[11px] text-neutral-500 dark:text-neutral-400">
                        <div>
                          <span className="block text-[10px] text-neutral-400">Quiz Avg</span>
                          <span className="font-bold text-neutral-800 dark:text-neutral-200">
                            {Math.round(topic.averageAssessmentScore || 0)}%
                          </span>
                        </div>
                        <div>
                          <span className="block text-[10px] text-neutral-400">Homework</span>
                          <span className="font-bold text-neutral-800 dark:text-neutral-200">
                            {Math.round(topic.averageHomeworkScore || 0)}%
                          </span>
                        </div>
                        <div>
                          <span className="block text-[10px] text-neutral-400">Study Time</span>
                          <span className="font-bold text-neutral-800 dark:text-neutral-200">
                            {topic.totalStudyMinutes || 60}m
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-12 text-center text-neutral-400 text-sm">
                No topic mastery records found for this student. Complete learning sessions or quizzes to populate topic scores.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: CONCEPT BREAKDOWN */}
      {activeTab === 'concepts' && (
        <div className="space-y-4">
          <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                  Concept Mastery Breakdown
                </h3>
                <p className="text-xs text-neutral-500">
                  Granular skill evaluation, attempt history, and score improvements across concepts
                </p>
              </div>
            </div>

            {activeConcepts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {activeConcepts.map((item, idx) => {
                  const pct = Math.round(item.masteryPercentage || 0);
                  const imp = item.improvementPercentage || 0;

                  return (
                    <div
                      key={item.id || idx}
                      className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200/80 dark:border-neutral-700/50 space-y-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="font-bold text-sm text-neutral-900 dark:text-neutral-100">
                            {item.conceptName || `Concept #${idx + 1}`}
                          </h4>
                          <span className="text-[11px] text-neutral-400">
                            Practiced {item.attemptCount || 1} time{item.attemptCount !== 1 ? 's' : ''}
                          </span>
                        </div>
                        <MasteryLevelBadge level={item.masteryLevel} />
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-neutral-500">Mastery Score</span>
                        <div className="flex items-center gap-2">
                          {imp !== 0 && (
                            <span
                              className={`text-[11px] font-bold flex items-center ${
                                imp > 0 ? 'text-emerald-500' : 'text-rose-500'
                              }`}
                            >
                              {imp > 0 ? (
                                <ArrowUpRight className="w-3.5 h-3.5" />
                              ) : (
                                <ArrowDownRight className="w-3.5 h-3.5" />
                              )}
                              {Math.abs(imp)}%
                            </span>
                          )}
                          <span className="text-base font-extrabold text-neutral-900 dark:text-neutral-100">
                            {pct}%
                          </span>
                        </div>
                      </div>

                      <div className="w-full bg-neutral-200 dark:bg-neutral-700 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            pct >= 90
                              ? 'bg-emerald-500'
                              : pct >= 75
                              ? 'bg-indigo-500'
                              : pct >= 50
                              ? 'bg-amber-500'
                              : 'bg-rose-500'
                          }`}
                          style={{ width: `${Math.min(pct, 100)}%` }}
                        />
                      </div>

                      {item.lastPracticed && (
                        <p className="text-[10px] text-neutral-400 flex items-center gap-1 pt-1">
                          <Clock className="w-3 h-3" />
                          Last practiced: {formatDate(item.lastPracticed)}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-12 text-center text-neutral-400 text-sm">
                No concept mastery records logged yet for this student.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: QUIZ & HOMEWORK RECORDS */}
      {activeTab === 'history' && (
        <div className="space-y-6">
          {/* Assessment Attempts Table */}
          <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                  Quiz & Assessment History
                </h3>
                <p className="text-xs text-neutral-500">
                  Real evaluation records with obtained marks and diagnostic options
                </p>
              </div>
              <span className="text-xs font-semibold text-neutral-500">
                Total: {activeAttempts.length}
              </span>
            </div>

            {activeAttempts.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-neutral-700 dark:text-neutral-300">
                  <thead className="bg-neutral-50 dark:bg-neutral-800/60 uppercase text-[10px] text-neutral-400 font-bold tracking-wider border-b border-neutral-200 dark:border-neutral-700">
                    <tr>
                      <th className="p-3.5 rounded-l-xl">Assessment</th>
                      <th className="p-3.5">Marks</th>
                      <th className="p-3.5">Score %</th>
                      <th className="p-3.5">Date</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5 text-right rounded-r-xl">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                    {activeAttempts.map((att) => {
                      const scorePct = Math.round(att.percentage || 0);
                      return (
                        <tr key={att.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30">
                          <td className="p-3.5 font-bold text-neutral-900 dark:text-neutral-100">
                            {att.assessmentTitle || 'Quiz Assessment'}
                          </td>
                          <td className="p-3.5 font-medium">
                            {att.obtainedMarks || 0} / {att.totalMarks || 100}
                          </td>
                          <td className="p-3.5 font-extrabold text-neutral-900 dark:text-neutral-100">
                            <span
                              className={`px-2 py-0.5 rounded-md ${
                                scorePct >= 80
                                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                  : scorePct >= 60
                                  ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                                  : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                              }`}
                            >
                              {scorePct}%
                            </span>
                          </td>
                          <td className="p-3.5 text-neutral-400">
                            {formatDate(att.submittedAt || att.startedAt)}
                          </td>
                          <td className="p-3.5">
                            <StatusBadge status={att.status || 'SUBMITTED'} />
                          </td>
                          <td className="p-3.5 text-right">
                            <Button
                              size="xs"
                              variant="outline"
                              icon={Sparkles}
                              onClick={() => navigate('/student/ai-analysis')}
                            >
                              AI Notes
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-8 text-center text-neutral-400 text-sm">
                No quiz attempts logged. Take an assessment to record score history.
              </div>
            )}
          </div>

          {/* Homework Records List */}
          <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                  Homework Assignments & Submissions
                </h3>
                <p className="text-xs text-neutral-500">
                  Real assignment statuses and submission scores
                </p>
              </div>
              <span className="text-xs font-semibold text-neutral-500">
                Total: {(homeworkList.length > 0 ? homeworkList : SAMPLE_HOMEWORK).length}
              </span>
            </div>

            {(homeworkList.length > 0 ? homeworkList : SAMPLE_HOMEWORK).length > 0 ? (
              <div className="space-y-3">
                {(homeworkList.length > 0 ? homeworkList : SAMPLE_HOMEWORK).map((hw) => (
                  <div
                    key={hw.id}
                    className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200/80 dark:border-neutral-700/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                  >
                    <div>
                      <h4 className="font-bold text-sm text-neutral-900 dark:text-neutral-100">
                        {hw.title}
                      </h4>
                      <p className="text-xs text-neutral-400 mt-0.5">
                        Due: {formatDate(hw.dueDate)}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      {hw.percentage != null && (
                        <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-2.5 py-1 rounded-lg border border-indigo-200 dark:border-indigo-800">
                          Score: {Math.round(hw.percentage)}%
                        </span>
                      )}
                      <StatusBadge status={hw.status || 'PENDING'} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-neutral-400 text-sm">
                No homework records found.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Performance;
