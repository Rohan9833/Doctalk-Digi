// src/components/MR/ProtectedMRRoute.jsx
import { Navigate } from 'react-router-dom';

const ProtectedMRRoute = ({ children }) => {
  const token = localStorage.getItem('mrToken');
  
  if (!token) {
    return <Navigate to="/mr/login" replace />;
  }
  
  return children;
};

export default ProtectedMRRoute;