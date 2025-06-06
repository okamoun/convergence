import React, { useState } from 'react';

const AddQuestion = ({ onAddQuestion }) => {
  const [sectionId, setSectionId] = useState(1);
  const [subsectionId, setSubsectionId] = useState(1);
  const [question, setQuestion] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (question.trim()) {
      onAddQuestion(sectionId, subsectionId, question);
      setQuestion('');
    }
  };

  return (
    <div className="add-question">
      <h2>Add New Question</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Section ID:</label>
          <input
            type="number"
            value={sectionId}
            onChange={(e) => setSectionId(Number(e.target.value))}
            required
          />
        </div>
        <div className="form-group">
          <label>Subsection ID:</label>
          <input
            type="number"
            value={subsectionId}
            onChange={(e) => setSubsectionId(Number(e.target.value))}
            required
          />
        </div>
        <div className="form-group">
          <label>Question:</label>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            required
          />
        </div>
        <button type="submit">Add Question</button>
      </form>
    </div>
  );
};

export default AddQuestion;
