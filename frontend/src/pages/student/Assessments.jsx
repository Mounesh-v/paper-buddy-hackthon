import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/layout/PageHeader';
import DataTable from '../../components/common/DataTable';
import SearchInput from '../../components/common/SearchInput';
import Button from '../../components/common/Button';
import ErrorState from '../../components/common/ErrorState';
import StatusBadge from '../../components/common/StatusBadge';
import useAuth from '../../hooks/useAuth';
import { FileCheck, Play, Clock, Award } from 'lucide-react';
import { getAssessments } from '../../api/assessmentApi';
import { startAssessmentAttempt } from '../../api/assessmentAttemptApi';
import { formatDate } from '../../utils/formatters';

const StudentAssessments = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pageResponse, setPageResponse] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [startingId, setStartingId] = useState(null);

  const fetchAssessments = async (currentPage = page, query = searchQuery) => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAssessments({ page: currentPage, size: 10, sort: 'createdAt,desc' });
      setPageResponse(res);
    } catch (e) {
      setError(e.message || 'Failed to fetch assessments.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssessments(page, searchQuery);
  }, [page, searchQuery]);

  const handleStartAttempt = async (assessmentId) => {
    setStartingId(assessmentId);
    try {
      const payload = {
        assessmentId,
        studentId: user?.userId || '33333333-3333-3333-3333-333333333333',
        schoolId: user?.schoolId || 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        sectionId: user?.sectionId || 'f8e7d6c5-b4a3-2109-8765-43210fedcba9',
      };
      const attemptRes = await startAssessmentAttempt(payload);
      navigate(`/student/assessments/take/${attemptRes.id}`);
    } catch (e) {
      alert(e.message || 'Failed to start assessment attempt');
    } finally {
      setStartingId(null);
    }
  };

  const columns = [
    {
      header: 'Assessment Title',
      accessorKey: 'title',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-900/60 text-neutral-900 dark:text-neutral-500">
            <FileCheck className="w-4 h-4" />
          </div>
          <div>
            <p className="font-semibold text-neutral-900 dark:text-neutral-100">{row.title}</p>
            <p className="text-xs text-neutral-400">Type: {row.assessmentType}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Duration',
      accessorKey: 'estimatedDurationMinutes',
      render: (row) => (
        <span className="text-xs text-neutral-600 dark:text-neutral-400 flex items-center gap-1">
          <Clock className="w-3.5 h-3.5 text-neutral-400" />
          {row.estimatedDurationMinutes || 30} mins
        </span>
      ),
    },
    {
      header: 'Passing Score',
      accessorKey: 'passingMarks',
      render: (row) => (
        <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-500 flex items-center gap-1">
          <Award className="w-3.5 h-3.5" />
          {row.passingMarks}%
        </span>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'status',
      render: (row) => <StatusBadge status={row.status || 'PUBLISHED'} />,
    },
    {
      header: 'Action',
      render: (row) => (
        <Button
          size="sm"
          icon={Play}
          isLoading={startingId === row.id}
          onClick={() => handleStartAttempt(row.id)}
        >
          Take Quiz
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Assessments"
        subtitle="Available quizzes, diagnostic tests, and homework evaluation tests."
      />

      <div className="flex items-center justify-between gap-4">
        <div className="w-full sm:w-80">
          <SearchInput
            value={searchQuery}
            onChange={(val) => {
              setSearchQuery(val);
              setPage(0);
            }}
            placeholder="Search assessments..."
          />
        </div>
      </div>

      {error ? (
        <ErrorState message={error} onRetry={() => fetchAssessments(page, searchQuery)} />
      ) : (
        <DataTable
          columns={columns}
          data={pageResponse?.content || []}
          isLoading={loading}
          emptyTitle="No Assessments Available"
          emptyDescription="There are no active assessments assigned at this moment."
          pageResponse={pageResponse}
          onPageChange={(newPage) => setPage(newPage)}
        />
      )}
    </div>
  );
};

export default StudentAssessments;
