import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard/Dashboard';
import Research from './pages/Research/Research';
import Analytics from './pages/Analytics/Analytics';

export const ProductResearchPath = 'product-research';
export const ProductResearchRouter: React.FC = () => (
  <Routes>
    <Route index Component={Dashboard} />
    <Route path='research' Component={Research} />
    <Route path='analytics' Component={Analytics} />
  </Routes>
);
