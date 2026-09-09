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
import QuickLinks, { STUDENT_QUICK_LINKS } from '../../components/dashboard/QuickLinks';
import ClassRoutine from '../../components/dashboard/ClassRoutine';
import InsightBanner from '../../components/dashboard/InsightBanner';
import ActivityList from '../../components/dashboard/ActivityList';
import PerformanceChart from '../../components/charts/PerformanceChart';
import StatusBadge from '../../components/common/StatusBadge';
import useAuth from '../../hooks/useAuth';
import { getStudentDashboardAnalytics } from '../../api/analyticsApi';
import { getHomeworkByStudent } from '../../api/homeworkApi';
import { getAttemptsByStudent } from '../../api/assessmentAttemptApi';
import { getLessons } from '../../api/lessonApi';
import { formatDate } from '../../utils/formatters';
import {
  Award,
  FileCheck,
  ClipboardList,
  BookOpen,
  Play,
} from 'lucide-react';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [homeworkList, setHomeworkList] = useState([]);
  const [attemptsList, setAttemptsList] = useState([]);
  const [lessonsList, setLessonsList] = useState([]);

  const fetchStudentData = async () => {
    setLoading(true);
    setError(null);
    try {
      const studentId = user?.userId || '33333333-3333-3333-3333-333333333333';
      const [dashRes, hwRes, attRes, lesRes] = await Promise.allSettled([
        getStudentDashboardAnalytics(studentId),
        getHomeworkByStudent(studentId, { page: 0, size: 5 }),
        getAttemptsByStudent(studentId, { page: 0, size: 5 }),
        getLessons({ page: 0, size: 5 }),
      ]);

      if (dashRes.status === 'fulfilled') setDashboardData(dashRes.value);
      if (hwRes.status === 'fulfilled') setHomeworkList(hwRes.value?.content || []);
      if (attRes.status === 'fulfilled') setAttemptsList(attRes.value?.content || []);
      if (lesRes.status === 'fulfilled') setLessonsList(lesRes.value?.content || []);
    } catch (e) {
      setError('Failed to load student dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentData();
  }, [user]);

  const overallScore = Math.round(dashboardData?.overallMasteryPercentage || 0);
  const attemptsCount = attemptsList.length;
  const pendingHw = homeworkList.filter((h) => h.status !== 'SUBMITTED' && h.status !== 'GRADED').length;
  const lessonsCount = lessonsList.length;

  let scoreTrend = [];
  if (attemptsList && attemptsList.length > 0) {
    const sorted = [...attemptsList]
      .filter((a) => a.submittedAt || a.startedAt)
      .sort((a, b) => new Date(a.submittedAt || a.startedAt) - new Date(b.submittedAt || b.startedAt));
    scoreTrend = sorted.map((att, idx) => ({
      name: att.assessmentTitle ? att.assessmentTitle.substring(0, 12) : `Quiz #${idx + 1}`,
      score: Math.round(att.percentage || 0),
    }));
  } else if (dashboardData?.topicMasteries && dashboardData.topicMasteries.length > 0) {
    scoreTrend = dashboardData.topicMasteries.map((topic) => ({
      name: topic.topicName || topic.chapterTitle || 'Topic',
      score: Math.round(topic.overallMasteryPercentage || 0),
    }));
  } else if (overallScore > 0) {
    scoreTrend = [{ name: 'Current Mastery', score: overallScore }];
  }

  const upcomingEvents = [
    { day: '16', title: 'Science Quiz — Chapter 5', date: '16 Aug 2026' },
    { day: '19', title: 'Math Homework Due', date: '19 Aug 2026' },
    { day: '22', title: 'English Presentation', date: '22 Aug 2026' },
  ];

  const studentRoutine = [
    { subject: 'Mathematics', teacher: 'Mr. Aaron', room: '12-A', time: '09:30 - 10:30', color: 'bg-blue-500' },
    { subject: 'English', teacher: 'Ms. Hellana', room: '12-B', time: '10:30 - 11:30', color: 'bg-yellow-500' },
    { subject: 'Physics', teacher: 'Mr. Morgan', room: '12-C', time: '11:30 - 12:30', color: 'bg-green-500' },
  ];

  if (loading) return <LoadingSpinner label="Loading your learning hub..." fullPage />;
  if (error) return <ErrorState message={error} onRetry={fetchStudentData} />;

  const firstName = user?.name?.split(' ')[0] || 'Student';

  return (
    <div>
      <PageHeader
        title="Student Dashboard"
        breadcrumbs={[
          { label: 'Dashboard', path: '/student/dashboard' },
          { label: 'Student Dashboard' },
        ]}
        action={
          <Button onClick={() => navigate('/student/assessments')} icon={Play} size="sm">
            Take Assessment
          </Button>
        }
      />

      <AlertBar
        message={`You have ${pendingHw} pending homework assignment${pendingHw !== 1 ? 's' : ''} — complete them before the due dates.`}
      />

      <WelcomeBanner
        name={firstName}
        subtitle={`Your overall mastery score is ${overallScore}%. Keep up the great work!`}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-5">
        <DashboardStatCard
          title="Overall Score"
          value={`${overallScore}%`}
          icon={Award}
          iconColor="green"
          trend="+5%"
          trendDirection="up"
          active={attemptsCount}
          inactive={0}
        />
        <DashboardStatCard
          title="Assessments Done"
          value={attemptsCount}
          icon={FileCheck}
          iconColor="blue"
          trend="3.2%"
          trendDirection="up"
          active={attemptsCount}
          inactive={0}
        />
        <DashboardStatCard
          title="Pending Homework"
          value={pendingHw}
          icon={ClipboardList}
          iconColor="orange"
          trend="1.1%"
          trendDirection="down"
          active={0}
          inactive={pendingHw}
        />
        <DashboardStatCard
          title="Lessons Completed"
          value={lessonsCount}
          icon={BookOpen}
          iconColor="purple"
          trend="2.4%"
          trendDirection="up"
          active={lessonsCount - 1}
          inactive={1}
        />
      </div>

      <InsightBanner
        title="AI Learning Recommendations"
        message="Strong mastery in Linear Motion. Recommended review: Vector Resolution & Frictional Coefficients before your next quiz."
        actionLabel="View Practice"
        onAction={() => navigate('/student/ai-recommendations')}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
        <ScheduleCalendar events={upcomingEvents} />
        <AttendanceWidget
          percentage={overallScore}
          stats={{ emergency: 0, absent: 1, late: 2 }}
        />
        <QuickLinks links={STUDENT_QUICK_LINKS} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
        <div className="lg:col-span-2 card-panel p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-[#202c4b] dark:text-white">
                Performance Overview
              </h3>
              <p className="text-xs text-neutral-500">
                Score progress across recent assessment attempts
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => navigate('/student/performance')}>
              Full Analytics
            </Button>
          </div>
          <PerformanceChart data={scoreTrend} height={260} />
        </div>

        <ActivityList
          title="Pending Homework"
          onViewAll={() => navigate('/student/homework')}
          emptyMessage="No pending homework assignments."
          items={homeworkList.slice(0, 4)}
          renderItem={(hw) => (
            <div
              key={hw.id}
              onClick={() => navigate('/student/homework')}
              className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 hover:bg-[#eef1fd] dark:hover:bg-[#3d5ee1]/10 cursor-pointer transition-colors"
            >
              <div>
                <p className="text-sm font-semibold text-[#202c4b] dark:text-white">
                  {hw.title}
                </p>
                <p className="text-[11px] text-neutral-400 mt-0.5">
                  Due: {formatDate(hw.dueDate)}
                </p>
              </div>
              <StatusBadge status={hw.status || 'PENDING'} />
            </div>
          )}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        <ActivityList
          title="Recent Test Attempts"
          onViewAll={() => navigate('/student/assessments')}
          emptyMessage="No recent test attempts found."
          items={attemptsList.slice(0, 4)}
          renderItem={(att) => (
            <div
              key={att.id}
              onClick={() => navigate('/student/assessments')}
              className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 hover:bg-[#eef1fd] dark:hover:bg-[#3d5ee1]/10 cursor-pointer transition-colors"
            >
              <div>
                <p className="text-sm font-semibold text-[#202c4b] dark:text-white">
                  Score: {att.obtainedMarks || 0} / {att.totalMarks || 100}
                </p>
                <p className="text-[11px] text-neutral-400 mt-0.5">
                  Started: {formatDate(att.startedAt)}
                </p>
              </div>
              <StatusBadge status={att.status || 'SUBMITTED'} />
            </div>
          )}
        />

        <ClassRoutine items={studentRoutine} />
      </div>
    </div>
  );
};

export default StudentDashboard;
