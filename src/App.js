import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import SurveyRunner from './components/SurveyRunner';
import Admin from './components/Admin';
import Survey from './components/Survey';
import AdminResponses from './components/AdminResponses';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <nav style={{marginBottom: 20}}>
          <Link to="/">Run Survey</Link> | <Link to="/admin">Add Questions</Link> | <Link to="/admin-responses">View Responses</Link>
        </nav>
        <Routes>
          <Route path="/" element={<SurveyRunner />} />
          <Route path="/admin" element={<Survey />} />
          <Route path="/admin-responses" element={<AdminResponses />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
