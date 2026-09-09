import React, { useEffect, useState } from 'react';
import PageHeader from '../../components/layout/PageHeader';
import DataTable from '../../components/common/DataTable';
import SearchInput from '../../components/common/SearchInput';
import ErrorState from '../../components/common/ErrorState';
import StatusBadge from '../../components/common/StatusBadge';
import { getLessons } from '../../api/lessonApi';
import { BookOpen, Calendar, Clock } from 'lucide-react';
import { formatDate } from '../../utils/formatters';

const AdminLessons = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pageResponse, setPageResponse] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);

  const fetchLessons = async (currentPage = page, query = searchQuery) => {
    setLoading(true);
    setError(null);
    try {
      const res = await getLessons({ page: currentPage, size: 10, sort: 'lessonDate,desc' });
      setPageResponse(res);
    } catch (e) {
      setError(e.message || 'Failed to fetch system lessons.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLessons(page, searchQuery);
  }, [page, searchQuery]);

  const columns = [
    {
      header: 'Lesson Session',
      accessorKey: 'lessonTitle',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-900/60 text-neutral-900 dark:text-neutral-500">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <p className="font-semibold text-neutral-900 dark:text-neutral-100">{row.lessonTitle}</p>
            <p className="text-xs text-neutral-400">Mode: {row.teachingMode || 'OFFLINE'}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Date',
      accessorKey: 'lessonDate',
      render: (row) => (
        <span className="text-xs text-neutral-600 dark:text-neutral-400 flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5 text-neutral-400" />
          {formatDate(row.lessonDate)}
        </span>
      ),
    },
    {
      header: 'Duration',
      accessorKey: 'estimatedDurationMinutes',
      render: (row) => (
        <span className="text-xs text-neutral-600 dark:text-neutral-400 flex items-center gap-1">
          <Clock className="w-3.5 h-3.5 text-neutral-400" />
          {row.estimatedDurationMinutes || 60} mins
        </span>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'status',
      render: (row) => <StatusBadge status={row.status || 'PLANNED'} />,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Institutional Lessons Catalog"
        subtitle="System-wide overview of recorded classroom teaching sessions across grades."
      />

      <div className="flex items-center justify-between gap-4">
        <div className="w-full sm:w-80">
          <SearchInput
            value={searchQuery}
            onChange={(val) => {
              setSearchQuery(val);
              setPage(0);
            }}
            placeholder="Search lessons..."
          />
        </div>
      </div>

      {error ? (
        <ErrorState message={error} onRetry={() => fetchLessons(page, searchQuery)} />
      ) : (
        <DataTable
          columns={columns}
          data={pageResponse?.content || []}
          isLoading={loading}
          emptyTitle="No Lessons Found"
          emptyDescription="There are no recorded lesson sessions in the system."
          pageResponse={pageResponse}
          onPageChange={(newPage) => setPage(newPage)}
        />
      )}
    </div>
  );
};

export default AdminLessons;
