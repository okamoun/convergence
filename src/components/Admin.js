import React from 'react';
import AddQuestion from './AddQuestion';

const Admin = ({ onAddQuestion }) => {
  return (
    <div className="admin-container">
      <h1>Admin: Add Questions</h1>
      <AddQuestion onAddQuestion={onAddQuestion} />
    </div>
  );
};

export default Admin;
