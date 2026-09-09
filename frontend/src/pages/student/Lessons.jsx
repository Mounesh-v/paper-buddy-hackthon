import React, { useEffect, useState } from 'react';
import PageHeader from '../../components/layout/PageHeader';
import DataTable from '../../components/common/DataTable';
import SearchInput from '../../components/common/SearchInput';
import ErrorState from '../../components/common/ErrorState';
import StatusBadge from '../../components/common/StatusBadge';
import { BookOpen, Calendar, Clock } from 'lucide-react';
import { getLessons } from '../../api/lessonApi';
import { formatDate } from '../../utils/formatters';

const StudentLessons = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pageResponse, setPageResponse] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);

  const fetchLessonsData = async (currentPage = page, query = searchQuery) => {
    setLoading(true);
    setError(null);
    try {
      const res = await getLessons({ page: currentPage, size: 10, sort: 'lessonDate,desc' });
      setPageResponse(res);
    } catch (e) {
      setError(e.message || 'Failed to fetch lessons.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLessonsData(page, searchQuery);
  }, [page, searchQuery]);

  const columns = [
    {
      header: 'Lesson Title',
      accessorKey: 'lessonTitle',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-900/60 text-neutral-900 dark:text-neutral-500">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <p className="font-semibold text-neutral-900 dark:text-neutral-100">{row.lessonTitle}</p>
            <p className="text-xs text-neutral-400">{row.description || 'Class Session'}</p>
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
      render: (row) => <StatusBadge status={row.status || 'COMPLETED'} />,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Lessons"
        subtitle="Catalog of completed classroom lessons and teaching sessions."
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
        <ErrorState message={error} onRetry={() => fetchLessonsData(page, searchQuery)} />
      ) : (
        <DataTable
          columns={columns}
          data={pageResponse?.content || []}
          isLoading={loading}
          emptyTitle="No Lessons Recorded"
          emptyDescription="Your teacher has not published any lesson sessions yet."
          pageResponse={pageResponse}
          onPageChange={(newPage) => setPage(newPage)}
        />
      )}
    </div>
  );
};

export default StudentLessons;
