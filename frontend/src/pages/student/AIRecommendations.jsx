import React, { useState, useEffect } from 'react';
import PageHeader from '../../components/layout/PageHeader';
import Button from '../../components/common/Button';
import ErrorState from '../../components/common/ErrorState';
import StatusBadge from '../../components/common/StatusBadge';
import { Lightbulb, Clock, Target, ArrowRight, FileCheck } from 'lucide-react';
import { getHomeworkRecommendationByAttemptId } from '../../api/analysisApi';
import { getAttemptsByStudent } from '../../api/assessmentAttemptApi';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const StudentAIRecommendations = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const studentId = user?.userId || '33333333-3333-3333-3333-333333333333';

  const [attempts, setAttempts] = useState([]);
  const [loadingAttempts, setLoadingAttempts] = useState(true);
  const [selectedAttemptId, setSelectedAttemptId] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [recommendation, setRecommendation] = useState(null);

  useEffect(() => {
    const fetchAttempts = async () => {
      setLoadingAttempts(true);
      try {
        const res = await getAttemptsByStudent(studentId, { page: 0, size: 50 });
        const list = res?.content || res || [];
        setAttempts(list);
        if (list.length > 0) {
          setSelectedAttemptId(list[0].id);
        }
      } catch (e) {
        console.error('Failed to fetch student attempts:', e);
      } finally {
        setLoadingAttempts(false);
      }
    };
    fetchAttempts();
  }, [studentId]);

  const handleFetch = async (e) => {
    e.preventDefault();
    if (!selectedAttemptId) return;
    setLoading(true);
    setError('');
    setRecommendation(null);
    try {
      const res = await getHomeworkRecommendationByAttemptId(selectedAttemptId);
      setRecommendation(res);
    } catch (e) {
      if (e.status === 404) {
        setError('No specific practice recommendation generated yet for this quiz attempt.');
      } else {
        setError(e.message || 'Failed to fetch practice recommendation.');
      }
    } finally {
      setLoading(false);
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

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <PageHeader
        title="My AI Practice Recommendations"
        subtitle="Custom practice tasks generated based on your quiz performance."
      />

      {/* Attempt Selector */}
      <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm">
        <form onSubmit={handleFetch} className="flex flex-col sm:flex-row items-end gap-3">
          <div className="flex-1 w-full">
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5 flex items-center gap-1.5">
              <FileCheck className="w-3.5 h-3.5 text-neutral-500" />
              Select Quiz Attempt
            </label>
            {loadingAttempts ? (
              <div className="h-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
            ) : (
              <select
                value={selectedAttemptId}
                onChange={(e) => {
                  setSelectedAttemptId(e.target.value);
                  setRecommendation(null);
                  setError('');
                }}
                disabled={attempts.length === 0}
                className="w-full px-3.5 py-2.5 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 dark:text-neutral-200"
              >
                <option value="">{attempts.length === 0 ? 'No Attempts Available' : 'Select Quiz Attempt...'}</option>
                {attempts.map((att) => (
                  <option key={att.id} value={att.id}>
                    {att.assessmentTitle || 'Assessment'} • {formatDate(att.submittedAt || att.startedAt)} ({att.percentage != null ? `${Math.round(att.percentage)}%` : 'Completed'})
                  </option>
                ))}
              </select>
            )}
          </div>
          <Button
            type="submit"
            isLoading={loading}
            disabled={!selectedAttemptId}
            icon={Lightbulb}
            variant="primary"
            className="bg-indigo-600 hover:bg-indigo-700 text-white w-full sm:w-auto"
          >
            Get Recommendations
          </Button>
        </form>
      </div>

      {error && <ErrorState message={error} />}

      {recommendation && (
        <div className="p-8 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xl space-y-6 animate-in fade-in duration-300">
          <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                <Lightbulb className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-neutral-900 dark:text-neutral-100">
                  Recommended Topics: {recommendation.recommendedTopics || recommendation.recommendedTopic || 'Practice Topics'}
                </h3>
                <p className="text-xs text-neutral-400">Targeted practice designed for your learning goals</p>
              </div>
            </div>
            <StatusBadge status={recommendation.recommendedDifficulty || recommendation.difficulty || 'MEDIUM'} />
          </div>

          <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/50">
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block mb-1">
              Learning Focus
            </span>
            <p className="text-sm text-neutral-800 dark:text-neutral-200">
              {recommendation.recommendationReason || recommendation.reason || 'Practice focused on strengthening foundational skills.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 flex items-center gap-3">
              <Target className="w-5 h-5 text-indigo-500 shrink-0" />
              <div>
                <span className="text-[10px] uppercase font-bold text-neutral-400 block">Recommended Practice</span>
                <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                  {recommendation.recommendedQuestionCount || 5} Questions ({recommendation.recommendedQuestionTypes || 'Standard Practice'})
                </span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 flex items-center gap-3">
              <Clock className="w-5 h-5 text-indigo-500 shrink-0" />
              <div>
                <span className="text-[10px] uppercase font-bold text-neutral-400 block">Est. Time</span>
                <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                  {recommendation.recommendedPracticeMinutes || recommendation.estimatedTime || 15} mins
                </span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 flex justify-end">
            <Button onClick={() => navigate('/student/homework')} icon={ArrowRight} variant="primary" className="bg-indigo-600 hover:bg-indigo-700 text-white">
              Go to My Homework
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentAIRecommendations;
