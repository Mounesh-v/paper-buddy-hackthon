import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { hasRole } from '../utils/permissions';

const RoleRoute = ({ allowedRoles = [] }) => {
  const { role } = useAuth();

  if (!hasRole(role, allowedRoles)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default RoleRoute;
