import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';
// hooks
import useAuth from '../hooks/useAuth';
// routes
import { PATH_DASHBOARD } from '../routes/paths';

// ----------------------------------------------------------------------

GuestGuard.propTypes = {
  children: PropTypes.node,
};

export default function GuestGuard({ children }) {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to={PATH_DASHBOARD.root} />;
  }

  return <>{children}</>;
}

// import { Navigate } from 'react-router-dom';
// import { isUserLoggedIn } from "../services/authServices";

// function RequireAuth({ children }) {


//   return isUserLoggedIn() ? children : <Navigate to="/login" />;
// }
// export default RequireAuth;