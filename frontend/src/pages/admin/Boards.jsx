import React, { useEffect, useState } from 'react';
import PageHeader from '../../components/layout/PageHeader';
import DataTable from '../../components/common/DataTable';
import SearchInput from '../../components/common/SearchInput';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import ErrorState from '../../components/common/ErrorState';
import StatusBadge from '../../components/common/StatusBadge';
import { Plus, Edit2, Trash2, School } from 'lucide-react';
import { getBoards, createBoard, updateBoard, deleteBoard } from '../../api/curriculumApi';

const Boards = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pageResponse, setPageResponse] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [formData, setFormData] = useState({ boardName: '', boardCode: '', description: '' });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const fetchBoardsData = async (currentPage = page, query = searchQuery) => {
    setLoading(true);
    setError(null);
    try {
      const res = await getBoards({ query, page: currentPage, size: 10, sort: 'boardName,asc' });
      setPageResponse(res);
    } catch (e) {
      setError(e.message || 'Failed to fetch boards from backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBoardsData(page, searchQuery);
  }, [page, searchQuery]);

  const handleOpenModal = (board = null) => {
    setSelectedBoard(board);
    if (board) {
      setFormData({
        boardName: board.boardName || '',
        boardCode: board.boardCode || '',
        description: board.description || '',
      });
    } else {
      setFormData({ boardName: '', boardCode: '', description: '' });
    }
    setFormError('');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.boardName || !formData.boardCode) {
      setFormError('Board Name and Board Code are required fields.');
      return;
    }
    setSubmitting(true);
    setFormError('');
    try {
      if (selectedBoard) {
        await updateBoard(selectedBoard.id, formData);
      } else {
        await createBoard(formData);
      }
      setIsModalOpen(false);
      fetchBoardsData(page, searchQuery);
    } catch (e) {
      setFormError(e.message || 'Failed to save board');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to deactivate this board?')) {
      try {
        await deleteBoard(id);
        fetchBoardsData(page, searchQuery);
      } catch (e) {
        alert(e.message || 'Failed to delete board');
      }
    }
  };

  const columns = [
    {
      header: 'Board Name',
      accessorKey: 'boardName',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-900/60 text-neutral-900 dark:text-neutral-500">
            <School className="w-4 h-4" />
          </div>
          <div>
            <p className="font-semibold text-neutral-900 dark:text-neutral-100">{row.boardName}</p>
            <p className="text-xs text-neutral-400 font-mono">Code: {row.boardCode}</p>
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
            title="Edit Board"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(row.id)}
            className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            title="Deactivate Board"
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
        title="Education Boards"
        subtitle="Manage national and international educational board standards (e.g., CBSE, ICSE, IB, Cambridge)."
        action={
          <Button onClick={() => handleOpenModal()} icon={Plus}>
            Create New Board
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
            placeholder="Search boards by name or code..."
          />
        </div>
      </div>

      {error ? (
        <ErrorState message={error} onRetry={() => fetchBoardsData(page, searchQuery)} />
      ) : (
        <DataTable
          columns={columns}
          data={pageResponse?.content || []}
          isLoading={loading}
          emptyTitle="No Education Boards Found"
          emptyDescription="Create your first educational board standard to begin constructing curricula."
          emptyActionLabel="Create Board"
          onEmptyAction={() => handleOpenModal()}
          pageResponse={pageResponse}
          onPageChange={(newPage) => setPage(newPage)}
        />
      )}

      {/* Create / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedBoard ? 'Edit Education Board' : 'Create New Education Board'}
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} isLoading={submitting}>
              {selectedBoard ? 'Update Board' : 'Create Board'}
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
              Board Name *
            </label>
            <input
              type="text"
              value={formData.boardName}
              onChange={(e) => setFormData({ ...formData, boardName: e.target.value })}
              placeholder="e.g. Central Board of Secondary Education"
              className="w-full px-3.5 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-700"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Board Code *
            </label>
            <input
              type="text"
              value={formData.boardCode}
              onChange={(e) => setFormData({ ...formData, boardCode: e.target.value })}
              placeholder="e.g. CBSE"
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
              placeholder="Brief description of board guidelines..."
              className="w-full px-3.5 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-700"
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Boards;
