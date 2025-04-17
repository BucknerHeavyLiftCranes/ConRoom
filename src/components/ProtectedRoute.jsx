// src/auth/ProtectedRoute.tsx
import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useAuth } from '../../context/exports/useAuth.js';


/**
 * Wrapper that give access to protected routes if user is authenticated.
 * @param {Object} props
 * @param {string} [props.redirectTo] route to redirect browser to if user is not authorized.
 * @param {ReactNode} [props.children] Child element to be rendered if route is unlocked.
 * @returns Content the user is allowed to access.
 */
const ProtectedRoute = ({ redirectTo, children }) => {
  const { authenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // or a spinner
  }

  if (!authenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  return children;
};

ProtectedRoute.propTypes = {
    redirectTo: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired
};

export default ProtectedRoute;
