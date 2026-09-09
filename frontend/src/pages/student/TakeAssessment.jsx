import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorState from '../../components/common/ErrorState';
import Modal from '../../components/common/Modal';
import StatusBadge from '../../components/common/StatusBadge';
import { getAttemptById, saveStudentAnswer, submitAssessmentAttempt, getAttemptResult } from '../../api/assessmentAttemptApi';
import { getQuestionsByAssessment } from '../../api/assessmentApi';
import { generateAIAnalysis, getAIAnalysisByAttemptId } from '../../api/analysisApi';
import { Clock, CheckCircle2, ChevronRight, ChevronLeft, Send, Sparkles, Award } from 'lucide-react';

const TakeAssessment = () => {
  const { attemptId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [attempt, setAttempt] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // questionId -> selectedOptionId

  // Submission & Result state
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    const initQuiz = async () => {
      setLoading(true);
      setError(null);
      try {
        const attRes = await getAttemptById(attemptId);
        setAttempt(attRes);

        // If already submitted, fetch result & existing AI analysis immediately
        if (attRes.status === 'SUBMITTED' || attRes.status === 'EVALUATED') {
          const resData = await getAttemptResult(attemptId);
          setResult(resData);
          try {
            const existingAi = await getAIAnalysisByAttemptId(attemptId);
            setAiAnalysis(existingAi);
          } catch (e) {
            // Ignore if AI analysis has not been generated yet
          }
          setLoading(false);
          return;
        }

        // Fetch questions for this assessment
        const qRes = await getQuestionsByAssessment(attRes.assessmentId, { page: 0, size: 50 });
        setQuestions(qRes.content || []);
      } catch (e) {
        setError(e.message || 'Failed to initialize quiz environment.');
      } finally {
        setLoading(false);
      }
    };
    initQuiz();
  }, [attemptId]);

  const currentQuestion = questions[currentIndex];

  const handleOptionSelect = async (questionId, optionId) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
    try {
      await saveStudentAnswer(attemptId, {
        questionId,
        selectedOptionId: optionId,
        timeSpentSeconds: 15,
      });
    } catch (e) {
      console.error('Failed to auto-save answer:', e);
    }
  };

  const handleSubmitQuiz = async () => {
    setSubmitting(true);
    try {
      await submitAssessmentAttempt(attemptId, { autoSubmitted: false, remarks: 'Completed student submission' });
      const resData = await getAttemptResult(attemptId);
      setResult(resData);
      setIsSubmitModalOpen(false);
    } catch (e) {
      alert(e.message || 'Failed to submit quiz attempt.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleGenerateAIInsight = async () => {
    setAnalyzing(true);
    try {
      const res = await generateAIAnalysis({ assessmentAttemptId: attemptId });
      setAiAnalysis(res);
    } catch (e) {
      alert(e.message || 'Failed to generate AI analysis');
    } finally {
      setAnalyzing(false);
    }
  };

  if (loading) return <LoadingSpinner label="Preparing Question Paper & Timer..." fullPage />;
  if (error) return <ErrorState message={error} onRetry={() => window.location.reload()} />;

  // RESULT SCREEN AFTER SUBMISSION
  if (result) {
    const score = result.score ?? result.obtainedMarks ?? 0;
    const maxScore = result.maximumScore ?? result.totalMarks ?? 0;
    const pct = result.percentage ?? (maxScore > 0 ? (score / maxScore) * 100 : 0);
    const correctCount = result.totalCorrect ?? result.correctAnswersCount ?? 0;
    const totalAttempted = result.totalAttempted ?? 0;
    const incorrectCount = result.incorrectAnswersCount ?? Math.max(0, totalAttempted - correctCount);
    const isPassed = result.passed ?? (pct >= 40);

    return (
      <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-300">
        <div className="p-8 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-lg text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-neutral-200 dark:bg-neutral-900/60 text-neutral-800 dark:text-neutral-500 flex items-center justify-center mx-auto shadow-lg">
            <Award className="w-10 h-10" />
          </div>

          <div>
            <span className="text-xs uppercase font-bold tracking-widest text-neutral-700 block mb-1">
              Assessment Attempt Completed
            </span>
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
              Score: {score} / {maxScore}
            </h1>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
              Percentage: <span className="font-bold text-neutral-900 dark:text-neutral-100">{Math.round(pct)}%</span>
            </p>
          </div>

          <div className="flex justify-center">
            <StatusBadge status={isPassed ? 'PASSED' : 'FAILED'} className="text-sm px-4 py-1" />
          </div>

          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-neutral-100 dark:border-neutral-800 text-xs">
            <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800">
              <span className="text-neutral-400 block font-semibold">Total Questions</span>
              <span className="text-base font-bold text-neutral-800 dark:text-neutral-200">{result.totalQuestions || 0}</span>
            </div>
            <div className="p-3 rounded-xl bg-neutral-100 dark:bg-neutral-900/40 text-neutral-800 dark:text-neutral-500">
              <span className="block font-semibold">Correct Answers</span>
              <span className="text-base font-bold text-emerald-600 dark:text-emerald-400">{correctCount}</span>
            </div>
            <div className="p-3 rounded-xl bg-neutral-100 dark:bg-neutral-900/40 text-neutral-800 dark:text-neutral-500">
              <span className="block font-semibold">Incorrect Answers</span>
              <span className="text-base font-bold text-rose-600 dark:text-rose-400">{incorrectCount}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            <Button
              onClick={handleGenerateAIInsight}
              isLoading={analyzing}
              icon={Sparkles}
              variant="primary"
            >
              Generate AI Learning Insight
            </Button>

            <Button
              onClick={() => navigate('/student/assessments')}
              variant="outline"
            >
              Return to Assessments
            </Button>
          </div>
        </div>

        {/* AI Insight Card if generated */}
        {aiAnalysis && (
          <div className="p-6 rounded-2xl bg-neutral-900 text-white shadow-xl space-y-4 border border-neutral-800 animate-in fade-in duration-300">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
                <Sparkles className="w-5 h-5 text-indigo-400" />
                <span>Gemini AI Diagnostic Feedback</span>
              </div>
              {aiAnalysis.masteryLevel && (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {aiAnalysis.masteryLevel} MASTERY
                </span>
              )}
            </div>

            <p className="text-sm text-neutral-200 leading-relaxed font-medium">
              {aiAnalysis.analysisSummary || aiAnalysis.summaryNotes || 'Analysis generated successfully.'}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
              {aiAnalysis.recommendedDifficulty && (
                <div className="p-3 rounded-xl bg-neutral-800/80 border border-neutral-700/50">
                  <span className="text-neutral-400 block font-semibold mb-0.5">Recommended Next Level</span>
                  <span className="font-bold text-neutral-100">{aiAnalysis.recommendedDifficulty}</span>
                </div>
              )}
              {aiAnalysis.recommendedStudyMinutes && (
                <div className="p-3 rounded-xl bg-neutral-800/80 border border-neutral-700/50">
                  <span className="text-neutral-400 block font-semibold mb-0.5">Suggested Practice Time</span>
                  <span className="font-bold text-neutral-100">{aiAnalysis.recommendedStudyMinutes} mins</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  // ACTIVE QUIZ INTERFACE
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Quiz Top Bar */}
      <div className="flex items-center justify-between p-4 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm">
        <div>
          <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
            Quiz Question {currentIndex + 1} of {questions.length}
          </h2>
          <p className="text-xs text-neutral-400">Select the correct option below</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-900/60 text-neutral-800 dark:text-neutral-500 text-xs font-bold border border-neutral-300/50">
            <Clock className="w-4 h-4 animate-pulse" />
            <span>30:00 Mins</span>
          </div>

          <Button
            onClick={() => setIsSubmitModalOpen(true)}
            variant="danger"
            size="sm"
            icon={Send}
          >
            Submit Quiz
          </Button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-neutral-200 dark:bg-neutral-800 h-2 rounded-full overflow-hidden">
        <div
          className="bg-neutral-900 h-full transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / (questions.length || 1)) * 100}%` }}
        />
      </div>

      {/* Question Card */}
      {currentQuestion ? (
        <div className="p-6 sm:p-8 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xl space-y-6">
          <div className="flex items-start justify-between gap-4">
            <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 leading-snug">
              {currentQuestion.questionText}
            </h3>
            <span className="px-2.5 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-900/60 text-neutral-900 dark:text-neutral-500 text-xs font-semibold shrink-0">
              {currentQuestion.marks} Marks
            </span>
          </div>

          {/* Options Grid */}
          <div className="space-y-3">
            {currentQuestion.options?.map((opt, idx) => {
              const isSelected = answers[currentQuestion.id] === opt.id;
              return (
                <button
                  key={opt.id || idx}
                  onClick={() => handleOptionSelect(currentQuestion.id, opt.id)}
                  className={`w-full p-4 rounded-lg border text-left text-sm font-medium transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-neutral-100 dark:bg-neutral-900/60 border-neutral-700 text-neutral-900 dark:text-neutral-300 shadow-sm'
                      : 'bg-neutral-50/50 dark:bg-neutral-800/40 border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center border ${
                        isSelected
                          ? 'bg-neutral-900 text-white border-neutral-900'
                          : 'border-neutral-300 text-neutral-500 dark:border-neutral-700'
                      }`}
                    >
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{opt.optionText}</span>
                  </div>
                  {isSelected && <CheckCircle2 className="w-5 h-5 text-neutral-900 dark:text-neutral-500" />}
                </button>
              );
            })}
          </div>

          {/* Navigation Controls */}
          <div className="flex justify-between items-center pt-4 border-t border-neutral-100 dark:border-neutral-800">
            <Button
              variant="outline"
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex(currentIndex - 1)}
              icon={ChevronLeft}
            >
              Previous
            </Button>

            <span className="text-xs text-neutral-400 font-medium">
              {Object.keys(answers).length} of {questions.length} answered
            </span>

            <Button
              disabled={currentIndex >= questions.length - 1}
              onClick={() => setCurrentIndex(currentIndex + 1)}
            >
              Next Question
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ) : (
        <div className="p-8 text-center text-neutral-400">No questions loaded for this assessment.</div>
      )}

      {/* Confirmation Modal */}
      <Modal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        title="Submit Assessment Attempt?"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsSubmitModalOpen(false)} disabled={submitting}>
              Keep Reviewing
            </Button>
            <Button onClick={handleSubmitQuiz} isLoading={submitting} icon={Send}>
              Confirm & Submit
            </Button>
          </>
        }
      >
        <p className="text-sm text-neutral-600 dark:text-neutral-300">
          Are you sure you want to submit your answers? You have answered{' '}
          <span className="font-bold text-neutral-900">{Object.keys(answers).length}</span> out of{' '}
          <span className="font-bold">{questions.length}</span> questions.
        </p>
      </Modal>
    </div>
  );
};

export default TakeAssessment;
