import PropTypes from 'prop-types';
import { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
// hooks
import useAuth from '../hooks/useAuth';
// pages
import Login from '../pages/auth/Login';
// components
import LoadingScreen from '../components/LoadingScreen';
import useBbgAuth from '../hooks/useBbgAuth';

// ----------------------------------------------------------------------

AuthGuard.propTypes = {
  children: PropTypes.node,
};

export default function AuthGuard({ children }) {
  const { isAuthenticated, isInitialized, user } = useAuth();
  // const { isUserLoggedIn } = useBbgAuth();

  // const { pathname } = useLocation();

  const [requestedLocation, setRequestedLocation] = useState(null);

  // if (!isAuthenticated) {
  //   return <Navigate to={"/auth/login"} />;
  // }

  if (!isInitialized) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    // if (pathname !== requestedLocation) {
    //   setRequestedLocation(pathname);
    // }
    return <Navigate to={"/auth/login"} />;
  }
  if(user && user?.role_id == 2) {
    return <Navigate to={"/employee/app"} />;
  }

  // if (requestedLocation && pathname !== requestedLocation) {
  //   setRequestedLocation(null);
  //   return <Navigate to={requestedLocation} />;
  // }

  return <>{children}</>;
}
