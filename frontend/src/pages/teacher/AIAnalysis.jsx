import React, { useState, useEffect } from 'react';
import PageHeader from '../../components/layout/PageHeader';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorState from '../../components/common/ErrorState';
import StatusBadge from '../../components/common/StatusBadge';
import Modal from '../../components/common/Modal';
import {
  Sparkles,
  Brain,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Target,
  User,
  BookOpen,
  FileCheck,
  Calendar,
  TrendingUp,
  Clock,
  ArrowRight,
  RotateCcw,
  Award,
  Layers
} from 'lucide-react';
import { generateAIAnalysis, getAIAnalysisByAttemptId } from '../../api/analysisApi';
import { getStudents } from '../../api/studentApi';
import { getAssessments } from '../../api/assessmentApi';
import { getAttemptsByStudent } from '../../api/assessmentAttemptApi';
import { generateAIHomework } from '../../api/homeworkApi';
import useAuth from '../../hooks/useAuth';

// Helper parser for JSON stringified lists from backend
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

const TeacherAIAnalysis = () => {
  const { user } = useAuth();

  // Master Data & Dropdown options
  const [students, setStudents] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [assessments, setAssessments] = useState([]);

  // Loading States for Pickers
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [loadingAttempts, setLoadingAttempts] = useState(false);

  // Cascading Selection State (No UUIDs shown in UI)
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [selectedAssessmentId, setSelectedAssessmentId] = useState('');
  const [selectedAttemptId, setSelectedAttemptId] = useState('');

  // Result & AI Generation State
  const [loading, setLoading] = useState(false);
  const [fetchingExisting, setFetchingExisting] = useState(false);
  const [error, setError] = useState('');
  const [analysis, setAnalysis] = useState(null);

  // Homework Modal State
  const [homeworkModalOpen, setHomeworkModalOpen] = useState(false);
  const [generatingHomework, setGeneratingHomework] = useState(false);
  const [homeworkSuccessMessage, setHomeworkSuccessMessage] = useState('');

  // Initial Load: Fetch Students list
  useEffect(() => {
    const loadMasterData = async () => {
      setLoadingStudents(true);
      try {
        const studentList = await getStudents();
        setStudents(studentList || []);
      } catch (e) {
        console.error('Failed to load students:', e);
      } finally {
        setLoadingStudents(false);
      }
    };
    loadMasterData();
  }, []);

  // When Student is selected, fetch attempt history for that student
  useEffect(() => {
    if (!selectedStudentId) {
      setAttempts([]);
      setAssessments([]);
      setSelectedAssessmentId('');
      setSelectedAttemptId('');
      setAnalysis(null);
      return;
    }

    const fetchStudentAttempts = async () => {
      setLoadingAttempts(true);
      setError('');
      try {
        const res = await getAttemptsByStudent(selectedStudentId, { page: 0, size: 50 });
        const attemptList = res?.content || res || [];
        setAttempts(attemptList);

        // Deduplicate assessments from student attempts
        const assessmentMap = new Map();
        attemptList.forEach((att) => {
          if (att.assessmentId && att.assessmentTitle) {
            assessmentMap.set(att.assessmentId, {
              id: att.assessmentId,
              title: att.assessmentTitle,
            });
          }
        });

        // Also fetch active assessments if list is short
        if (assessmentMap.size === 0) {
          const allAssessmentsRes = await getAssessments({ page: 0, size: 50 });
          const allList = allAssessmentsRes?.content || allAssessmentsRes || [];
          allList.forEach((a) => assessmentMap.set(a.id, { id: a.id, title: a.title }));
        }

        setAssessments(Array.from(assessmentMap.values()));
      } catch (e) {
        console.error('Failed to fetch student attempts:', e);
        setError('Failed to fetch assessment attempt history for selected student.');
      } finally {
        setLoadingAttempts(false);
      }
    };

    fetchStudentAttempts();
  }, [selectedStudentId]);

  // Handle Student Change (Cascading Reset)
  const handleStudentChange = (e) => {
    setSelectedStudentId(e.target.value);
    setSelectedAssessmentId('');
    setSelectedAttemptId('');
    setAnalysis(null);
    setError('');
  };

  // Handle Assessment Change (Cascading Reset)
  const handleAssessmentChange = (e) => {
    setSelectedAssessmentId(e.target.value);
    setSelectedAttemptId('');
    setAnalysis(null);
    setError('');
  };

  // Handle Attempt Change
  const handleAttemptChange = (e) => {
    setSelectedAttemptId(e.target.value);
    setAnalysis(null);
    setError('');
  };

  // Filter attempts matching selected student & assessment
  const filteredAttempts = attempts.filter((att) => {
    if (!selectedAssessmentId) return true;
    return att.assessmentId === selectedAssessmentId;
  });

  // Derived selected objects for UI rendering (human-readable)
  const currentStudent = students.find((s) => s.id === selectedStudentId);
  const currentAssessment = assessments.find((a) => a.id === selectedAssessmentId);
  const currentAttempt = attempts.find((att) => att.id === selectedAttemptId);

  // Validation message helper
  const getValidationMessage = () => {
    if (!selectedStudentId) return 'Please select a student.';
    if (!selectedAssessmentId) return 'Please select an assessment.';
    if (!selectedAttemptId) return 'Please select an assessment attempt.';
    return null;
  };

  // Generate AI Analysis
  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!selectedAttemptId) return;

    setLoading(true);
    setError('');
    setAnalysis(null);

    try {
      const res = await generateAIAnalysis({ assessmentAttemptId: selectedAttemptId });
      setAnalysis(res);
    } catch (e) {
      if (e.status === 401) {
        setError('Your session has expired. Please login again.');
      } else if (e.status === 403) {
        setError('You do not have permission to view AI learning analysis.');
      } else if (e.status === 404) {
        setError('Assessment attempt not found.');
      } else if (e.status === 400) {
        setError(e.message || 'Only completed or evaluated attempts can be analyzed by AI.');
      } else {
        setError(e.message || 'Unable to connect to the AI diagnostic service.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch Existing Cached Analysis
  const handleFetchExisting = async () => {
    if (!selectedAttemptId) return;

    setFetchingExisting(true);
    setError('');
    try {
      const res = await getAIAnalysisByAttemptId(selectedAttemptId);
      setAnalysis(res);
    } catch (e) {
      setError(e.message || 'No existing AI analysis found for this attempt. Click Generate to trigger analysis.');
    } finally {
      setFetchingExisting(false);
    }
  };

  // Generate AI Homework from Recommendation
  const handleCreateHomework = async () => {
    if (!analysis?.recommendation?.id) return;
    setGeneratingHomework(true);
    setHomeworkSuccessMessage('');
    try {
      const teacherId = user?.userId || '22222222-2222-2222-2222-222222222222';
      await generateAIHomework({
        homeworkRecommendationId: analysis.recommendation.id,
        teacherId,
      });
      setHomeworkSuccessMessage('Personalized AI homework assignment created and published successfully!');
    } catch (e) {
      alert(e.message || 'Failed to generate homework from AI recommendation.');
    } finally {
      setGeneratingHomework(false);
    }
  };

  // Format timestamp helper
  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (e) {
      return dateStr;
    }
  };

  const validationMsg = getValidationMessage();

  // Render concept lists
  const strongList = parseConcepts(analysis?.strongConcepts || analysis?.learningStrengths);
  const weakList = parseConcepts(analysis?.weakConcepts || analysis?.weakAreas);
  const misconceptionList = parseConcepts(analysis?.misconceptions);

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <PageHeader
        title="AI Learning Intelligence & Mastery Analysis"
        subtitle="Select a student and assessment attempt to generate structured AI learning diagnostic insights."
      />

      {/* Human-Readable Cascading Filter Card */}
      <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-5">
        <div className="flex items-center gap-2 border-b border-neutral-100 dark:border-neutral-800 pb-3">
          <Brain className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
            Student Assessment Selection
          </h2>
        </div>

        <form onSubmit={handleGenerate} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Step 1: Select Student */}
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
                  className="w-full px-3.5 py-2.5 text-sm bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-neutral-200"
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

            {/* Step 2: Select Assessment */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-neutral-500" />
                Assessment
              </label>
              {loadingAttempts ? (
                <div className="h-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
              ) : (
                <select
                  value={selectedAssessmentId}
                  onChange={handleAssessmentChange}
                  disabled={!selectedStudentId || assessments.length === 0}
                  className="w-full px-3.5 py-2.5 text-sm bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 dark:text-neutral-200"
                >
                  <option value="">
                    {!selectedStudentId
                      ? 'Select Student First'
                      : assessments.length === 0
                      ? 'No Assessments Found'
                      : 'Select Assessment...'}
                  </option>
                  {assessments.map((ass) => (
                    <option key={ass.id} value={ass.id}>
                      {ass.title}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Step 3: Select Attempt */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5 flex items-center gap-1.5">
                <FileCheck className="w-3.5 h-3.5 text-neutral-500" />
                Attempt
              </label>
              <select
                value={selectedAttemptId}
                onChange={handleAttemptChange}
                disabled={!selectedAssessmentId || filteredAttempts.length === 0}
                className="w-full px-3.5 py-2.5 text-sm bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 dark:text-neutral-200"
              >
                <option value="">
                  {!selectedAssessmentId
                    ? 'Select Assessment First'
                    : filteredAttempts.length === 0
                    ? 'No Completed Attempts'
                    : 'Select Attempt...'}
                </option>
                {filteredAttempts.map((att) => {
                  const dateStr = formatDate(att.submittedAt || att.startedAt);
                  const scoreStr = att.percentage != null ? `${Math.round(att.percentage)}%` : 'Completed';
                  return (
                    <option key={att.id} value={att.id}>
                      {dateStr} • {scoreStr} ({att.status || 'Completed'})
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          {/* Validation Banner or Action Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t border-neutral-100 dark:border-neutral-800">
            <div className="text-xs text-neutral-500 dark:text-neutral-400">
              {validationMsg ? (
                <span className="text-amber-600 dark:text-amber-400 font-medium flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  {validationMsg}
                </span>
              ) : (
                <span className="text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Ready to analyze attempt for {currentStudent?.name || 'student'}.
                </span>
              )}
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <Button
                type="button"
                variant="outline"
                onClick={handleFetchExisting}
                isLoading={fetchingExisting}
                disabled={!selectedAttemptId || loading}
                icon={RotateCcw}
              >
                View Previous Analysis
              </Button>

              <Button
                type="submit"
                isLoading={loading}
                disabled={!selectedAttemptId || fetchingExisting}
                icon={Sparkles}
                variant="primary"
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                {loading ? 'Analyzing learning patterns...' : '✨ Generate AI Analysis'}
              </Button>
            </div>
          </div>
        </form>
      </div>

      {/* Error Banners */}
      {error && <ErrorState message={error} onRetry={handleGenerate} />}

      {/* AI Processing Animation */}
      {loading && (
        <div className="p-12 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm text-center space-y-4 animate-pulse">
          <div className="w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
            <Sparkles className="w-8 h-8 animate-spin" />
          </div>
          <div>
            <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
              Analyzing Student Learning Patterns...
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 max-w-md mx-auto">
              Evaluating answer responses, time spent per question, and concept mastery using Gemini AI.
            </p>
          </div>
        </div>
      )}

      {/* AI ANALYSIS RESULTS DASHBOARD */}
      {analysis && !loading && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Diagnostic Header Card */}
          <div className="p-6 sm:p-8 rounded-2xl bg-neutral-900 dark:bg-neutral-950 text-white shadow-xl border border-neutral-800/80 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-500/30">
                  <Brain className="w-3.5 h-3.5" />
                  Gemini AI Diagnostic Report
                </div>

                <h2 className="text-2xl font-bold tracking-tight text-white">
                  AI Learning Intelligence & Mastery Analysis
                </h2>

                <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-300 pt-1">
                  <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-indigo-400" />
                    <span className="font-semibold text-neutral-100">
                      Student: {currentStudent?.name || 'Selected Student'}
                    </span>
                  </div>

                  <span className="text-neutral-600">•</span>

                  <div className="flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                    <span className="font-semibold text-neutral-100">
                      Assessment: {analysis.assessmentTitle || currentAssessment?.title || 'Assessment'}
                    </span>
                  </div>

                  <span className="text-neutral-600">•</span>

                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Attempt Date: {formatDate(analysis.analysisTimestamp || currentAttempt?.submittedAt)}</span>
                  </div>
                </div>
              </div>

              {/* Overall Mastery Gauge Card */}
              <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-center shrink-0 flex flex-col items-center justify-center min-w-[160px]">
                <span className="text-[10px] uppercase tracking-widest font-bold text-indigo-300 mb-1">
                  Overall Mastery
                </span>
                <span className="text-4xl font-extrabold text-white">
                  {Math.round(analysis.overallMasteryPercentage || currentAttempt?.percentage || 0)}%
                </span>
                {analysis.masteryLevel && (
                  <span className="mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                    {analysis.masteryLevel}
                  </span>
                )}
              </div>
            </div>

            {/* AI Learning Summary */}
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-sm text-neutral-200 leading-relaxed font-medium">
              <span className="text-xs uppercase tracking-wider font-bold text-indigo-400 block mb-1">
                AI Learning Summary
              </span>
              {analysis.analysisSummary || analysis.summaryNotes || 'Analysis generated successfully based on assessment responses.'}
            </div>
          </div>

          {/* Mastery Visualization Section */}
          <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <h3 className="font-bold text-base text-neutral-900 dark:text-neutral-100">
                  Concept Mastery Breakdown
                </h3>
              </div>
              <span className="text-xs text-neutral-400">Target Level: 80%+</span>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  <span>Overall Assessment Proficiency</span>
                  <span>{Math.round(analysis.overallMasteryPercentage || 0)}%</span>
                </div>
                <div className="w-full bg-neutral-100 dark:bg-neutral-800 h-3 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      (analysis.overallMasteryPercentage || 0) >= 80
                        ? 'bg-emerald-500'
                        : (analysis.overallMasteryPercentage || 0) >= 60
                        ? 'bg-amber-500'
                        : 'bg-rose-500'
                    }`}
                    style={{ width: `${Math.min(100, analysis.overallMasteryPercentage || 0)}%` }}
                  />
                </div>
              </div>

              {analysis.confidenceScore != null && (
                <div>
                  <div className="flex justify-between text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    <span>AI Model Diagnostic Confidence</span>
                    <span>{Math.round((analysis.confidenceScore || 0) * 100)}%</span>
                  </div>
                  <div className="w-full bg-neutral-100 dark:bg-neutral-800 h-3 rounded-full overflow-hidden">
                    <div
                      className="bg-indigo-600 h-full transition-all duration-500"
                      style={{ width: `${Math.min(100, (analysis.confidenceScore || 0) * 100)}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Grid: Strengths & Weak Areas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Learning Strengths */}
            <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-5 h-5" />
                <h3 className="font-bold text-base text-neutral-900 dark:text-neutral-100">
                  Learning Strengths
                </h3>
              </div>

              {strongList.length > 0 ? (
                <div className="space-y-2">
                  {strongList.map((str, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-900/30 text-xs font-semibold text-emerald-900 dark:text-emerald-300 flex items-center gap-2.5"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>{str}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-neutral-400 py-4 text-center">No specific strengths highlighted.</p>
              )}
            </div>

            {/* Areas Needing Attention */}
            <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
                <AlertTriangle className="w-5 h-5" />
                <h3 className="font-bold text-base text-neutral-900 dark:text-neutral-100">
                  Areas Needing Attention
                </h3>
              </div>

              {weakList.length > 0 ? (
                <div className="space-y-2">
                  {weakList.map((weak, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200/50 dark:border-rose-900/30 text-xs font-semibold text-rose-900 dark:text-rose-300 flex items-center gap-2.5"
                    >
                      <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
                      <span>{weak}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-neutral-400 py-4 text-center">No weak areas identified.</p>
              )}
            </div>
          </div>

          {/* Misconceptions Card */}
          {misconceptionList.length > 0 && (
            <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                <Brain className="w-5 h-5" />
                <h3 className="font-bold text-base text-neutral-900 dark:text-neutral-100">
                  Detected Misconceptions
                </h3>
              </div>

              <div className="space-y-2">
                {misconceptionList.map((misc, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-900/30 text-xs text-amber-900 dark:text-amber-300 font-medium flex items-start gap-2.5"
                  >
                    <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <span>{misc}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommended Actions & Next-Action Workflow */}
          <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
                  <Target className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-neutral-900 dark:text-neutral-100">
                    Recommended Remediation Plan
                  </h3>
                  <p className="text-xs text-neutral-400">
                    Derived automatically from Gemini AI diagnostic analysis
                  </p>
                </div>
              </div>

              {analysis.recommendedDifficulty && (
                <StatusBadge status={analysis.recommendedDifficulty} />
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 flex items-center gap-3">
                <Clock className="w-5 h-5 text-indigo-500 shrink-0" />
                <div>
                  <span className="text-[10px] uppercase font-bold text-neutral-400 block">
                    Suggested Study Time
                  </span>
                  <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                    {analysis.recommendedStudyMinutes || 15} mins
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 flex items-center gap-3">
                <Award className="w-5 h-5 text-indigo-500 shrink-0" />
                <div>
                  <span className="text-[10px] uppercase font-bold text-neutral-400 block">
                    Recommended Difficulty
                  </span>
                  <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                    {analysis.recommendedDifficulty || 'INTERMEDIATE'}
                  </span>
                </div>
              </div>
            </div>

            {analysis.recommendation?.recommendationReason && (
              <div className="p-4 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/30">
                <span className="text-xs font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider block mb-1">
                  Pedagogical Rationale
                </span>
                <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed">
                  {analysis.recommendation.recommendationReason}
                </p>
              </div>
            )}

            {/* Action Buttons for Next Workflow */}
            <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-neutral-500">
                {homeworkSuccessMessage ? (
                  <span className="text-emerald-600 font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    {homeworkSuccessMessage}
                  </span>
                ) : (
                  <span>Click below to generate personalized homework based on this recommendation.</span>
                )}
              </div>

              <Button
                onClick={handleCreateHomework}
                isLoading={generatingHomework}
                disabled={!analysis.recommendation?.id || generatingHomework}
                icon={Sparkles}
                variant="primary"
                className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                Generate Personalized Homework
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherAIAnalysis;
