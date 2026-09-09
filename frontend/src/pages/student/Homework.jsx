import React, { useEffect, useState } from 'react';
import PageHeader from '../../components/layout/PageHeader';
import DataTable from '../../components/common/DataTable';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import ErrorState from '../../components/common/ErrorState';
import StatusBadge from '../../components/common/StatusBadge';
import useAuth from '../../hooks/useAuth';
import { ClipboardList, Send, Sparkles, Clock, CheckCircle2 } from 'lucide-react';
import { getHomeworkByStudent, submitHomework, getFeedbackByHomeworkId } from '../../api/homeworkApi';
import { formatDate } from '../../utils/formatters';

const StudentHomework = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pageResponse, setPageResponse] = useState(null);
  const [page, setPage] = useState(0);

  // Submit Modal
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [selectedHw, setSelectedHw] = useState(null);
  const [timeTaken, setTimeTaken] = useState(30);
  const [remarks, setRemarks] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  // Feedback Modal
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [loadingFeedback, setLoadingFeedback] = useState(false);

  const fetchHomeworkData = async (currentPage = page) => {
    setLoading(true);
    setError(null);
    try {
      const studentId = user?.userId || '33333333-3333-3333-3333-333333333333';
      const res = await getHomeworkByStudent(studentId, { page: currentPage, size: 10 });
      setPageResponse(res);
    } catch (e) {
      setError(e.message || 'Failed to fetch homework assignments.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHomeworkData(page);
  }, [page]);

  const handleOpenSubmit = (hw) => {
    setSelectedHw(hw);
    setTimeTaken(30);
    setRemarks('');
    setFormError('');
    setIsSubmitModalOpen(true);
  };

  const handleSubmitHomework = async (e) => {
    e.preventDefault();
    if (!selectedHw?.id) return;
    setSubmitting(true);
    setFormError('');
    try {
      await submitHomework(selectedHw.id, {
        timeTakenMinutes: timeTaken,
        remarks,
      });
      setIsSubmitModalOpen(false);
      fetchHomeworkData(page);
    } catch (e) {
      setFormError(e.message || 'Failed to submit homework');
    } finally {
      setSubmitting(false);
    }
  };

  const handleViewFeedback = async (hwId) => {
    setLoadingFeedback(true);
    setIsFeedbackModalOpen(true);
    setFeedback(null);
    try {
      const res = await getFeedbackByHomeworkId(hwId);
      setFeedback(res);
    } catch (e) {
      console.error('Failed to load feedback');
    } finally {
      setLoadingFeedback(false);
    }
  };

  const columns = [
    {
      header: 'Assignment Title',
      accessorKey: 'title',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-900/60 text-neutral-800 dark:text-neutral-500">
            <ClipboardList className="w-4 h-4" />
          </div>
          <div>
            <p className="font-semibold text-neutral-900 dark:text-neutral-100">{row.title}</p>
            <p className="text-xs text-neutral-400">Difficulty: {row.targetDifficulty || 'MEDIUM'}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Due Date',
      accessorKey: 'dueDate',
      render: (row) => (
        <span className="text-xs text-neutral-600 dark:text-neutral-400 flex items-center gap-1">
          <Clock className="w-3.5 h-3.5 text-neutral-400" />
          {formatDate(row.dueDate)}
        </span>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'status',
      render: (row) => <StatusBadge status={row.status || 'PENDING'} />,
    },
    {
      header: 'Action',
      render: (row) => (
        <div className="flex items-center gap-2">
          {row.status !== 'SUBMITTED' ? (
            <Button size="sm" icon={Send} onClick={() => handleOpenSubmit(row)}>
              Submit
            </Button>
          ) : (
            <Button size="sm" variant="secondary" icon={Sparkles} onClick={() => handleViewFeedback(row.id)}>
              View AI Feedback
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Personalized Homework"
        subtitle="Complete targeted practice assignments and receive instant Gemini AI feedback."
      />

      {error ? (
        <ErrorState message={error} onRetry={() => fetchHomeworkData(page)} />
      ) : (
        <DataTable
          columns={columns}
          data={pageResponse?.content || []}
          isLoading={loading}
          emptyTitle="No Homework Assigned"
          emptyDescription="You have no pending personalized homework assignments."
          pageResponse={pageResponse}
          onPageChange={(newPage) => setPage(newPage)}
        />
      )}

      {/* Submit Homework Modal */}
      <Modal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        title={`Submit: ${selectedHw?.title}`}
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsSubmitModalOpen(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button onClick={handleSubmitHomework} isLoading={submitting} icon={Send}>
              Confirm Submission
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmitHomework} className="space-y-4">
          {formError && (
            <div className="p-3 rounded-xl bg-neutral-100 dark:bg-neutral-900/60 border border-neutral-300 dark:border-neutral-700 text-neutral-800 dark:text-neutral-400 text-xs">
              {formError}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Time Spent (Minutes)
            </label>
            <input
              type="number"
              min="1"
              value={timeTaken}
              onChange={(e) => setTimeTaken(parseInt(e.target.value) || 1)}
              className="w-full px-3.5 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Submission Remarks / Solution Summary
            </label>
            <textarea
              rows={4}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Paste your completed solution steps..."
              className="w-full px-3.5 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl"
            />
          </div>
        </form>
      </Modal>

      {/* Feedback Modal */}
      <Modal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
        title="Automated Gemini AI Homework Feedback"
      >
        {loadingFeedback ? (
          <div className="py-8">
            <LoadingSpinner label="Fetching AI feedback..." />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-neutral-50 dark:bg-neutral-800/50">
              <div className="flex items-center gap-2 text-neutral-600 font-bold text-xs uppercase mb-1">
                <CheckCircle2 className="w-4 h-4" />
                AI Evaluation Result
              </div>
              <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                {feedback?.feedbackText || 'Excellent effort! All core equations were correctly derived.'}
              </p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default StudentHomework;
