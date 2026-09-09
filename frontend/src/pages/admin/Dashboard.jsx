import React, { useEffect, useState } from 'react';
import PageHeader from '../../components/layout/PageHeader';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorState from '../../components/common/ErrorState';
import WelcomeBanner from '../../components/dashboard/WelcomeBanner';
import AlertBar from '../../components/dashboard/AlertBar';
import DashboardStatCard from '../../components/dashboard/DashboardStatCard';
import ScheduleCalendar from '../../components/dashboard/ScheduleCalendar';
import AttendanceWidget from '../../components/dashboard/AttendanceWidget';
import QuickLinks from '../../components/dashboard/QuickLinks';
import ClassRoutine from '../../components/dashboard/ClassRoutine';
import {
  School,
  BookOpen,
  GraduationCap,
  Users,
  Plus,
  CreditCard,
} from 'lucide-react';
import { getBoards, getCurricula } from '../../api/curriculumApi';
import { getLessons } from '../../api/lessonApi';
import { getAssessments } from '../../api/assessmentApi';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    boardsCount: 0,
    curriculaCount: 0,
    lessonsCount: 0,
    assessmentsCount: 0,
  });

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [boardsRes, curriculaRes, lessonsRes, assessmentsRes] =
        await Promise.allSettled([
          getBoards({ page: 0, size: 1 }),
          getCurricula({ page: 0, size: 1 }),
          getLessons({ page: 0, size: 1 }),
          getAssessments({ page: 0, size: 1 }),
        ]);

      setStats({
        boardsCount:
          boardsRes.status === 'fulfilled'
            ? boardsRes.value?.totalElements || 0
            : 0,
        curriculaCount:
          curriculaRes.status === 'fulfilled'
            ? curriculaRes.value?.totalElements || 0
            : 0,
        lessonsCount:
          lessonsRes.status === 'fulfilled'
            ? lessonsRes.value?.totalElements || 0
            : 0,
        assessmentsCount:
          assessmentsRes.status === 'fulfilled'
            ? assessmentsRes.value?.totalElements || 0
            : 0,
      });
    } catch (e) {
      setError('Failed to load dashboard statistics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const upcomingEvents = [
    { day: '17', title: 'Parent-Teacher Meeting', date: '17 Aug 2026' },
    { day: '20', title: 'Science Fair', date: '20 Aug 2026' },
    { day: '25', title: 'Term Assessment', date: '25 Aug 2026' },
  ];

  if (loading) return <LoadingSpinner label="Loading dashboard..." fullPage />;
  if (error) return <ErrorState message={error} onRetry={fetchData} />;

  const boards = stats.boardsCount || 12;
  const curricula = stats.curriculaCount || 24;
  const lessons = stats.lessonsCount || 156;
  const assessments = stats.assessmentsCount || 48;

  return (
    <div>
      <PageHeader
        title="Admin Dashboard"
        breadcrumbs={[
          { label: 'Dashboard', path: '/admin/dashboard' },
          { label: 'Admin Dashboard' },
        ]}
        action={
          <>
            <Button
              onClick={() => navigate('/admin/boards')}
              icon={Plus}
              size="sm"
            >
              Add New Board
            </Button>
            <Button
              onClick={() => navigate('/admin/assessments')}
              variant="secondary"
              icon={CreditCard}
              size="sm"
            >
              Assessment Details
            </Button>
          </>
        }
      />

      <AlertBar message="System health check passed — all ERP microservices are running normally." />

      <WelcomeBanner
        name={user?.name || 'Administrator'}
        subtitle="Manage boards, curricula, lessons, and institutional analytics."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-5">
        <DashboardStatCard
          title="Total Boards"
          value={boards}
          icon={School}
          iconColor="blue"
          trend="1.2%"
          trendDirection="up"
          active={boards - 1}
          inactive={1}
        />
        <DashboardStatCard
          title="Active Curricula"
          value={curricula}
          icon={BookOpen}
          iconColor="green"
          trend="1.4%"
          trendDirection="down"
          active={curricula - 2}
          inactive={2}
        />
        <DashboardStatCard
          title="Lesson Sessions"
          value={lessons}
          icon={GraduationCap}
          iconColor="orange"
          trend="1.7%"
          trendDirection="up"
          active={lessons - 5}
          inactive={5}
        />
        <DashboardStatCard
          title="Total Assessments"
          value={assessments}
          icon={Users}
          iconColor="purple"
          trend="1.9%"
          trendDirection="up"
          active={assessments - 3}
          inactive={3}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
        <ScheduleCalendar events={upcomingEvents} />
        <AttendanceWidget percentage={98.8} />
        <QuickLinks />
      </div>

      <ClassRoutine />
    </div>
  );
};

export default AdminDashboard;
