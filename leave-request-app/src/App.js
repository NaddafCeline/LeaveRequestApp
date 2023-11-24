import React from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import UserForm from './UserForm';
import AdminPortal from './AdminPortal';

//this is the app la la la
function App() {
  return (
      <Routes>
        <Route path="/" element={<UserForm/>} />
        <Route path="/admin" element={<AdminPortal/>} />
      </Routes>
  );
}

export default App;
