import React, { useEffect, useState } from 'react';
import PageHeader from '../../components/layout/PageHeader';
import DataTable from '../../components/common/DataTable';
import SearchInput from '../../components/common/SearchInput';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import ErrorState from '../../components/common/ErrorState';
import StatusBadge from '../../components/common/StatusBadge';
import { Plus, Edit2, Trash2, Bookmark } from 'lucide-react';
import { getChapters, getCurricula, createChapter, updateChapter, deleteChapter } from '../../api/curriculumApi';

const Chapters = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pageResponse, setPageResponse] = useState(null);
  const [curricula, setCurricula] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [formData, setFormData] = useState({
    curriculumId: '',
    chapterNumber: 1,
    title: '',
    description: '',
    estimatedTeachingHours: 5,
    displayOrder: 1,
  });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const fetchCurricula = async () => {
    try {
      const res = await getCurricula({ page: 0, size: 100 });
      const allowed = (res.content || []).filter((c) => {
        const gradeStr = (c.grade || '').toLowerCase();
        const subjStr = (c.subject || '').toLowerCase();
        return (
          (gradeStr.includes('9') || gradeStr.includes('10')) &&
          (subjStr.includes('math') || subjStr.includes('science') || subjStr.includes('social'))
        );
      });
      setCurricula(allowed);
    } catch (e) {
      console.error('Failed to load curricula');
    }
  };

  const fetchChaptersData = async (currentPage = page, query = searchQuery) => {
    setLoading(true);
    setError(null);
    try {
      const res = await getChapters({ query, page: currentPage, size: 10, sort: 'chapterNumber,asc' });
      setPageResponse(res);
    } catch (e) {
      setError(e.message || 'Failed to fetch chapters');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurricula();
  }, []);

  useEffect(() => {
    fetchChaptersData(page, searchQuery);
  }, [page, searchQuery]);

  const handleOpenModal = (chapter = null) => {
    setSelectedChapter(chapter);
    if (chapter) {
      setFormData({
        curriculumId: chapter.curriculumId || '',
        chapterNumber: chapter.chapterNumber || 1,
        title: chapter.title || '',
        description: chapter.description || '',
        estimatedTeachingHours: chapter.estimatedTeachingHours || 5,
        displayOrder: chapter.displayOrder || 1,
      });
    } else {
      setFormData({
        curriculumId: curricula[0]?.id || '',
        chapterNumber: 1,
        title: '',
        description: '',
        estimatedTeachingHours: 5,
        displayOrder: 1,
      });
    }
    setFormError('');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.curriculumId || !formData.title || !formData.chapterNumber) {
      setFormError('Curriculum, Chapter Number, and Title are required.');
      return;
    }
    setSubmitting(true);
    setFormError('');
    try {
      if (selectedChapter) {
        await updateChapter(selectedChapter.id, formData);
      } else {
        await createChapter(formData);
      }
      setIsModalOpen(false);
      fetchChaptersData(page, searchQuery);
    } catch (e) {
      setFormError(e.message || 'Failed to save chapter');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Deactivate this chapter?')) {
      try {
        await deleteChapter(id);
        fetchChaptersData(page, searchQuery);
      } catch (e) {
        alert(e.message || 'Failed to delete chapter');
      }
    }
  };

  const columns = [
    {
      header: 'Chapter Details',
      accessorKey: 'title',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-900/60 text-neutral-800 dark:text-neutral-500">
            <Bookmark className="w-4 h-4" />
          </div>
          <div>
            <p className="font-semibold text-neutral-900 dark:text-neutral-100">
              Chapter {row.chapterNumber}: {row.title}
            </p>
            <p className="text-xs text-neutral-400">Est. {row.estimatedTeachingHours || 0} Teaching Hours</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Description',
      accessorKey: 'description',
      render: (row) => <span className="text-neutral-600 dark:text-neutral-400 text-xs">{row.description || '—'}</span>,
    },
    {
      header: 'Status',
      accessorKey: 'active',
      render: (row) => <StatusBadge status={row.active ? 'ACTIVE' : 'INACTIVE'} />,
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
        title="Chapter Structure"
        subtitle="Organize curriculum subjects into structured sequential chapters."
        action={
          <Button onClick={() => handleOpenModal()} icon={Plus}>
            Add Chapter
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
            placeholder="Search chapters by title..."
          />
        </div>
      </div>

      {error ? (
        <ErrorState message={error} onRetry={() => fetchChaptersData(page, searchQuery)} />
      ) : (
        <DataTable
          columns={columns}
          data={pageResponse?.content || []}
          isLoading={loading}
          emptyTitle="No Chapters Found"
          emptyDescription="Add chapters to structure your curricula."
          emptyActionLabel="Add Chapter"
          onEmptyAction={() => handleOpenModal()}
          pageResponse={pageResponse}
          onPageChange={(newPage) => setPage(newPage)}
        />
      )}

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedChapter ? 'Edit Chapter' : 'Add New Chapter'}
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} isLoading={submitting}>
              {selectedChapter ? 'Update Chapter' : 'Create Chapter'}
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
              Curriculum *
            </label>
            <select
              value={formData.curriculumId}
              onChange={(e) => setFormData({ ...formData, curriculumId: e.target.value })}
              className="w-full px-3.5 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-700"
              required
            >
              <option value="">Select Curriculum</option>
              {curricula.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.grade} - {c.subject}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Chapter Number *
              </label>
              <input
                type="number"
                min="1"
                value={formData.chapterNumber}
                onChange={(e) => setFormData({ ...formData, chapterNumber: parseInt(e.target.value) || 1 })}
                className="w-full px-3.5 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-700"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Est. Hours
              </label>
              <input
                type="number"
                min="0"
                value={formData.estimatedTeachingHours}
                onChange={(e) => setFormData({ ...formData, estimatedTeachingHours: parseInt(e.target.value) || 0 })}
                className="w-full px-3.5 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-700"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Chapter Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Laws of Motion & Dynamics"
              className="w-full px-3.5 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-700"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Description
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3.5 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-700"
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Chapters;
