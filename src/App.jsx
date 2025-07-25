import React from 'react';
import { createBrowserRouter, Route, createRoutesFromElements, Navigate } from "react-router-dom";
import Home from './pages/Home';     
import Login from './pages/login';   
import Signup from './pages/signup';
import NotFound from './pages/NotFound';
import Layout from './Layout';
import ModulesRouter from './modules/modulesRouter';

const App = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* Public routes without Layout */}
      <Route path="login" element={<Login />} />
      {/* <Route path="signup" element={<Signup />} /> */}

      {/* Routes with Layout */}
      <Route element={<Layout />}>
        {/* Redirect root path to /invoice */}
        <Route path="/" element={<Navigate to="/invoice" replace />} />
        <Route path="/*" element={<ModulesRouter />} />
        {/* Add more routes here that require the layout */}
        {/* 404 fallback for any unmatched top-level routes */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </>
  )
);

export default App;