import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login';
import Student from './Student';
import Register from './Register';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Upload from './uploads/Upload';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Router>
    <Routes>
      <Route path="/register" element={<Register />} />
        <Route path="/" element={<Login />} />
        <Route path="/students" element={<Student />} />
        <Route path="/upload" element={<Upload />} />
    </Routes>
  </Router>
);
