import React from 'react';
import { Navigate } from 'react-router';
import useUserRole from '../../hooks/useUserRole';
import useAuth from '../../hooks/useAuth';
import AdminDashboard from './AdminDashboard';
import VendorDashboard from './VendorDashboard';
import UserDashboard from './UserDashboard';
import Loading from '../../components/Loading/Loading';

const Dashboard = () => {
    const { role, roleLoading } = useUserRole();
    const { user, loading } = useAuth();

    if (loading || roleLoading) {
        return <Loading />;
    }

    if (!user) {
        return <Navigate to="/login" />;
    }

    return (
        <div>
            {role === 'admin' && <AdminDashboard />}
            {role === 'vendor' && <VendorDashboard />}
            {role === 'user' && <UserDashboard />}
        </div>
    );
};

export default Dashboard;
