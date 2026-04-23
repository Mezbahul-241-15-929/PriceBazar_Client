import React from 'react';
import useAuth from '../hooks/useAuth';
import useUserRole from '../hooks/useUserRole';
import { Navigate, useLocation } from 'react-router';
import Loading from '../components/Loading/Loading';

/**
 * RoleBasedRoute Component
 * Protects routes based on user role
 * Only allows specified roles to access the route
 * Redirects unauthorized users to home page
 */
const RoleBasedRoute = ({ children, allowedRoles = [] }) => {
    const { user, loading } = useAuth();
    const { role, roleLoading } = useUserRole();
    const location = useLocation();

    // Show loading while checking auth and role
    if (loading || roleLoading) {
        return <Loading />;
    }

    // If user is not logged in, redirect to login
    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // If user role is not in allowed roles, redirect to home
    if (!allowedRoles.includes(role)) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default RoleBasedRoute;
