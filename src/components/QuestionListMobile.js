import React, { useEffect, useState } from 'react';
import { getColorScale } from './QuestionList';

const QuestionListMobile = ({ survey, onResponse, responses, missing = [] }) => {
  const [answerChoices, setAnswerChoices] = useState([]);

  useEffect(() => {
    fetch('/answerChoices.json')
      .then(res => res.json())
      .then(setAnswerChoices)
      .catch(() => setAnswerChoices([]));
  }, []);

  const colorScale = getColorScale(answerChoices.length);
  return (
    <div className="question-list-mobile">
      {survey.sections.map(section => (
        <div key={section.id} className="section-block">
          <div className="section-title-mobile">{section.title}</div>
          {section.subsections.map(subsection => (
            <div key={subsection.id} className="subsection-block">
              <div className="subsection-title-mobile">{subsection.title}</div>
              {subsection.questions.map(question => {
                const isMissing = missing.includes(question.id);
                // Find the index of the selected answer, or default to -1
                const selectedIdx = answerChoices.findIndex(choice => responses && responses[question.id] === choice);
                // Use the color for the selected answer, or a neutral color if not selected
                const selectBg = selectedIdx >= 0 ? colorScale[selectedIdx] : '#f5faff';
                return (
                  <div key={question.id} className={`question-block-mobile${isMissing ? ' missing-mobile' : ''}`}>
                    <div className="question-text-mobile">{question.text}</div>
                    <select
                      className="answer-select-mobile"
                      style={{ background: selectBg, transition: 'background 0.2s' }}
                      value={responses && responses[question.id] ? responses[question.id] : ''}
                      onChange={e => onResponse && onResponse(question.id, e.target.value)}
                      aria-label={`Select answer for: ${question.text}`}
                    >
                      <option value="" disabled>Select an answer</option>
                      {answerChoices.map((choice, idx) => (
                        <option key={idx} value={choice}>{choice}</option>
                      ))}
                    </select>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default QuestionListMobile;
