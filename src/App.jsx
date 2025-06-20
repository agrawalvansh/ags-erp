import React from 'react';
import { createBrowserRouter, Route, createRoutesFromElements } from "react-router-dom";
import Home from './pages/Home';     
import Login from './pages/login';   
import Signup from './pages/signup';
import Layout from './Layout';
import ModulesRouter from './modules/modulesRouter';

const App = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* Public routes without Layout */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Routes with Layout */}
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/*" element={<ModulesRouter />} />
        {/* Add more routes here that require the layout */}
      </Route>
    </>
  )
);

export default App;