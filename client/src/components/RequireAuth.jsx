import React from "react";
import {Navigate} from 'react-router-dom';import {useAuth} from '../context/AuthContext';export default function RequireAuth({children,admin=false}){const {user,loading}=useAuth();if(loading)return <p>Loading...</p>;if(!user)return <Navigate to={admin?'/admin/login':'/login'} replace/>;if(admin&&user.role!=='ADMIN')return <Navigate to="/" replace/>;return children}
