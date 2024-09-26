import React, { useState, useEffect, Fragment, useCallback } from "react";
import Table from 'react-bootstrap/Table';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Col from 'react-bootstrap/Col';
import Container from "react-bootstrap/Container";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from "../common/navbar";

const LeaveSummary = () => {
    const [leaveTypes, setLeaveTypes] = useState([]);
    const [leaveLimits, setLeaveLimits] = useState({});
    const [data, setData] = useState([]);

    const loggedInUser = sessionStorage.getItem('loggedInUser');
    const username = loggedInUser ? JSON.parse(loggedInUser).username : '';

    const fetchLeaveTypes = useCallback(() => {
        axios.get('http://localhost:8085/api/getLeavetype')
            .then((result) => {
                setLeaveTypes(result.data);
                const limits = {};
                result.data.forEach(item => {
                    limits[item.leave_type_name] = item.total_days || 0; // Default to 0 if total_days is undefined
                });
                setLeaveLimits(limits);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    // Fetch leave requests data based on username
    const fetchLeaveRequests = useCallback(() => {
        axios.get('http://localhost:8085/api/LeaveView/')
            .then((result) => {
                const filteredData = result.data.data.filter(item => item.username === username);
                setData(filteredData);
            })
            .catch((error) => {
                console.log(error);
            });
    }, [username]);

    useEffect(() => {
        fetchLeaveTypes();
        fetchLeaveRequests();
    }, [fetchLeaveTypes, fetchLeaveRequests]);

    // Calculate approved leave count based on leave types
    const approvedLeaveCount = leaveTypes.map(type => {
        const approvedCount = data.filter(item => item.leave_type === type.leave_type_name && item.status === 'approved').length;
        return {
            leave_type_name: type.leave_type_name,
            approved: approvedCount,
            total: leaveLimits[type.leave_type_name] || 0, // Fallback to 0 if leave limit is undefined
        };
    });

    return (
        <Fragment>
            <Navbar user />
            <ToastContainer /> <br />
            <Container>
                <div className="row">
                    <h2 className="mb-4 text-darkblue">Leave Summary</h2>
                    <hr />
                    {approvedLeaveCount.map((item, index) => (
                        <div className="col-md-4 mb-3" key={index}>
                            <div className="card">
                                <div className="card-body">
                                    <h4 className="card-title text-darkblue">{item.leave_type_name}</h4>
                                    <hr />
                                    <p className="card-text">Approved Leaves: {item.approved} / {item.total}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </Container>
        </Fragment>
    );
};

export default LeaveSummary;
