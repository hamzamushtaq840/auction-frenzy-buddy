import { useLocation, Navigate, Outlet } from "react-router-dom";
// import useAuth from "../../Hooks/useAuth";
import { useSelector } from "react-redux";
import React from 'react';

const RequireAuth = (allowedRoles) => {
    let user = useSelector((state) => state.user.userInfo);
    console.log(user);
    const location = useLocation();

    return Object.values(user).includes(allowedRoles.allowedRoles) ? (<Outlet />) : user?.userInfo?.id ? (<Navigate to="/Unauthorized" state={{ from: location }} replace />) : (<Navigate to="/Unauthorized" state={{ from: location }} replace />);
};

export default RequireAuth;
