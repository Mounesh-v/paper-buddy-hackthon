import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/layout/PageHeader';
import DataTable from '../../components/common/DataTable';
import SearchInput from '../../components/common/SearchInput';
import Button from '../../components/common/Button';
import ErrorState from '../../components/common/ErrorState';
import StatusBadge from '../../components/common/StatusBadge';
import { Plus, Send, XCircle, Trash2, FileCheck, Clock } from 'lucide-react';
import { getAssessments, publishAssessment, closeAssessment, cancelAssessment, deleteAssessment } from '../../api/assessmentApi';
import { formatDate } from '../../utils/formatters';

const Assessments = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pageResponse, setPageResponse] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);

  const fetchAssessmentsData = async (currentPage = page, query = searchQuery) => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAssessments({ page: currentPage, size: 10, sort: 'createdAt,desc' });
      setPageResponse(res);
    } catch (e) {
      setError(e.message || 'Failed to fetch assessments from backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssessmentsData(page, searchQuery);
  }, [page, searchQuery]);

  const handlePublish = async (id) => {
    try {
      await publishAssessment(id);
      fetchAssessmentsData(page, searchQuery);
    } catch (e) {
      alert(e.message || 'Failed to publish assessment');
    }
  };

  const handleClose = async (id) => {
    try {
      await closeAssessment(id);
      fetchAssessmentsData(page, searchQuery);
    } catch (e) {
      alert(e.message || 'Failed to close assessment');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this assessment?')) {
      try {
        await deleteAssessment(id);
        fetchAssessmentsData(page, searchQuery);
      } catch (e) {
        alert(e.message || 'Failed to delete assessment');
      }
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
      header: 'Passing Marks',
      accessorKey: 'passingMarks',
      render: (row) => <span className="text-xs font-semibold">{row.passingMarks ?? '—'}</span>,
    },
    {
      header: 'Status',
      accessorKey: 'status',
      render: (row) => <StatusBadge status={row.status || 'DRAFT'} />,
    },
    {
      header: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-2">
          {row.status === 'DRAFT' && (
            <button
              onClick={() => handlePublish(row.id)}
              className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-neutral-100 text-neutral-900 hover:bg-neutral-200 dark:bg-neutral-900/60 dark:text-neutral-500 transition-colors flex items-center gap-1"
              title="Publish Assessment"
            >
              <Send className="w-3.5 h-3.5" />
              Publish
            </button>
          )}
          {row.status === 'PUBLISHED' && (
            <button
              onClick={() => handleClose(row.id)}
              className="px-2 py-1 rounded-lg text-xs font-medium bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
            >
              Close
            </button>
          )}
          <button
            onClick={() => handleDelete(row.id)}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-900/40"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Assessment Engine"
        subtitle="Author assessments for completed lessons, add questions, and publish tests for student attempts."
        action={
          <Button onClick={() => navigate('/teacher/assessments/create')} icon={Plus}>
            Create Assessment
          </Button>
        }
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
        <ErrorState message={error} onRetry={() => fetchAssessmentsData(page, searchQuery)} />
      ) : (
        <DataTable
          columns={columns}
          data={pageResponse?.content || []}
          isLoading={loading}
          emptyTitle="No Assessments Found"
          emptyDescription="Create an assessment for your completed lesson sessions."
          emptyActionLabel="Create Assessment"
          onEmptyAction={() => navigate('/teacher/assessments/create')}
          pageResponse={pageResponse}
          onPageChange={(newPage) => setPage(newPage)}
        />
      )}
    </div>
  );
};

export default Assessments;
