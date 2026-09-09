import React, { useEffect, useState } from 'react';
import PageHeader from '../../components/layout/PageHeader';
import DataTable from '../../components/common/DataTable';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import ErrorState from '../../components/common/ErrorState';
import StatusBadge from '../../components/common/StatusBadge';
import useAuth from '../../hooks/useAuth';
import { Sparkles, Send, FileCode, Clock } from 'lucide-react';
import { getHomeworkByTeacher, generateAIHomework, publishHomework } from '../../api/homeworkApi';
import { getHomeworkRecommendations } from '../../api/analysisApi';
import { formatDate } from '../../utils/formatters';

const Homework = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pageResponse, setPageResponse] = useState(null);
  const [page, setPage] = useState(0);

  // Generate AI Homework Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [recommendationsList, setRecommendationsList] = useState([]);
  const [loadingRecs, setLoadingRecs] = useState(false);
  const [recommendationId, setRecommendationId] = useState('');
  const [dueDate, setDueDate] = useState(new Date(Date.now() + 86400000 * 3).toISOString().slice(0, 19));
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const fetchHomeworkData = async (currentPage = page) => {
    setLoading(true);
    setError(null);
    try {
      const teacherId = user?.userId || '22222222-2222-2222-2222-222222222222';
      const res = await getHomeworkByTeacher(teacherId, { page: currentPage, size: 10 });
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

  useEffect(() => {
    if (isModalOpen) {
      const fetchRecs = async () => {
        setLoadingRecs(true);
        try {
          const recs = await getHomeworkRecommendations();
          const list = Array.isArray(recs) ? recs : recs?.content || [];
          setRecommendationsList(list);
          if (list.length > 0 && !recommendationId) {
            setRecommendationId(list[0].id);
          }
        } catch (e) {
          console.error('Failed to load AI recommendations:', e);
        } finally {
          setLoadingRecs(false);
        }
      };
      fetchRecs();
    }
  }, [isModalOpen]);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!recommendationId) {
      setFormError('Homework Recommendation ID is required.');
      return;
    }
    setSubmitting(true);
    setFormError('');
    try {
      await generateAIHomework({
        homeworkRecommendationId: recommendationId,
        teacherId: user?.userId || '22222222-2222-2222-2222-222222222222',
        dueDate,
      });
      setIsModalOpen(false);
      fetchHomeworkData(page);
    } catch (e) {
      setFormError(e.message || 'Failed to generate homework');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePublish = async (id) => {
    try {
      await publishHomework(id);
      fetchHomeworkData(page);
    } catch (e) {
      alert(e.message || 'Failed to publish homework');
    }
  };

  const columns = [
    {
      header: 'Homework Assignment',
      accessorKey: 'title',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-900/60 text-neutral-900 dark:text-neutral-500">
            <FileCode className="w-4 h-4" />
          </div>
          <div>
            <p className="font-semibold text-neutral-900 dark:text-neutral-100">{row.title}</p>
            <p className="text-xs text-neutral-400">Target Level: {row.targetDifficulty || 'MEDIUM'}</p>
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
      render: (row) => <StatusBadge status={row.status || 'DRAFT'} />,
    },
    {
      header: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-2">
          {row.status === 'DRAFT' && (
            <button
              onClick={() => handlePublish(row.id)}
              className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-neutral-100 text-neutral-900 hover:bg-neutral-200 dark:bg-neutral-900/60 dark:text-neutral-500 flex items-center gap-1"
            >
              <Send className="w-3.5 h-3.5" />
              Publish
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Personalized Homework Engine"
        subtitle="Generate adaptive target-difficulty homework assignments derived from AI recommendations."
        action={
          <Button onClick={() => setIsModalOpen(true)} icon={Sparkles}>
            Generate AI Homework
          </Button>
        }
      />

      {error ? (
        <ErrorState message={error} onRetry={() => fetchHomeworkData(page)} />
      ) : (
        <DataTable
          columns={columns}
          data={pageResponse?.content || []}
          isLoading={loading}
          emptyTitle="No Homework Assignments"
          emptyDescription="Generate your first AI-driven personalized homework assignment."
          emptyActionLabel="Generate Homework"
          onEmptyAction={() => setIsModalOpen(true)}
          pageResponse={pageResponse}
          onPageChange={(newPage) => setPage(newPage)}
        />
      )}

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Generate AI Homework Assignment"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button onClick={handleGenerate} isLoading={submitting} icon={Sparkles}>
              Generate Assignment
            </Button>
          </>
        }
      >
        <form onSubmit={handleGenerate} className="space-y-4">
          {formError && (
            <div className="p-3 rounded-xl bg-neutral-100 dark:bg-neutral-900/60 border border-neutral-300 dark:border-neutral-700 text-neutral-800 dark:text-neutral-400 text-xs">
              {formError}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Select AI Recommendation *
            </label>
            {loadingRecs ? (
              <p className="text-xs text-neutral-400">Loading AI Recommendations...</p>
            ) : recommendationsList.length > 0 ? (
              <select
                value={recommendationId}
                onChange={(e) => setRecommendationId(e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-700 font-medium text-neutral-900 dark:text-neutral-100"
              >
                {recommendationsList.map((rec) => (
                  <option key={rec.id} value={rec.id}>
                    [{rec.recommendedDifficulty || 'MEDIUM'}] {rec.recommendedQuestionCount || 5} Questions, {rec.recommendedPracticeMinutes || 15} mins practice (ID: {rec.id.slice(0, 8)}...)
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                value={recommendationId}
                onChange={(e) => setRecommendationId(e.target.value)}
                placeholder="e.g. c51dfa3e-3a2a-431c-a60f-d602ae09f0b3"
                className="w-full px-3.5 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-700 font-mono text-neutral-900 dark:text-neutral-100"
                required
              />
            )}
            <p className="text-[11px] text-neutral-400 mt-1">
              AI Recommendations are generated automatically when students complete assessments and request AI Learning Insights.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Submission Due Date
            </label>
            <input
              type="datetime-local"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3.5 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-700"
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Homework;
