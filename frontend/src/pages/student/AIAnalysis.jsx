import React, { useState, useEffect } from 'react';
import PageHeader from '../../components/layout/PageHeader';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorState from '../../components/common/ErrorState';
import { Sparkles, Brain, CheckCircle2, AlertTriangle, Lightbulb, FileCheck } from 'lucide-react';
import { getAIAnalysisByAttemptId } from '../../api/analysisApi';
import { getAttemptsByStudent } from '../../api/assessmentAttemptApi';
import useAuth from '../../hooks/useAuth';

const parseConcepts = (data) => {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (typeof data === 'string') {
    try {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) return parsed;
    } catch (e) {
      return data.split(',').map((s) => s.trim()).filter(Boolean);
    }
  }
  return [];
};

const StudentAIAnalysis = () => {
  const { user } = useAuth();
  const studentId = user?.userId || '33333333-3333-3333-3333-333333333333';

  const [attempts, setAttempts] = useState([]);
  const [loadingAttempts, setLoadingAttempts] = useState(true);
  const [selectedAttemptId, setSelectedAttemptId] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [analysis, setAnalysis] = useState(null);

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
        console.error('Failed to load student attempts:', e);
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
    setAnalysis(null);
    try {
      const res = await getAIAnalysisByAttemptId(selectedAttemptId);
      setAnalysis(res);
    } catch (e) {
      if (e.status === 404) {
        setError('No AI Diagnostic generated yet for this attempt. Your teacher will generate insights after review.');
      } else {
        setError(e.message || 'Unable to retrieve AI analysis.');
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

  const strongList = parseConcepts(analysis?.strongConcepts || analysis?.learningStrengths);
  const weakList = parseConcepts(analysis?.weakConcepts || analysis?.weakAreas);

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <PageHeader
        title="My AI Learning Diagnostic"
        subtitle="Inspect Gemini AI evaluation notes and concept mastery feedback for your quiz attempts."
      />

      {/* Selector Card */}
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
                  setAnalysis(null);
                  setError('');
                }}
                disabled={attempts.length === 0}
                className="w-full px-3.5 py-2.5 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 dark:text-neutral-200"
              >
                <option value="">{attempts.length === 0 ? 'No Quiz Attempts Available' : 'Select Quiz Attempt...'}</option>
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
            icon={Sparkles}
            variant="primary"
            className="bg-indigo-600 hover:bg-indigo-700 text-white w-full sm:w-auto"
          >
            Fetch Diagnostic
          </Button>
        </form>
      </div>

      {error && <ErrorState message={error} />}

      {analysis && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="p-6 sm:p-8 rounded-2xl bg-neutral-900 dark:bg-neutral-950 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 border border-neutral-800">
            <div className="space-y-2">
              <span className="text-xs uppercase font-bold tracking-widest text-indigo-400 block">
                Gemini AI Summary
              </span>
              <h2 className="text-xl font-bold text-white">
                {analysis.assessmentTitle || 'Assessment Master Diagnostics'}
              </h2>
              <p className="text-sm text-neutral-300 leading-relaxed max-w-xl font-medium">
                {analysis.analysisSummary || analysis.summaryNotes || 'Evaluation of quiz performance.'}
              </p>
            </div>
            <div className="text-center p-5 rounded-2xl bg-white/10 backdrop-blur-md shrink-0 border border-white/10 min-w-[140px]">
              <span className="text-[10px] uppercase font-bold text-indigo-300 block mb-1">Mastery Score</span>
              <span className="text-3xl font-extrabold">{Math.round(analysis.overallMasteryPercentage || 0)}%</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5" />
                <span>What You Did Well</span>
              </div>
              {strongList.length > 0 ? (
                <ul className="space-y-2 text-xs text-neutral-700 dark:text-neutral-300 font-medium">
                  {strongList.map((s, idx) => (
                    <li key={idx} className="p-2.5 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/40 dark:border-emerald-900/30 flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-neutral-400">No specific strengths highlighted.</p>
              )}
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-sm">
                <AlertTriangle className="w-5 h-5" />
                <span>Topics to Review</span>
              </div>
              {weakList.length > 0 ? (
                <ul className="space-y-2 text-xs text-neutral-700 dark:text-neutral-300 font-medium">
                  {weakList.map((w, idx) => (
                    <li key={idx} className="p-2.5 rounded-lg bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/40 dark:border-amber-900/30 flex items-center gap-2">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span>{w}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-neutral-400">No weak areas identified.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentAIAnalysis;
