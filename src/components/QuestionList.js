import React, { useEffect, useState } from 'react';

// Generates n colors from red to blue using HSL interpolation
const getColorScale = (n) => {
  const colors = [];
  for (let i = 0; i < n; i++) {
    const h = 0 + (220 - 0) * (i / (n - 1)); // 0=red, 220=blue
    colors.push(`hsl(${h}, 80%, 85%)`);
  }
  return colors;
};

const QuestionList = ({ survey, onResponse, responses, missing = [] }) => {
  const [answerChoices, setAnswerChoices] = useState([]);

  useEffect(() => {
    fetch('/answerChoices.json')
      .then(res => res.json())
      .then(setAnswerChoices)
      .catch(() => setAnswerChoices([]));
  }, []);

  const colorScale = getColorScale(answerChoices.length);
// Helper to slightly lighten the background color for selected cells
const lightenColor = (color, amount = 6) => {
  // color is in hsl(h, s%, l%) format
  if (!color.startsWith('hsl')) return color;
  const match = color.match(/hsl\((\d+), (\d+)%?, (\d+)%?\)/);
  if (!match) return color;
  const [, h, s, l] = match;
  return `hsl(${h}, ${s}%, ${Math.min(100, parseInt(l, 10) + amount)}%)`;
};

  return (
    <div className="question-list">
      <table className="survey-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{textAlign:'left',fontSize:'1.2rem',color:'#fff'}}>Survey questions</th>
            {answerChoices.map((choice, idx) => (
              <th key={idx} className="answer-col" style={{textAlign:'center', background: colorScale[idx], whiteSpace: 'normal', wordBreak: 'break-word', overflowWrap: 'break-word', verticalAlign: 'middle'}}>{choice}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {survey.sections.map((section, sidx) => (
            <React.Fragment key={section.id}>
              <tr className="section-row">
                <td colSpan={1 + answerChoices.length} style={{fontWeight: 'bold', background: '#e3eafc', fontSize: '1.1rem'}}>
                  {section.title}
                </td>
              </tr>
              {section.subsections.map((subsection, subidx) => (
                <React.Fragment key={subsection.id}>
                  <tr className="subsection-row">
                    <td colSpan={1 + answerChoices.length} style={{fontWeight: 500, background: '#f5faff', fontSize: '1rem', textAlign: 'center'}}>
                      {subsection.title}
                    </td>
                  </tr>
                  {subsection.questions.map((question, qidx) => {
                    const isMissing = missing.includes(question.id);
                    return (
                      <tr key={question.id} style={isMissing ? { background: '#e3eafd', border: '2px solid #1a237e' } : {}}>
                        <td>{question.text}</td>
                        {answerChoices.map((answer, aidx) => {
                          const isSelected = responses && responses[question.id] === answer;
                          return (
                            <td
                              key={aidx}
                              className="answer-col"
                              style={{
                                textAlign: 'center',
                                background: colorScale[aidx],
                                cursor: 'pointer',
                                border: isSelected ? '3px solid #0057b7' : '2px solid transparent',
                                boxShadow: isSelected ? '0 0 10px #b3c7e6' : undefined,
                                transition: 'border 0.15s, box-shadow 0.15s',
                                fontWeight: isSelected ? 'bold' : 'normal'
                              }}
                              onClick={() => onResponse && onResponse(question.id, answer)}
                              tabIndex={0}
                              aria-pressed={isSelected}
                              role="button"
                              onKeyDown={e => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                  onResponse && onResponse(question.id, answer);
                                }
                              }}
                            >
                              {isSelected ? (
                                <span style={{ fontSize: '1.6rem', color: '#2196f3', fontWeight: 'bold', lineHeight: 1, width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                  {(() => {
                                    // 5-point scale: 0 = very unhappy, 4 = very happy
                                    const faces = ['😡', '🙁', '😐', '🙂', '😁'];
                                    return faces[aidx] || '🙂';
                                  })()}
                                </span>
                              ) : null}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </React.Fragment>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default QuestionList;