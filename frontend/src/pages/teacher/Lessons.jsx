import React, { useEffect, useState } from "react";
import PageHeader from "../../components/layout/PageHeader";
import DataTable from "../../components/common/DataTable";
import SearchInput from "../../components/common/SearchInput";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import ErrorState from "../../components/common/ErrorState";
import StatusBadge from "../../components/common/StatusBadge";
import useAuth from "../../hooks/useAuth";
import {
  Plus,
  CheckCircle,
  XCircle,
  BookOpen,
  Clock,
  Calendar,
} from "lucide-react";
import {
  searchLessons,
  createLesson,
  completeLesson,
  cancelLesson,
} from "../../api/lessonApi";
import {
  getCurricula,
  getChaptersByCurriculum,
  getTopicsByChapter,
} from "../../api/curriculumApi";
import { formatDate } from "../../utils/formatters";

const Lessons = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pageResponse, setPageResponse] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);

  // Dropdowns for modal
  const [curricula, setCurricula] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [topics, setTopics] = useState([]);
  const [loadingChapters, setLoadingChapters] = useState(false);
  const [loadingTopics, setLoadingTopics] = useState(false);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    lessonTitle: "",
    description: "",
    teacherId: user?.userId || "22222222-2222-2222-2222-222222222222",
    schoolId: user?.schoolId || "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    sectionId: user?.sectionId || "f8e7d6c5-b4a3-2109-8765-43210fedcba9",
    curriculumId: "",
    chapterId: "",
    topicId: "",
    lessonDate: new Date().toISOString().split("T")[0],
    startTime: "09:00",
    endTime: "10:00",
    estimatedDurationMinutes: 60,
    teachingMode: "OFFLINE",
    remarks: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const fetchDropdownData = async () => {
    try {
      const cRes = await getCurricula({ page: 0, size: 100 });
      setCurricula(cRes.content || cRes || []);
    } catch (e) {
      console.error("Failed to load curricula for lessons form", e);
    }
  };

  const handleCurriculumChange = async (curriculumId) => {
    setFormData((prev) => ({
      ...prev,
      curriculumId,
      chapterId: "",
      topicId: "",
    }));
    setChapters([]);
    setTopics([]);

    if (!curriculumId) return;

    setLoadingChapters(true);
    try {
      const chRes = await getChaptersByCurriculum(curriculumId, {
        page: 0,
        size: 100,
      });
      setChapters(chRes.content || chRes || []);
    } catch (e) {
      console.error("Failed to load chapters for curriculum:", curriculumId, e);
    } finally {
      setLoadingChapters(false);
    }
  };

  const handleChapterChange = async (chapterId) => {
    setFormData((prev) => ({ ...prev, chapterId, topicId: "" }));
    setTopics([]);

    if (!chapterId) return;

    setLoadingTopics(true);
    try {
      const tRes = await getTopicsByChapter(chapterId, { page: 0, size: 100 });
      setTopics(tRes.content || tRes || []);
    } catch (e) {
      console.error("Failed to load topics for chapter:", chapterId, e);
    } finally {
      setLoadingTopics(false);
    }
  };

  const fetchLessonsData = async (currentPage = page, query = searchQuery) => {
    setLoading(true);
    setError(null);
    try {
      const res = await searchLessons({
        teacherId: user?.userId,
        query: query.trim() || undefined,
        page: currentPage,
        size: 10,
        sort: "lessonDate,desc",
      });
      setPageResponse(res);
    } catch (e) {
      setError(e.message || "Failed to fetch lesson sessions from backend.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDropdownData();
  }, []);

  useEffect(() => {
    fetchLessonsData(page, searchQuery);
  }, [page, searchQuery]);

  const handleOpenModal = () => {
    setFormData({
      lessonTitle: "",
      description: "",
      teacherId: user?.userId || "22222222-2222-2222-2222-222222222222",
      schoolId: user?.schoolId || "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      sectionId: user?.sectionId || "f8e7d6c5-b4a3-2109-8765-43210fedcba9",
      curriculumId: "",
      chapterId: "",
      topicId: "",
      lessonDate: new Date().toISOString().split("T")[0],
      startTime: "09:00",
      endTime: "10:00",
      estimatedDurationMinutes: 60,
      teachingMode: "OFFLINE",
      remarks: "",
    });
    setChapters([]);
    setTopics([]);
    setFormError("");
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.lessonTitle ||
      !formData.curriculumId ||
      !formData.chapterId ||
      !formData.topicId
    ) {
      setFormError("Title, Curriculum, Chapter, and Topic are required.");
      return;
    }
    setSubmitting(true);
    setFormError("");
    try {
      const payload = {
        ...formData,
        teacherId: user?.userId || "22222222-2222-2222-2222-222222222222",
        schoolId: user?.schoolId || "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
        sectionId: user?.sectionId || "f8e7d6c5-b4a3-2109-8765-43210fedcba9",
        description: formData.description?.trim() || null,
        remarks: formData.remarks?.trim() || null,
        teachingMode: formData.teachingMode || "OFFLINE",
        startTime:
          formData.startTime && formData.startTime.trim() !== ""
            ? formData.startTime
            : "09:00",
        endTime:
          formData.endTime && formData.endTime.trim() !== ""
            ? formData.endTime
            : "10:00",
        estimatedDurationMinutes:
          Number(formData.estimatedDurationMinutes) || 60,
      };
      await createLesson(payload);
      setIsModalOpen(false);
      fetchLessonsData(page, searchQuery);
    } catch (e) {
      setFormError(e.message || "Failed to create lesson session");
    } finally {
      setSubmitting(false);
    }
  };

  const handleComplete = async (id) => {
    try {
      await completeLesson(id);
      fetchLessonsData(page, searchQuery);
    } catch (e) {
      alert(e.message || "Failed to mark lesson complete");
    }
  };

  const handleCancel = async (id) => {
    try {
      await cancelLesson(id);
      fetchLessonsData(page, searchQuery);
    } catch (e) {
      alert(e.message || "Failed to cancel lesson session");
    }
  };

  const columns = [
    {
      header: "Lesson Session",
      accessorKey: "lessonTitle",
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-900/60 text-neutral-900 dark:text-neutral-500">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <p className="font-semibold text-neutral-900 dark:text-neutral-100">
              {row.lessonTitle}
            </p>
            <p className="text-xs text-neutral-400">
              {row.grade || "Grade 10"} • {row.subject || "Science"} —{" "}
              {row.chapterTitle || "Chapter"}
            </p>
          </div>
        </div>
      ),
    },
    {
      header: "Topic",
      accessorKey: "topicName",
      render: (row) => (
        <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
          {row.topicName || "N/A"}
        </span>
      ),
    },
    {
      header: "Date & Time",
      accessorKey: "lessonDate",
      render: (row) => (
        <div>
          <span className="text-xs text-neutral-600 dark:text-neutral-400 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-neutral-400" />
            {formatDate(row.lessonDate)}
          </span>
          <span className="text-[11px] text-neutral-400 flex items-center gap-1 mt-0.5">
            <Clock className="w-3 h-3 text-neutral-400" />
            {row.startTime || "09:00"} - {row.endTime || "10:00"}
          </span>
        </div>
      ),
    },
    {
      header: "Teaching Mode",
      accessorKey: "teachingMode",
      render: (row) => (
        <span className="text-xs px-2.5 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-800 font-medium text-neutral-700 dark:text-neutral-300">
          {row.teachingMode || "OFFLINE"}
        </span>
      ),
    },
    {
      header: "Status",
      accessorKey: "status",
      render: (row) => <StatusBadge status={row.status || "PLANNED"} />,
    },
    {
      header: "Actions",
      accessorKey: "id",
      render: (row) => (
        <div className="flex items-center gap-2">
          {row.status === "PLANNED" && (
            <>
              <button
                onClick={() => handleComplete(row.id)}
                title="Mark Completed"
                className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-colors"
              >
                <CheckCircle className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleCancel(row.id)}
                title="Cancel Session"
                className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
              >
                <XCircle className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Lesson Sessions"
        subtitle="Schedule and track classroom teaching sessions mapped to curriculum topics."
        action={
          <Button onClick={handleOpenModal} icon={Plus}>
            Schedule Lesson
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
            placeholder="Search lessons..."
          />
        </div>
      </div>

      {error ? (
        <ErrorState
          message={error}
          onRetry={() => fetchLessonsData(page, searchQuery)}
        />
      ) : (
        <DataTable
          columns={columns}
          data={pageResponse?.content || []}
          isLoading={loading}
          emptyTitle="No Lessons Scheduled"
          emptyDescription="Click Schedule Lesson to create your first teaching session."
          pageResponse={pageResponse}
          onPageChange={(newPage) => setPage(newPage)}
        />
      )}

      {/* Schedule Lesson Session Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Schedule Lesson Session"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} isLoading={submitting}>
              Create Session
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
              Lesson Title *
            </label>
            <input
              type="text"
              value={formData.lessonTitle}
              onChange={(e) =>
                setFormData({ ...formData, lessonTitle: e.target.value })
              }
              placeholder="e.g. Introduction to Newton's First Law"
              className="w-full px-3.5 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-700"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Curriculum *
            </label>
            <select
              value={formData.curriculumId}
              onChange={(e) => handleCurriculumChange(e.target.value)}
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
                Chapter *
              </label>
              <select
                value={formData.chapterId}
                onChange={(e) => handleChapterChange(e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-700 disabled:opacity-50"
                required
                disabled={!formData.curriculumId || loadingChapters}
              >
                <option value="">
                  {!formData.curriculumId
                    ? "Select Curriculum first"
                    : loadingChapters
                      ? "Loading chapters..."
                      : chapters.length === 0
                        ? "No chapters available"
                        : "Select Chapter"}
                </option>
                {chapters.map((ch) => (
                  <option key={ch.id} value={ch.id}>
                    Chapter {ch.chapterNumber}: {ch.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Topic *
              </label>
              <select
                value={formData.topicId}
                onChange={(e) =>
                  setFormData({ ...formData, topicId: e.target.value })
                }
                className="w-full px-3.5 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-700 disabled:opacity-50"
                required
                disabled={!formData.chapterId || loadingTopics}
              >
                <option value="">
                  {!formData.chapterId
                    ? "Select Chapter first"
                    : loadingTopics
                      ? "Loading topics..."
                      : topics.length === 0
                        ? "No topics available"
                        : "Select Topic"}
                </option>
                {topics.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.topicName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Lesson Date *
              </label>
              <input
                type="date"
                value={formData.lessonDate}
                onChange={(e) =>
                  setFormData({ ...formData, lessonDate: e.target.value })
                }
                className="w-full px-3.5 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-700"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Teaching Mode
              </label>
              <select
                value={formData.teachingMode}
                onChange={(e) =>
                  setFormData({ ...formData, teachingMode: e.target.value })
                }
                className="w-full px-3.5 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-700"
              >
                <option value="OFFLINE">OFFLINE (In-Person)</option>
                <option value="ONLINE">ONLINE</option>
                <option value="HYBRID">HYBRID</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Description / Notes
            </label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Session notes..."
              className="w-full px-3.5 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-700"
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Lessons;
