// import { Routes, Route } from 'react-router-dom';
// import Layout from './components/Layout';
// import Home from './pages/Home';
// import Auth from './pages/Auth';
// import Video from './pages/videos.jsx';
// import Channel from './pages/Channel';
// import CreateChannel from './pages/CreateChannel';
// import ProtectedRoute from './components/ProtectedRoute';

// function App() {
//   return (
//     <Routes>
//       <Route path="/" element={<Layout />}>
//         <Route index element={<Home />} />
//         <Route path="auth" element={<Auth />} />
//         <Route path="video/:id" element={<Video />} />
//         <Route path="channel/:id" element={<Channel />} />
//         <Route
//           path="create-channel"
//           element={
//             <ProtectedRoute>
//               <CreateChannel />
//             </ProtectedRoute>
//           }
//         />
//       </Route>
//     </Routes>
//   );
// }

// export default App;



import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Auth from './pages/auth';
import Channel from './pages/channel';
import CreateChannel from './pages/createChannel';
import Video from './pages/videos';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/channel/:id" element={<Channel />} />
        <Route path="/video/:id" element={<Video />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/create-channel" element={<CreateChannel />} />
        </Route>
      </Route>
      <Route path="/auth" element={<Auth />} />
    </Routes>
  );
}
