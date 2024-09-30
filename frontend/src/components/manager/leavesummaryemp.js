import React, { useState, useEffect, Fragment, useCallback } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Table from "react-bootstrap/Table";
import { Paginator } from "primereact/paginator"; // Ensure you're importing Paginator only once
import Navbar from "../common/navbar";

const ManagerLeaveSummary = () => {
  const [leaveData, setLeaveData] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(2); // Set number of users per page
  const [leaveSummary, setLeaveSummary] = useState({});
  const [department, setDepartment] = useState("");

  const username = sessionStorage.getItem("loggedInDepartmentManager")
    ? JSON.parse(sessionStorage.getItem("loggedInDepartmentManager")).username
    : "";

  // Fetch department for the logged-in manager
  const fetchDepartment = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:8085/find-department", {
        params: { username },
      });
      setDepartment(response.data.department);
    } catch (error) {
      toast.error("Error fetching department.");
    }
  }, [username]);

  // Fetch employees in the department
  const fetchEmployees = useCallback(async () => {
    if (!department) return;

    try {
      const response = await axios.get("http://localhost:8085/api/User", {
        params: { department },
      });
      setEmployees(response.data); // Set employees in the same department
    } catch (error) {
      toast.error("Error fetching employees.");
    }
  }, [department]);

  // Fetch leave data for the department's employees
  const getLeaveData = useCallback(async () => {
    try {
      const result = await axios.get("http://localhost:8085/api/LeaveView");
      const leaveList = result.data.data;

      // Filter leave data based on department employees
      const filteredLeaveData = leaveList.filter(leave =>
        employees.some(employee => employee.username === leave.username)
      );

      setLeaveData(filteredLeaveData);
      summarizeLeaveData(filteredLeaveData); // Summarize data initially
    } catch (error) {
      console.log("Error fetching leave data:", error);
      toast.error("Error fetching leave data.");
    }
  }, [employees]);

  // Summarize leave data by username, leave_type, and status
  const summarizeLeaveData = (data) => {
    const summary = data.reduce((acc, leave) => {
      const username = leave.username;
      const leaveType = leave.leave_type;
      const status = leave.status;

      if (!acc[username]) {
        acc[username] = {};
      }

      if (!acc[username][leaveType]) {
        acc[username][leaveType] = {
          approved: 0,
          pending: 0,
          rejected: 0,
        };
      }

      // Increment the appropriate status count
      acc[username][leaveType][status] =
        acc[username][leaveType][status] + 1 || 1;
      return acc;
    }, {});

    setLeaveSummary(summary); // Update state with summarized data
  };

  // Filter data based on search term
  useEffect(() => {
    const filtered = leaveData.filter((leave) =>
      leave.username.toLowerCase().includes(searchTerm.toLowerCase())
    );
    summarizeLeaveData(filtered); // Re-summarize based on search
  }, [searchTerm, leaveData]);

  // Fetch data on component mount
  useEffect(() => {
    fetchDepartment();
  }, [fetchDepartment]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  useEffect(() => {
    getLeaveData();
  }, [getLeaveData, employees]);

  // Handle pagination logic
  const indexOfLastRow = currentPage * itemsPerPage;
  const indexOfFirstRow = indexOfLastRow - itemsPerPage;

  // Get filtered data based on the search term
  const filteredData = Object.keys(leaveSummary).filter((username) =>
    username.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);

  const onPageChange = (event) => {
    setCurrentPage(event.page + 1); // Update current page
  };

  return (
    <Fragment>
      <Navbar manager username={username} />
      <Container className="my-5">
        <ToastContainer />
        <h1 className="text-darkblue">Employee Leave Summary</h1>
        <hr />

        {/* Search bar */}
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search by mail"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Email</th>
              <th>Leave Type</th>
              <th>Approved</th>
              <th>Pending</th>
              <th>Rejected</th>
            </tr>
          </thead>
          <tbody>
            {currentRows.length > 0 ? (
              currentRows.map((username) =>
                Object.keys(leaveSummary[username]).map((leaveType, i) => (
                  <Fragment key={`${username}-${i}`}>
                    <tr>
                      {i === 0 && (
                        <td rowSpan={Object.keys(leaveSummary[username]).length}>
                          {username}
                        </td>
                      )}
                      <td>{leaveType}</td>
                      <td>{leaveSummary[username][leaveType].approved || 0}</td>
                      <td>{leaveSummary[username][leaveType].pending || 0}</td>
                      <td>{leaveSummary[username][leaveType].rejected || 0}</td>
                    </tr>
                    {/* Total row for leave type */}
                    {i === Object.keys(leaveSummary[username]).length - 1 && (
                      <tr>
                        <td><strong>Total</strong></td>
                        <td></td>
                        <td>{Object.values(leaveSummary[username]).reduce((sum, leave) => sum + (leave.approved || 0), 0)}</td>
                        <td>{Object.values(leaveSummary[username]).reduce((sum, leave) => sum + (leave.pending || 0), 0)}</td>
                        <td>{Object.values(leaveSummary[username]).reduce((sum, leave) => sum + (leave.rejected || 0), 0)}</td>
                      </tr>
                    )}
                  </Fragment>
                ))
              )
            ) : (
              <tr>
                <td colSpan="5" className="text-center">
                  No leave records available.
                </td>
              </tr>
            )}
          </tbody>
        </Table>

        {/* Paginator */}
        <Paginator
          first={indexOfFirstRow}
          rows={itemsPerPage}
          totalRecords={filteredData.length}
          onPageChange={onPageChange}
          className="custom-paginator" // Add your custom class here
        />
      </Container>
    </Fragment>
  );
};

export default ManagerLeaveSummary;
