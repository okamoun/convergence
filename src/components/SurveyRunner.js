import React, { useState, useEffect } from 'react';
import QuestionList from './QuestionList';

const SurveyRunner = () => {
  const [survey, setSurvey] = useState({ sections: [] });
  const [responses, setResponses] = useState({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetchSurvey();
  }, []);

  const fetchSurvey = async () => {
    try {
      const response = await fetch('/surveyData.json');
      const data = await response.json();
      setSurvey(data);
    } catch (error) {
      console.error('Error fetching survey:', error);
    }
  };

  const handleResponse = (questionId, answer) => {
    setResponses({ ...responses, [questionId]: answer });
  };

  // Count total number of questions
  const totalQuestions = survey.sections.reduce((sum, section) =>
    sum + section.subsections.reduce((s2, subsection) => s2 + subsection.questions.length, 0), 0
  );
  const [showMissing, setShowMissing] = useState(false);
  const allAnswered = Object.keys(responses).length === totalQuestions && totalQuestions > 0;

  // Get all question IDs in the survey
  const allQuestionIds = survey.sections.flatMap(section =>
    section.subsections.flatMap(subsection =>
      subsection.questions.map(q => q.id)
    )
  );
  const unansweredIds = allQuestionIds.filter(qid => !responses[qid]);

  const [saveStatus, setSaveStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!allAnswered) {
      setShowMissing(true);
      return;
    }
    setShowMissing(false);
    setSubmitted(true);
    setSaveStatus(null);
    // POST responses to backend
    try {
      const res = await fetch('http://localhost:5050/api/submit-responses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(responses),
      });
      const data = await res.json();
      if (data.success) {
        setSaveStatus('success');
      } else {
        setSaveStatus('error');
      }
    } catch (err) {
      setSaveStatus('error');
    }
  };

  return (
    <div className="survey-runner-container">
      <h1>Survey</h1>
      <form onSubmit={handleSubmit}>
        <QuestionList survey={survey} onResponse={handleResponse} responses={responses} missing={showMissing ? unansweredIds : []} />
        <button type="submit">Submit Responses</button>
      </form>
      {showMissing && unansweredIds.length > 0 && (
        <div className="warning" style={{color:'red',marginTop:10}}>
          Please answer all questions. Missing questions are highlighted.
        </div>
      )}
      {submitted && <div className="thank-you">Thank you for your responses!</div>}
      {saveStatus === 'success' && (
        <div style={{color:'green',marginTop:10}}>Responses saved to database!</div>
      )}
      {saveStatus === 'error' && (
        <div style={{color:'red',marginTop:10}}>Failed to save responses. Please try again.</div>
      )}
    </div>
  );
};

export default SurveyRunner;
