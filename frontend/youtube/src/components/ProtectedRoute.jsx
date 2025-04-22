import { Navigate } from 'react-router-dom';
import store from '../store/userAuth';

function ProtectedRoute({ children }) {
  const { user } = store();

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return children;
}

export default ProtectedRoute;