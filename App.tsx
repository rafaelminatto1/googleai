


import React from 'react';
// FIX: Use namespace import for react-router-dom to fix module resolution issues.
import * as ReactRouterDOM from 'react-router-dom';
import AppRoutes from './AppRoutes';

const App: React.FC = () => {
  return (
    <ReactRouterDOM.HashRouter>
      <AppRoutes />
    </ReactRouterDOM.HashRouter>
  );
};

export default App;