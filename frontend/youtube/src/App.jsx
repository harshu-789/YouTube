import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Auth from './pages/Auth';
import Video from './pages/videos.jsx';
import Channel from './pages/Channel';
import CreateChannel from './pages/CreateChannel';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="auth" element={<Auth />} />
        <Route path="video/:id" element={<Video />} />
        <Route path="channel/:id" element={<Channel />} />
        <Route
          path="create-channel"
          element={
            <ProtectedRoute>
              <CreateChannel />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;