import React, { useEffect, useState } from 'react';
import PageHeader from '../../components/layout/PageHeader';
import DataTable from '../../components/common/DataTable';
import SearchInput from '../../components/common/SearchInput';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import ErrorState from '../../components/common/ErrorState';
import StatusBadge from '../../components/common/StatusBadge';
import { Plus, Edit2, Trash2, BookOpen } from 'lucide-react';
import { getCurricula, getBoards, createCurriculum, updateCurriculum, deleteCurriculum } from '../../api/curriculumApi';

const Curricula = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pageResponse, setPageResponse] = useState(null);
  const [boards, setBoards] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCurriculum, setSelectedCurriculum] = useState(null);
  const [formData, setFormData] = useState({ boardId: '', grade: '', subject: '', description: '' });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const fetchInitialData = async () => {
    try {
      const boardsRes = await getBoards({ page: 0, size: 100 });
      setBoards(boardsRes.content || []);
    } catch (e) {
      console.error('Failed to load boards dropdown');
    }
  };

  const fetchCurriculaData = async (currentPage = page, query = searchQuery) => {
    setLoading(true);
    setError(null);
    try {
      const res = await getCurricula({ query, page: currentPage, size: 10, sort: 'grade,asc' });
      setPageResponse(res);
    } catch (e) {
      setError(e.message || 'Failed to fetch curricula from backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    fetchCurriculaData(page, searchQuery);
  }, [page, searchQuery]);

  const handleOpenModal = (curriculum = null) => {
    setSelectedCurriculum(curriculum);
    if (curriculum) {
      setFormData({
        boardId: curriculum.boardId || '',
        grade: curriculum.grade || '',
        subject: curriculum.subject || '',
        description: curriculum.description || '',
      });
    } else {
      setFormData({
        boardId: boards[0]?.id || '',
        grade: '',
        subject: '',
        description: '',
      });
    }
    setFormError('');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.boardId || !formData.grade || !formData.subject) {
      setFormError('Board, Grade, and Subject are required fields.');
      return;
    }
    setSubmitting(true);
    setFormError('');
    try {
      if (selectedCurriculum) {
        await updateCurriculum(selectedCurriculum.id, formData);
      } else {
        await createCurriculum(formData);
      }
      setIsModalOpen(false);
      fetchCurriculaData(page, searchQuery);
    } catch (e) {
      setFormError(e.message || 'Failed to save curriculum');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to deactivate this curriculum?')) {
      try {
        await deleteCurriculum(id);
        fetchCurriculaData(page, searchQuery);
      } catch (e) {
        alert(e.message || 'Failed to delete curriculum');
      }
    }
  };

  const columns = [
    {
      header: 'Grade & Subject',
      accessorKey: 'grade',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-900/60 text-neutral-800 dark:text-neutral-500">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <p className="font-semibold text-neutral-900 dark:text-neutral-100">
              {row.grade} - {row.subject}
            </p>
            <p className="text-xs text-neutral-400">Board Code: {row.boardCode || row.boardId}</p>
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
            title="Edit Curriculum"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(row.id)}
            className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            title="Deactivate Curriculum"
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
        title="Curricula Management"
        subtitle="Define grade levels and subject combinations bound to education board standards."
        action={
          <Button onClick={() => handleOpenModal()} icon={Plus}>
            Create New Curriculum
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
            placeholder="Search by grade or subject..."
          />
        </div>
      </div>

      {error ? (
        <ErrorState message={error} onRetry={() => fetchCurriculaData(page, searchQuery)} />
      ) : (
        <DataTable
          columns={columns}
          data={pageResponse?.content || []}
          isLoading={loading}
          emptyTitle="No Curricula Found"
          emptyDescription="Create grade and subject mappings under a board standard."
          emptyActionLabel="Create Curriculum"
          onEmptyAction={() => handleOpenModal()}
          pageResponse={pageResponse}
          onPageChange={(newPage) => setPage(newPage)}
        />
      )}

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedCurriculum ? 'Edit Curriculum' : 'Create New Curriculum'}
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} isLoading={submitting}>
              {selectedCurriculum ? 'Update Curriculum' : 'Create Curriculum'}
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
              Education Board *
            </label>
            <select
              value={formData.boardId}
              onChange={(e) => setFormData({ ...formData, boardId: e.target.value })}
              className="w-full px-3.5 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-700"
              required
            >
              <option value="">Select Board</option>
              {boards.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.boardName} ({b.boardCode})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Grade / Class Level *
            </label>
            <input
              type="text"
              value={formData.grade}
              onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
              placeholder="e.g. Grade 10"
              className="w-full px-3.5 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-700"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Subject Name *
            </label>
            <input
              type="text"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              placeholder="e.g. Physics / Mathematics"
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
              placeholder="Syllabus overview..."
              className="w-full px-3.5 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-700"
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Curricula;
