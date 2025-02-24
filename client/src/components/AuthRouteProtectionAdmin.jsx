import { RouteIndex } from "@/helper/routeName";
import { showToast } from "@/helper/showToast";
import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const AuthRouteProtectionAdmin = () => {
  const user = useSelector((state) => state.user);
 if(user && user.user.role==="admin"){
    return <Outlet />
 }else{
    return <Navigate to={RouteIndex} />
 }
};

export default AuthRouteProtectionAdmin;
