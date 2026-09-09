import React, { useEffect, useState } from 'react';
import PageHeader from '../../components/layout/PageHeader';
import DataTable from '../../components/common/DataTable';
import SearchInput from '../../components/common/SearchInput';
import ErrorState from '../../components/common/ErrorState';
import StatusBadge from '../../components/common/StatusBadge';
import { getAssessments } from '../../api/assessmentApi';
import { FileCheck, Clock, Award } from 'lucide-react';

const AdminAssessments = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pageResponse, setPageResponse] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);

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
      header: 'Passing Marks',
      accessorKey: 'passingMarks',
      render: (row) => <span className="text-xs font-semibold">{row.passingMarks}%</span>,
    },
    {
      header: 'Status',
      accessorKey: 'status',
      render: (row) => <StatusBadge status={row.status || 'DRAFT'} />,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Institutional Assessments Registry"
        subtitle="System-wide audit of all authored assessments, quizzes, and test statuses."
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
          emptyTitle="No Assessments Found"
          emptyDescription="There are no assessments configured in the system."
          pageResponse={pageResponse}
          onPageChange={(newPage) => setPage(newPage)}
        />
      )}
    </div>
  );
};

export default AdminAssessments;
