import React, { useState, useEffect } from 'react';
import AddQuestion from './AddQuestion';
import QuestionList from './QuestionList';

const Survey = () => {
  const [survey, setSurvey] = useState({
    sections: [
      {
        id: 1,
        title: 'General',
        subsections: [
          {
            id: 1,
            title: 'Work Environment',
            questions: []
          }
        ]
      }
    ]
  });

  useEffect(() => {
    fetchSurvey();
  }, []);

  const fetchSurvey = async () => {
    try {
      const response = await fetch('http://localhost:5050/api/survey');
      const data = await response.json();
      setSurvey(data);
    } catch (error) {
      console.error('Error fetching survey:', error);
    }
  };

  const addQuestion = async (sectionId, subsectionId, question) => {
    try {
      const response = await fetch('http://localhost:5050/api/question', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sectionId, subsectionId, question }),
      });
      
      if (response.ok) {
        fetchSurvey();
      }
    } catch (error) {
      console.error('Error adding question:', error);
    }
  };

  const loadFromCsv = async () => {
    try {
      await fetch('http://localhost:5050/api/load-csv', { method: 'POST' });
      fetchSurvey();
    } catch (error) {
      alert('Failed to load from CSV');
    }
  };

  return (
    <div className="survey-container">
      <h1>Survey Application</h1>
      <button style={{marginBottom: 20}} onClick={loadFromCsv}>Load Questions from CSV</button>
      <AddQuestion onAddQuestion={addQuestion} />
      <QuestionList survey={survey} />
    </div>
  );
};

export default Survey;
