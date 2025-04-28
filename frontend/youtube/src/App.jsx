import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Layout      from './components/Layout.jsx';
import Home        from './pages/Home.jsx';
import VideoPage   from './pages/videos.jsx';
import Auth        from './pages/auth.jsx';

export default function App() {
  return (
    <Routes>
      {/* Wrap everything in your Layout (header/sidebar) */}
      <Route element={<Layout />}>
        {/* Home page at “/” */}
        <Route index element={<Home />} />

        {/* Video detail at “/video/:id” */}
        <Route path="video/:id" element={<VideoPage />} />

        {/* Auth at “/auth” */}
        <Route path="auth" element={<Auth />} />
      </Route>
    </Routes>
  );
}