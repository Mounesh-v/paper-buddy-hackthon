import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/layout/PageHeader';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorState from '../../components/common/ErrorState';
import { getLessons } from '../../api/lessonApi';
import { createAssessment, createQuestion, publishAssessment } from '../../api/assessmentApi';
import { Check, Plus, Trash2, ArrowRight, ArrowLeft, FileCheck, HelpCircle, Send } from 'lucide-react';

const CreateAssessment = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Assessment Config, 2: Questions, 3: Review & Publish
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  // Created assessment state
  const [createdAssessment, setCreatedAssessment] = useState(null);

  // Step 1: Assessment Form
  const [assessmentForm, setAssessmentForm] = useState({
    title: '',
    description: '',
    lessonSessionId: '',
    assessmentType: 'QUIZ', // QUIZ, DIAGNOSTIC, HOMEWORK_TEST
    instructions: 'Select the single best answer for each question.',
    passingMarks: 50,
    estimatedDurationMinutes: 30,
    allowMultipleAttempts: false,
    showCorrectAnswers: true,
    shuffleQuestions: true,
    shuffleOptions: true,
    negativeMarkingEnabled: false,
    negativeMarksPerQuestion: 0,
  });

  // Step 2: Question Authoring state
  const [createdQuestions, setCreatedQuestions] = useState([]);
  const [questionForm, setQuestionForm] = useState({
    questionText: '',
    questionType: 'SINGLE_CHOICE', // Maps to MULTIPLE_CHOICE for backend compatibility
    difficultyLevel: 'INTERMEDIATE',
    marks: 10,
    negativeMarks: 0,
    explanation: '',
    options: [
      { optionText: '', correct: true, displayOrder: 1 },
      { optionText: '', correct: false, displayOrder: 2 },
      { optionText: '', correct: false, displayOrder: 3 },
      { optionText: '', correct: false, displayOrder: 4 },
    ],
  });

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const res = await getLessons({ page: 0, size: 50 });
        setLessons(res.content || []);
        if (res.content?.length > 0) {
          setAssessmentForm((prev) => ({ ...prev, lessonSessionId: res.content[0].id }));
        }
      } catch (e) {
        console.error('Failed to fetch lessons');
      } finally {
        setLoading(false);
      }
    };
    fetchLessons();
  }, []);

  // Step 1 Submit: Create Assessment
  const handleCreateAssessment = async (e) => {
    e.preventDefault();
    if (!assessmentForm.title || !assessmentForm.lessonSessionId) {
      setFormError('Title and Lesson Session are required.');
      return;
    }
    setSubmitting(true);
    setFormError('');
    try {
      const res = await createAssessment(assessmentForm);
      setCreatedAssessment(res);
      setStep(2);
    } catch (e) {
      setFormError(e.message || 'Failed to create assessment.');
    } finally {
      setSubmitting(false);
    }
  };

  // Step 2: Add Question to Assessment
  const handleAddQuestion = async (e) => {
    e.preventDefault();
    if (!questionForm.questionText) {
      setFormError('Question text is required.');
      return;
    }
    if (!createdAssessment?.id) {
      setFormError('No assessment active.');
      return;
    }

    setSubmitting(true);
    setFormError('');
    try {
      const difficultyMapping = {
        EASY: 'BEGINNER',
        MEDIUM: 'INTERMEDIATE',
        HARD: 'ADVANCED',
        BEGINNER: 'BEGINNER',
        INTERMEDIATE: 'INTERMEDIATE',
        ADVANCED: 'ADVANCED',
      };
      const typeMapping = {
        SINGLE_CHOICE: 'MULTIPLE_CHOICE',
        MULTIPLE_CHOICE: 'MULTIPLE_CHOICE',
        TRUE_FALSE: 'TRUE_FALSE',
        SHORT_ANSWER: 'SHORT_ANSWER',
        FILL_IN_THE_BLANK: 'FILL_IN_THE_BLANK',
      };

      const payload = {
        assessmentId: createdAssessment.id,
        questionText: questionForm.questionText,
        questionType: typeMapping[questionForm.questionType] || 'MULTIPLE_CHOICE',
        difficultyLevel: difficultyMapping[questionForm.difficultyLevel] || 'INTERMEDIATE',
        marks: parseInt(questionForm.marks) || 10,
        negativeMarks: parseFloat(questionForm.negativeMarks) || 0,
        explanation: questionForm.explanation || '',
        displayOrder: createdQuestions.length + 1,
        options: questionForm.options
          .filter((o) => o.optionText.trim() !== '')
          .map((o, idx) => ({
            optionText: o.optionText,
            correct: Boolean(o.correct),
            displayOrder: idx + 1,
          })),
      };
      const res = await createQuestion(payload);
      setCreatedQuestions([...createdQuestions, res]);
      // Reset question form
      setQuestionForm({
        questionText: '',
        questionType: 'SINGLE_CHOICE',
        difficultyLevel: 'INTERMEDIATE',
        marks: 10,
        negativeMarks: 0,
        explanation: '',
        options: [
          { optionText: '', correct: true, displayOrder: 1 },
          { optionText: '', correct: false, displayOrder: 2 },
          { optionText: '', correct: false, displayOrder: 3 },
          { optionText: '', correct: false, displayOrder: 4 },
        ],
      });
    } catch (e) {
      setFormError(e.message || 'Failed to add question');
    } finally {
      setSubmitting(false);
    }
  };

  // Step 3 Submit: Publish Assessment
  const handlePublish = async () => {
    if (!createdAssessment?.id) return;
    setSubmitting(true);
    try {
      await publishAssessment(createdAssessment.id);
      navigate('/teacher/assessments');
    } catch (e) {
      setFormError(e.message || 'Failed to publish assessment');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner label="Preparing Assessment Builder..." fullPage />;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <PageHeader
        title="Author New Assessment"
        subtitle="Configure test parameters, author questions, and publish for student evaluation."
      />

      {/* Progress Steps Header */}
      <div className="flex items-center justify-between p-4 bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 mb-6">
        <div className={`flex items-center gap-3 ${step >= 1 ? 'text-neutral-900 dark:text-neutral-500 font-bold' : 'text-neutral-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${step >= 1 ? 'bg-neutral-900 text-white' : 'bg-neutral-200 dark:bg-neutral-800'}`}>
            1
          </div>
          <span className="text-sm">1. Assessment Config</span>
        </div>
        <div className="w-12 h-0.5 bg-neutral-200 dark:bg-neutral-800" />
        <div className={`flex items-center gap-3 ${step >= 2 ? 'text-neutral-900 dark:text-neutral-500 font-bold' : 'text-neutral-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${step >= 2 ? 'bg-neutral-900 text-white' : 'bg-neutral-200 dark:bg-neutral-800'}`}>
            2
          </div>
          <span className="text-sm">2. Author Questions ({createdQuestions.length})</span>
        </div>
        <div className="w-12 h-0.5 bg-neutral-200 dark:bg-neutral-800" />
        <div className={`flex items-center gap-3 ${step >= 3 ? 'text-neutral-900 dark:text-neutral-500 font-bold' : 'text-neutral-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${step >= 3 ? 'bg-neutral-900 text-white' : 'bg-neutral-200 dark:bg-neutral-800'}`}>
            3
          </div>
          <span className="text-sm">3. Review & Publish</span>
        </div>
      </div>

      {formError && (
        <div className="p-4 rounded-lg bg-neutral-100 dark:bg-neutral-900/60 border border-neutral-300 dark:border-neutral-700 text-neutral-800 dark:text-neutral-400 text-xs">
          {formError}
        </div>
      )}

      {/* STEP 1: Assessment Config */}
      {step === 1 && (
        <form onSubmit={handleCreateAssessment} className="p-6 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-4">
          <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-neutral-700" />
            General Test Parameters
          </h3>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Assessment Title *
            </label>
            <input
              type="text"
              value={assessmentForm.title}
              onChange={(e) => setAssessmentForm({ ...assessmentForm, title: e.target.value })}
              placeholder="e.g. Physics Chapter 3 Quiz"
              className="w-full px-3.5 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-700"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Lesson Session *
              </label>
              <select
                value={assessmentForm.lessonSessionId}
                onChange={(e) => setAssessmentForm({ ...assessmentForm, lessonSessionId: e.target.value })}
                className="w-full px-3.5 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-700"
                required
              >
                <option value="">Select Lesson Session</option>
                {lessons.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.lessonTitle} ({l.lessonDate})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Assessment Type *
              </label>
              <select
                value={assessmentForm.assessmentType}
                onChange={(e) => setAssessmentForm({ ...assessmentForm, assessmentType: e.target.value })}
                className="w-full px-3.5 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-700"
              >
                <option value="QUIZ">QUIZ</option>
                <option value="DIAGNOSTIC">DIAGNOSTIC</option>
                <option value="HOMEWORK_TEST">HOMEWORK_TEST</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Passing Marks (%)
              </label>
              <input
                type="number"
                value={assessmentForm.passingMarks}
                onChange={(e) => setAssessmentForm({ ...assessmentForm, passingMarks: parseInt(e.target.value) || 0 })}
                className="w-full px-3.5 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-700"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Duration (Minutes)
              </label>
              <input
                type="number"
                value={assessmentForm.estimatedDurationMinutes}
                onChange={(e) => setAssessmentForm({ ...assessmentForm, estimatedDurationMinutes: parseInt(e.target.value) || 30 })}
                className="w-full px-3.5 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-700"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Instructions
            </label>
            <textarea
              rows={2}
              value={assessmentForm.instructions}
              onChange={(e) => setAssessmentForm({ ...assessmentForm, instructions: e.target.value })}
              className="w-full px-3.5 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-700"
            />
          </div>

          <div className="flex justify-end pt-4">
            <Button type="submit" isLoading={submitting}>
              Proceed to Add Questions
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </form>
      )}

      {/* STEP 2: Question Authoring */}
      {step === 2 && (
        <div className="space-y-6">
          {/* Question Form */}
          <form onSubmit={handleAddQuestion} className="p-6 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-4">
            <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-neutral-700" />
              Add Question #{createdQuestions.length + 1}
            </h3>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Question Prompt *
              </label>
              <textarea
                rows={3}
                value={questionForm.questionText}
                onChange={(e) => setQuestionForm({ ...questionForm, questionText: e.target.value })}
                placeholder="Enter the question text here..."
                className="w-full px-3.5 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-700"
                required
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Question Type
                </label>
                <select
                  value={questionForm.questionType}
                  onChange={(e) => setQuestionForm({ ...questionForm, questionType: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl"
                >
                  <option value="SINGLE_CHOICE">SINGLE_CHOICE</option>
                  <option value="MULTIPLE_CHOICE">MULTIPLE_CHOICE</option>
                  <option value="TRUE_FALSE">TRUE_FALSE</option>
                  <option value="SHORT_ANSWER">SHORT_ANSWER</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Difficulty
                </label>
                <select
                  value={questionForm.difficultyLevel}
                  onChange={(e) => setQuestionForm({ ...questionForm, difficultyLevel: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl"
                >
                  <option value="INTERMEDIATE">MEDIUM / INTERMEDIATE</option>
                  <option value="BEGINNER">EASY / BEGINNER</option>
                  <option value="ADVANCED">HARD / ADVANCED</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Marks
                </label>
                <input
                  type="number"
                  min="1"
                  value={questionForm.marks}
                  onChange={(e) => setQuestionForm({ ...questionForm, marks: parseInt(e.target.value) || 1 })}
                  className="w-full px-3.5 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl"
                />
              </div>
            </div>

            {/* Options Input */}
            <div className="space-y-2 pt-2">
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                Answer Options & Correct Key:
              </label>
              {questionForm.options.map((opt, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="correctOption"
                    checked={opt.correct}
                    onChange={() => {
                      const updated = questionForm.options.map((o, i) => ({
                        ...o,
                        correct: i === idx,
                      }));
                      setQuestionForm({ ...questionForm, options: updated });
                    }}
                    className="w-4 h-4 text-neutral-900"
                  />
                  <input
                    type="text"
                    value={opt.optionText}
                    onChange={(e) => {
                      const updated = [...questionForm.options];
                      updated[idx].optionText = e.target.value;
                      setQuestionForm({ ...questionForm, options: updated });
                    }}
                    placeholder={`Option ${idx + 1}`}
                    className="flex-1 px-3 py-1.5 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl"
                  />
                  {opt.correct && <span className="text-xs text-neutral-600 font-semibold">Correct</span>}
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center pt-4">
              <Button type="submit" variant="secondary" icon={Plus} isLoading={submitting}>
                Save & Add Next Question
              </Button>

              <Button onClick={() => setStep(3)} disabled={createdQuestions.length === 0}>
                Review & Publish ({createdQuestions.length} added)
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </form>

          {/* List of Added Questions */}
          {createdQuestions.length > 0 && (
            <div className="p-6 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-3">
              <h4 className="font-bold text-sm text-neutral-900 dark:text-neutral-100">
                Added Questions ({createdQuestions.length})
              </h4>
              {createdQuestions.map((q, idx) => (
                <div key={q.id || idx} className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 text-xs flex justify-between items-start">
                  <div>
                    <span className="font-bold text-neutral-700 mr-2">Q{idx + 1}.</span>
                    <span className="font-medium text-neutral-900 dark:text-neutral-100">{q.questionText}</span>
                    <p className="text-[10px] text-neutral-400 mt-0.5">{q.questionType} &bull; {q.marks} marks</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* STEP 3: Review & Publish */}
      {step === 3 && (
        <div className="p-6 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-6">
          <div className="border-b border-neutral-100 dark:border-neutral-800 pb-4">
            <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">{createdAssessment?.title}</h3>
            <p className="text-xs text-neutral-500 mt-1">
              Type: {createdAssessment?.assessmentType} &bull; Total Questions: {createdQuestions.length} &bull; Duration: {createdAssessment?.estimatedDurationMinutes} mins
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-sm text-neutral-900 dark:text-neutral-100">Questions Summary</h4>
            {createdQuestions.map((q, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 text-xs">
                <p className="font-semibold text-neutral-900 dark:text-neutral-100">
                  {idx + 1}. {q.questionText} ({q.marks} marks)
                </p>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-neutral-100 dark:border-neutral-800">
            <Button variant="outline" onClick={() => setStep(2)} icon={ArrowLeft}>
              Back to Questions
            </Button>
            <Button onClick={handlePublish} isLoading={submitting} icon={Send}>
              Publish Assessment
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateAssessment;
