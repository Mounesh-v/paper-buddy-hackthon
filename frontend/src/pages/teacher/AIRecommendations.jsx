import React, { useState, useEffect } from 'react';
import PageHeader from '../../components/layout/PageHeader';
import Button from '../../components/common/Button';
import ErrorState from '../../components/common/ErrorState';
import StatusBadge from '../../components/common/StatusBadge';
import { BrainCircuit, Lightbulb, Clock, Target, ArrowRight, User, FileCheck, Sparkles, CheckCircle2 } from 'lucide-react';
import { getHomeworkRecommendationByAttemptId } from '../../api/analysisApi';
import { getStudents } from '../../api/studentApi';
import { getAttemptsByStudent } from '../../api/assessmentAttemptApi';
import { generateAIHomework } from '../../api/homeworkApi';
import useAuth from '../../hooks/useAuth';

const AIRecommendations = () => {
  const { user } = useAuth();
  
  const [students, setStudents] = useState([]);
  const [attempts, setAttempts] = useState([]);

  const [loadingStudents, setLoadingStudents] = useState(true);
  const [loadingAttempts, setLoadingAttempts] = useState(false);

  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [selectedAttemptId, setSelectedAttemptId] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [recommendation, setRecommendation] = useState(null);

  const [generatingHomework, setGeneratingHomework] = useState(false);
  const [homeworkSuccessMsg, setHomeworkSuccessMsg] = useState('');

  // Fetch students on mount
  useEffect(() => {
    const loadStudents = async () => {
      setLoadingStudents(true);
      try {
        const list = await getStudents();
        setStudents(list || []);
      } catch (e) {
        console.error('Failed to load students:', e);
      } finally {
        setLoadingStudents(false);
      }
    };
    loadStudents();
  }, []);

  // Fetch attempts when student changes
  useEffect(() => {
    if (!selectedStudentId) {
      setAttempts([]);
      setSelectedAttemptId('');
      setRecommendation(null);
      return;
    }

    const fetchAttempts = async () => {
      setLoadingAttempts(true);
      setError('');
      try {
        const res = await getAttemptsByStudent(selectedStudentId, { page: 0, size: 50 });
        setAttempts(res?.content || res || []);
      } catch (e) {
        console.error('Failed to fetch attempts:', e);
        setError('Failed to fetch student attempts.');
      } finally {
        setLoadingAttempts(false);
      }
    };
    fetchAttempts();
  }, [selectedStudentId]);

  const handleStudentChange = (e) => {
    setSelectedStudentId(e.target.value);
    setSelectedAttemptId('');
    setRecommendation(null);
    setError('');
  };

  const handleAttemptChange = (e) => {
    setSelectedAttemptId(e.target.value);
    setRecommendation(null);
    setError('');
  };

  const handleFetchRecommendation = async (e) => {
    e.preventDefault();
    if (!selectedAttemptId) return;
    setLoading(true);
    setError('');
    setRecommendation(null);
    setHomeworkSuccessMsg('');
    try {
      const res = await getHomeworkRecommendationByAttemptId(selectedAttemptId);
      setRecommendation(res);
    } catch (e) {
      if (e.status === 404) {
        setError('No recommendation found for this attempt. Generate an AI Learning Analysis first.');
      } else {
        setError(e.message || 'Failed to retrieve homework recommendation.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreateHomework = async () => {
    if (!recommendation?.id) return;
    setGeneratingHomework(true);
    setHomeworkSuccessMsg('');
    try {
      const teacherId = user?.userId || '22222222-2222-2222-2222-222222222222';
      await generateAIHomework({
        homeworkRecommendationId: recommendation.id,
        teacherId,
      });
      setHomeworkSuccessMsg('Personalized AI Homework Assignment generated successfully!');
    } catch (e) {
      alert(e.message || 'Failed to create homework from recommendation.');
    } finally {
      setGeneratingHomework(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch (e) {
      return dateStr;
    }
  };

  const currentStudent = students.find((s) => s.id === selectedStudentId);

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <PageHeader
        title="AI Homework Recommendations"
        subtitle="Retrieve target-difficulty practice recommendations generated from student mastery gaps."
      />

      {/* Human Readable Selection Form */}
      <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4">
        <form onSubmit={handleFetchRecommendation} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Student Selector */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-neutral-500" />
                Student
              </label>
              {loadingStudents ? (
                <div className="h-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
              ) : (
                <select
                  value={selectedStudentId}
                  onChange={handleStudentChange}
                  className="w-full px-3.5 py-2.5 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-neutral-200"
                >
                  <option value="">Select Student...</option>
                  {students.map((stu) => (
                    <option key={stu.id} value={stu.id}>
                      {stu.name} ({stu.gradeSection || 'Student'})
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Attempt Selector */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5 flex items-center gap-1.5">
                <FileCheck className="w-3.5 h-3.5 text-neutral-500" />
                Assessment Attempt
              </label>
              {loadingAttempts ? (
                <div className="h-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
              ) : (
                <select
                  value={selectedAttemptId}
                  onChange={handleAttemptChange}
                  disabled={!selectedStudentId || attempts.length === 0}
                  className="w-full px-3.5 py-2.5 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 dark:text-neutral-200"
                >
                  <option value="">
                    {!selectedStudentId
                      ? 'Select Student First'
                      : attempts.length === 0
                      ? 'No Attempts Found'
                      : 'Select Attempt...'}
                  </option>
                  {attempts.map((att) => (
                    <option key={att.id} value={att.id}>
                      {att.assessmentTitle || 'Assessment'} • {formatDate(att.submittedAt || att.startedAt)} ({att.percentage != null ? `${Math.round(att.percentage)}%` : 'Completed'})
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              isLoading={loading}
              disabled={!selectedAttemptId}
              icon={BrainCircuit}
              variant="primary"
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              Get Recommendation
            </Button>
          </div>
        </form>
      </div>

      {error && <ErrorState message={error} />}

      {recommendation && (
        <div className="p-8 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xl space-y-6 animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-neutral-100 dark:border-neutral-800 gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                <Lightbulb className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                  Recommended Topics: {recommendation.recommendedTopics || recommendation.recommendedTopic || 'Curriculum Concepts'}
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Student: {currentStudent?.name || 'Selected Student'}
                </p>
              </div>
            </div>
            <StatusBadge status={recommendation.recommendedDifficulty || recommendation.difficulty || 'MEDIUM'} />
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/50">
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block mb-1">
                Pedagogical Rationale
              </span>
              <p className="text-sm text-neutral-800 dark:text-neutral-200">
                {recommendation.recommendationReason || recommendation.reason || 'Student demonstrated key mastery gaps that require targeted practice.'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 flex items-center gap-3">
                <Target className="w-5 h-5 text-indigo-500 shrink-0" />
                <div>
                  <span className="text-[10px] uppercase font-bold text-neutral-400 block">Recommended Questions</span>
                  <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                    {recommendation.recommendedQuestionCount || 5} Questions ({recommendation.recommendedQuestionTypes || 'Objective & Conceptual'})
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 flex items-center gap-3">
                <Clock className="w-5 h-5 text-indigo-500 shrink-0" />
                <div>
                  <span className="text-[10px] uppercase font-bold text-neutral-400 block">Est. Practice Time</span>
                  <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                    {recommendation.recommendedPracticeMinutes || recommendation.estimatedTime || 15} mins
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-neutral-500">
              {homeworkSuccessMsg ? (
                <span className="text-emerald-600 font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  {homeworkSuccessMsg}
                </span>
              ) : (
                <span>Generate a homework assignment directly from this recommendation.</span>
              )}
            </div>

            <Button
              onClick={handleCreateHomework}
              isLoading={generatingHomework}
              disabled={generatingHomework}
              icon={Sparkles}
              variant="primary"
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              Generate AI Homework
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIRecommendations;
