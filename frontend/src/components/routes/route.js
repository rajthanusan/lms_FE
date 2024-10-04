import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from '../common/home';
import Login from '../common/login';
import Register from '../common/register';
import ApplyLeave from '../user/applyLeave';
import MyLeave from '../user/myleave';
import Leavetype from '../admin/leavetype';
import Manager from '../admin/manager';
import Leaverequest from '../manager/leaverequest';
import Employees from '../manager/employees';
import LeaveSummary from '../user/LeaveSummary';
import Department from '../admin/department';
import LeaveSummaryEmp from '../manager/leavesummaryemp';

// Helper component to wrap Employees and pass the username
const EmployeesWithProps = () => {
    const loggedInDepartmentManager = JSON.parse(sessionStorage.getItem('loggedInDepartmentManager'));
    const username = loggedInDepartmentManager ? loggedInDepartmentManager.username : '';
    return <Employees username={username} />;
};

export default function Routesnav() {
    const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
    const loggedInAdmin = JSON.parse(sessionStorage.getItem('loggedInAdmin'));
    const loggedInDepartmentManager = JSON.parse(sessionStorage.getItem('loggedInDepartmentManager'));

    return (
        <Router>
            <Routes>
                {/* Home navigation routes */}
                <Route
                    path="/Admin"
                    element={loggedInAdmin ? <Home admin /> : <Navigate to="/login" />}
                />
                <Route
                    path="/Employee"
                    element={loggedInUser ? <Home user /> : <Navigate to="/login" />}
                />
                <Route
                    path="/DManager"
                    element={loggedInDepartmentManager ? <Home departmentManager /> : <Navigate to="/login" />}
                />

                {/* Common pages routes */}
                <Route path="/home" element={<Home />} />
                <Route path="/" element={<Navigate to="/home" />} />

                {/* Login and register routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* User pages routes */}
                <Route
                    path="/applyleave"
                    element={loggedInUser ? <ApplyLeave /> : <Navigate to="/login" />}
                />
                <Route
                    path="/myleave"
                    element={loggedInUser ? <MyLeave /> : <Navigate to="/login" />}
                />
                <Route
                    path="/employees"
                    element={loggedInDepartmentManager ? <EmployeesWithProps /> : <Navigate to="/login" />}
                />

                {/* Admin pages routes */}
                <Route
                    path="/manager"
                    element={loggedInAdmin ? <Manager /> : <Navigate to="/login" />}
                />
                
                <Route
                    path="/department"
                    element={loggedInAdmin ? <Department/> : <Navigate to="/login" />}
                />
                <Route
                    path="/leavetype"
                    element={loggedInAdmin ? <Leavetype /> : <Navigate to="/login" />}
                />
                <Route
                    path="/leaverequest"
                    element={loggedInDepartmentManager ? <Leaverequest /> : <Navigate to="/login" />}
                />
                <Route
                    path="/leavesummaryemp"
                    element={loggedInDepartmentManager ? <LeaveSummaryEmp /> : <Navigate to="/login" />}
                />
                <Route
                    path="/leavesummary"
                    element={loggedInUser ? <LeaveSummary /> : <Navigate to="/login" />}
                />
                
            </Routes>
        </Router>
    );
}
