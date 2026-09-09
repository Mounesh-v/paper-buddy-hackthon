import React, { useEffect, useState } from 'react';
import PageHeader from '../../components/layout/PageHeader';
import DataTable from '../../components/common/DataTable';
import SearchInput from '../../components/common/SearchInput';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import ErrorState from '../../components/common/ErrorState';
import StatusBadge from '../../components/common/StatusBadge';
import { Plus, Edit2, Trash2, Layers } from 'lucide-react';
import { getTopics, getChapters, createTopic, updateTopic, deleteTopic } from '../../api/curriculumApi';

const Topics = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pageResponse, setPageResponse] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [formData, setFormData] = useState({
    chapterId: '',
    topicName: '',
    learningObjectives: '',
    keywords: '',
    estimatedTeachingMinutes: 45,
    difficultyLevel: 'MEDIUM',
    displayOrder: 1,
  });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const fetchChapters = async () => {
    try {
      const cRes = await getCurricula({ page: 0, size: 100 });
      const allowedCurriculaIds = (cRes.content || [])
        .filter((c) => {
          const gradeStr = (c.grade || '').toLowerCase();
          const subjStr = (c.subject || '').toLowerCase();
          return (
            (gradeStr.includes('9') || gradeStr.includes('10')) &&
            (subjStr.includes('math') || subjStr.includes('science') || subjStr.includes('social'))
          );
        })
        .map((c) => c.id);

      const res = await getChapters({ page: 0, size: 100 });
      const filtered = (res.content || []).filter((ch) => allowedCurriculaIds.includes(ch.curriculumId));
      setChapters(filtered);
    } catch (e) {
      console.error('Failed to load chapters dropdown');
    }
  };

  const fetchTopicsData = async (currentPage = page, query = searchQuery) => {
    setLoading(true);
    setError(null);
    try {
      const res = await getTopics({ query, page: currentPage, size: 10, sort: 'displayOrder,asc' });
      setPageResponse(res);
    } catch (e) {
      setError(e.message || 'Failed to fetch topics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChapters();
  }, []);

  useEffect(() => {
    fetchTopicsData(page, searchQuery);
  }, [page, searchQuery]);

  const handleOpenModal = (topic = null) => {
    setSelectedTopic(topic);
    if (topic) {
      setFormData({
        chapterId: topic.chapterId || '',
        topicName: topic.topicName || '',
        learningObjectives: topic.learningObjectives || '',
        keywords: topic.keywords || '',
        estimatedTeachingMinutes: topic.estimatedTeachingMinutes || 45,
        difficultyLevel: topic.difficultyLevel || 'MEDIUM',
        displayOrder: topic.displayOrder || 1,
      });
    } else {
      setFormData({
        chapterId: chapters[0]?.id || '',
        topicName: '',
        learningObjectives: '',
        keywords: '',
        estimatedTeachingMinutes: 45,
        difficultyLevel: 'MEDIUM',
        displayOrder: 1,
      });
    }
    setFormError('');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.chapterId || !formData.topicName) {
      setFormError('Chapter and Topic Name are required.');
      return;
    }
    setSubmitting(true);
    setFormError('');
    try {
      if (selectedTopic) {
        await updateTopic(selectedTopic.id, formData);
      } else {
        await createTopic(formData);
      }
      setIsModalOpen(false);
      fetchTopicsData(page, searchQuery);
    } catch (e) {
      setFormError(e.message || 'Failed to save topic');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Deactivate this topic?')) {
      try {
        await deleteTopic(id);
        fetchTopicsData(page, searchQuery);
      } catch (e) {
        alert(e.message || 'Failed to delete topic');
      }
    }
  };

  const columns = [
    {
      header: 'Topic Name',
      accessorKey: 'topicName',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-900/60 text-neutral-900 dark:text-neutral-500">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <p className="font-semibold text-neutral-900 dark:text-neutral-100">{row.topicName}</p>
            <p className="text-xs text-neutral-400">Est. {row.estimatedTeachingMinutes || 0} mins</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Difficulty',
      accessorKey: 'difficultyLevel',
      render: (row) => <StatusBadge status={row.difficultyLevel || 'MEDIUM'} />,
    },
    {
      header: 'Learning Objectives',
      accessorKey: 'learningObjectives',
      render: (row) => (
        <span className="text-neutral-600 dark:text-neutral-400 text-xs line-clamp-1">
          {row.learningObjectives || '—'}
        </span>
      ),
    },
    {
      header: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleOpenModal(row)}
            className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(row.id)}
            className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800"
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
        title="Topic Modules"
        subtitle="Detailed learning concepts and mastery topics under chapters."
        action={
          <Button onClick={() => handleOpenModal()} icon={Plus}>
            Add Topic
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
            placeholder="Search topics..."
          />
        </div>
      </div>

      {error ? (
        <ErrorState message={error} onRetry={() => fetchTopicsData(page, searchQuery)} />
      ) : (
        <DataTable
          columns={columns}
          data={pageResponse?.content || []}
          isLoading={loading}
          emptyTitle="No Topics Found"
          emptyDescription="Add granular topics to measure concept mastery."
          emptyActionLabel="Add Topic"
          onEmptyAction={() => handleOpenModal()}
          pageResponse={pageResponse}
          onPageChange={(newPage) => setPage(newPage)}
        />
      )}

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedTopic ? 'Edit Topic' : 'Add New Topic'}
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} isLoading={submitting}>
              {selectedTopic ? 'Update Topic' : 'Create Topic'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {formError && (
            <div className="p-3 rounded-xl bg-neutral-100 dark:bg-neutral-900/60 border border-neutral-300 dark:border-neutral-700 text-neutral-800 dark:text-neutral-400 text-xs">
              {formError}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Chapter *
            </label>
            <select
              value={formData.chapterId}
              onChange={(e) => setFormData({ ...formData, chapterId: e.target.value })}
              className="w-full px-3.5 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-700"
              required
            >
              <option value="">Select Chapter</option>
              {chapters.map((ch) => (
                <option key={ch.id} value={ch.id}>
                  Ch. {ch.chapterNumber}: {ch.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Topic Name *
            </label>
            <input
              type="text"
              value={formData.topicName}
              onChange={(e) => setFormData({ ...formData, topicName: e.target.value })}
              placeholder="e.g. Newton's Second Law of Motion"
              className="w-full px-3.5 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-700"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Difficulty Level
              </label>
              <select
                value={formData.difficultyLevel}
                onChange={(e) => setFormData({ ...formData, difficultyLevel: e.target.value })}
                className="w-full px-3.5 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-700"
              >
                <option value="EASY">EASY</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HARD">HARD</option>
                <option value="VERY_HARD">VERY_HARD</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Est. Minutes
              </label>
              <input
                type="number"
                min="0"
                value={formData.estimatedTeachingMinutes}
                onChange={(e) => setFormData({ ...formData, estimatedTeachingMinutes: parseInt(e.target.value) || 0 })}
                className="w-full px-3.5 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-700"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Learning Objectives
            </label>
            <textarea
              rows={2}
              value={formData.learningObjectives}
              onChange={(e) => setFormData({ ...formData, learningObjectives: e.target.value })}
              placeholder="What students will understand..."
              className="w-full px-3.5 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-700"
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Topics;
