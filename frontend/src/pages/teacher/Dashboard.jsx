import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/layout/PageHeader';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorState from '../../components/common/ErrorState';
import WelcomeBanner from '../../components/dashboard/WelcomeBanner';
import AlertBar from '../../components/dashboard/AlertBar';
import DashboardStatCard from '../../components/dashboard/DashboardStatCard';
import ScheduleCalendar from '../../components/dashboard/ScheduleCalendar';
import AttendanceWidget from '../../components/dashboard/AttendanceWidget';
import QuickLinks, { TEACHER_QUICK_LINKS } from '../../components/dashboard/QuickLinks';
import ClassRoutine from '../../components/dashboard/ClassRoutine';
import InsightBanner from '../../components/dashboard/InsightBanner';
import ActivityList from '../../components/dashboard/ActivityList';
import ClassAnalyticsChart from '../../components/charts/ClassAnalyticsChart';
import PerformanceChart from '../../components/charts/PerformanceChart';
import StatusBadge from '../../components/common/StatusBadge';
import useAuth from '../../hooks/useAuth';
import { getTeacherInsights, getClassAnalytics } from '../../api/analyticsApi';
import { getLessons } from '../../api/lessonApi';
import { getAssessments } from '../../api/assessmentApi';
import {
  Users,
  BookOpen,
  FileCheck,
  AlertCircle,
  Plus,
  ClipboardList,
} from 'lucide-react';

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [teacherInsight, setTeacherInsight] = useState(null);
  const [classAnalytics, setClassAnalytics] = useState(null);
  const [recentLessons, setRecentLessons] = useState([]);
  const [recentAssessments, setRecentAssessments] = useState([]);

  const fetchTeacherData = async () => {
    setLoading(true);
    setError(null);
    try {
      const teacherId = user?.userId || '22222222-2222-2222-2222-222222222222';
      const [insightRes, classRes, lessonsRes, assessmentsRes] =
        await Promise.allSettled([
          getTeacherInsights(teacherId),
          getClassAnalytics({
            sectionId: user?.sectionId,
            schoolId: user?.schoolId,
          }),
          getLessons({ page: 0, size: 5 }),
          getAssessments({ page: 0, size: 5 }),
        ]);

      if (insightRes.status === 'fulfilled') setTeacherInsight(insightRes.value);
      if (classRes.status === 'fulfilled') setClassAnalytics(classRes.value);
      if (lessonsRes.status === 'fulfilled')
        setRecentLessons(lessonsRes.value?.content || []);
      if (assessmentsRes.status === 'fulfilled')
        setRecentAssessments(assessmentsRes.value?.content || []);
    } catch (e) {
      setError('Failed to fetch teacher dashboard insights');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeacherData();
  }, [user]);

  const performanceTrend = [
    { name: 'Topic 1', score: classAnalytics?.averageScore || 72 },
    { name: 'Topic 2', score: 68 },
    { name: 'Topic 3', score: 85 },
    { name: 'Topic 4', score: 79 },
    { name: 'Topic 5', score: 88 },
  ];

  let classAnalyticsData = [];
  if (classAnalytics?.topicPerformances && classAnalytics.topicPerformances.length > 0) {
    classAnalyticsData = classAnalytics.topicPerformances.map((tp) => ({
      name: tp.topicName ? (tp.topicName.length > 14 ? tp.topicName.substring(0, 14) + '...' : tp.topicName) : 'Topic',
      collected: Math.round(tp.averageAssessmentScore || 0),
      total: Math.round(tp.averageHomeworkScore || 0),
      score: Math.round(tp.averageMastery || 0),
    }));
  } else {
    classAnalyticsData = [
      { name: 'Chemical Eq.', collected: 94, total: 90, score: 92 },
      { name: 'Linear Eq.', collected: 88, total: 88, score: 88 },
      { name: 'Microorganisms', collected: 82, total: 85, score: 83.5 },
      { name: 'Rational Num.', collected: 78, total: 78, score: 78 },
      { name: 'Agriculture', collected: 72, total: 72, score: 72 },
    ];
  }

  const classAvg = Math.round(classAnalytics?.averageClassMastery || classAnalytics?.averageScore || 83);
  const lessonCount = recentLessons.length || 8;
  const assessmentCount = recentAssessments.length || 5;
  const attentionCount = classAnalytics?.studentsNeedingAttentionCount || classAnalytics?.studentsNeedingAttention?.length || 3;

  const upcomingEvents = [
    { day: '18', title: 'Section A — Physics Lab', date: '18 Aug 2026' },
    { day: '21', title: 'Parent Review Meeting', date: '21 Aug 2026' },
    { day: '28', title: 'Mid-Term Assessment', date: '28 Aug 2026' },
  ];

  const teacherRoutine = [
    { subject: 'Mathematics', teacher: user?.name?.split(' ')[0] || 'You', room: '10-A', time: '09:00 - 10:00', color: 'bg-blue-500' },
    { subject: 'Physics', teacher: user?.name?.split(' ')[0] || 'You', room: '10-B', time: '10:30 - 11:30', color: 'bg-green-500' },
    { subject: 'Chemistry', teacher: user?.name?.split(' ')[0] || 'You', room: 'Lab-2', time: '12:00 - 13:00', color: 'bg-yellow-500' },
  ];

  if (loading) return <LoadingSpinner label="Loading teacher dashboard..." fullPage />;
  if (error) return <ErrorState message={error} onRetry={fetchTeacherData} />;

  return (
    <div>
      <PageHeader
        title="Teacher Dashboard"
        breadcrumbs={[
          { label: 'Dashboard', path: '/teacher/dashboard' },
          { label: 'Teacher Dashboard' },
        ]}
        action={
          <>
            <Button onClick={() => navigate('/teacher/lessons')} icon={Plus} size="sm">
              New Lesson
            </Button>
            <Button
              onClick={() => navigate('/teacher/assessments/create')}
              variant="secondary"
              icon={ClipboardList}
              size="sm"
            >
              Create Assessment
            </Button>
          </>
        }
      />

      <AlertBar message={`Class average mastery is at ${classAvg}% — ${attentionCount} students need additional support this week.`} />

      <WelcomeBanner
        name={user?.name || 'Educator'}
        subtitle="Manage lessons, assessments, and track your class performance."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-5">
        <DashboardStatCard
          title="Class Average Mastery"
          value={`${classAvg}%`}
          icon={Users}
          iconColor="blue"
          trend="+4.2%"
          trendDirection="up"
          active={classAnalytics?.activeStudents || 28}
          inactive={attentionCount}
        />
        <DashboardStatCard
          title="Lessons Taught"
          value={lessonCount}
          icon={BookOpen}
          iconColor="green"
          trend="2.1%"
          trendDirection="up"
          active={lessonCount - 1}
          inactive={1}
        />
        <DashboardStatCard
          title="Active Assessments"
          value={assessmentCount}
          icon={FileCheck}
          iconColor="orange"
          trend="1.5%"
          trendDirection="neutral"
          active={assessmentCount - 1}
          inactive={1}
        />
        <DashboardStatCard
          title="Needing Attention"
          value={attentionCount}
          icon={AlertCircle}
          iconColor="red"
          trend="0.8%"
          trendDirection="down"
          active={0}
          inactive={attentionCount}
        />
      </div>

      {teacherInsight && (
        <InsightBanner
          title="Recommended Concept Revision"
          message={
            teacherInsight.insightSummary ||
            'Class analysis suggests scheduling a targeted review on key concepts before the upcoming assessment.'
          }
          actionLabel="View AI Insights"
          onAction={() => navigate('/teacher/ai-recommendations')}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
        <ScheduleCalendar events={upcomingEvents} />
        <AttendanceWidget
          percentage={classAvg}
          stats={{ emergency: 4, absent: attentionCount, late: 6 }}
        />
        <QuickLinks links={TEACHER_QUICK_LINKS} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
        <div className="lg:col-span-2 card-panel p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-[#202c4b] dark:text-white">
                Class Performance by Topic
              </h3>
              <p className="text-xs text-neutral-500">
                Average quiz and homework mastery scores across curriculum topics
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => navigate('/teacher/analytics')}>
              View Analytics
            </Button>
          </div>
          <ClassAnalyticsChart data={classAnalyticsData} height={260} collectedLabel="Quiz Average %" totalLabel="Homework Average %" />
        </div>

        <ActivityList
          title="Recent Assessments"
          onViewAll={() => navigate('/teacher/assessments')}
          emptyMessage="No recent assessments created yet."
          items={recentAssessments}
          renderItem={(a) => (
            <div
              key={a.id}
              onClick={() => navigate('/teacher/assessments')}
              className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 hover:bg-[#eef1fd] dark:hover:bg-[#3d5ee1]/10 cursor-pointer transition-colors"
            >
              <div className="min-w-0 pr-2">
                <p className="text-sm font-semibold text-[#202c4b] dark:text-white truncate">
                  {a.title}
                </p>
                <p className="text-[11px] text-neutral-400 mt-0.5">
                  {a.assessmentType} · {a.passingMarks || 0} passing marks
                </p>
              </div>
              <StatusBadge status={a.status || 'DRAFT'} />
            </div>
          )}
        />
      </div>

      <ClassRoutine items={teacherRoutine} />
    </div>
  );
};

export default TeacherDashboard;
