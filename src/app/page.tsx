"use client"
import dynamic from 'next/dynamic';
import React from 'react';
const Router = dynamic(() => import('react-router-dom').then(mod => mod.BrowserRouter), { ssr: false });
import {  Route, Routes } from 'react-router-dom';
import Login from './auth/login/page';
import Home from './home/page';
import Registeration from './auth/register/page';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Registeration />} />
      </Routes>
    </Router>
  );
};

export default App;
