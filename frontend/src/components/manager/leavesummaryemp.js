import React, { useState, useEffect, Fragment, useCallback } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Table from "react-bootstrap/Table";
import { Paginator } from "primereact/paginator";
import Navbar from "../common/navbar";
import jsPDF from "jspdf";
import "jspdf-autotable"; // Import jsPDF AutoTable

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
      const response = await axios.get("https://lms-be-beta.vercel.app/find-department", {
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
      const response = await axios.get("https://lms-be-beta.vercel.app/api/User", {
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
      const result = await axios.get("https://lms-be-beta.vercel.app/api/LeaveView");
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

  // Function to generate PDF using jsPDF
  // Function to generate PDF using jsPDF with better layout
  const downloadPdf = (username) => {
    const doc = new jsPDF();
  
    // Set the document title and add employee details
    doc.setFontSize(18);
    doc.text("Employee Leave Summary", 14, 20);
  
    // Add employee details
    doc.setFontSize(12);
    doc.text(`Employee: ${username}`, 14, 30);
    doc.text(`Department: ${department}`, 14, 36);
    doc.text(`Report Date: ${new Date().toLocaleDateString()}`, 14, 42);
  
    // Leave Summary Table Data
    const leaveDataForUser = leaveSummary[username];
    const tableData = Object.keys(leaveDataForUser).map((leaveType) => [
      leaveType,
      leaveDataForUser[leaveType].approved || 0,
      leaveDataForUser[leaveType].pending || 0,
      leaveDataForUser[leaveType].rejected || 0,
    ]);
  
    // Draw the summary table with headings
    doc.autoTable({
      startY: 50, // Start after employee details
      head: [["Leave Type", "Approved", "Pending", "Rejected"]],
      body: tableData,
      theme: "striped", // Add striped theme for clarity
      styles: { fontSize: 10 }, // Adjust font size
      headStyles: { fillColor: [41, 128, 185] }, // Custom header color
      margin: { top: 10, left: 14, right: 14 }, // Page margins for better spacing
    });
  
    // Fetch leave data details for this user
    const filteredLeaveData = leaveData.filter(leave => leave.username === username);
    const detailedLeaveData = filteredLeaveData.map(leave => [
      leave.leave_type,
      new Date(leave.start_date).toLocaleDateString(),
      new Date(leave.end_date).toLocaleDateString(),
      leave.comments,
      leave.status,
    ]);
  
    // Add detailed leave records
    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 10, // Start after the summary table
      head: [["Leave Type", "Start Date", "End Date", "Comments", "Status"]],
      body: detailedLeaveData,
      theme: "grid",
      styles: { fontSize: 10 },
    });
  
    // Add a footer with page number and company details
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.text(`Page ${i} of ${pageCount}`, 14, doc.internal.pageSize.height - 10);
      doc.text("Leave Managment Team", 170, doc.internal.pageSize.height - 10);
    }
  
    // Save the document with a meaningful filename
    doc.save(`${username}-leave-summary-${new Date().toLocaleDateString()}.pdf`);
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
              <th>Report</th>
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
                      {i === 0 && (
                        <td rowSpan={Object.keys(leaveSummary[username]).length}>
                          <button
                            className="btn btn-primary custom-darkblue-button"
                            onClick={() => downloadPdf(username)}
                          >
                            Download PDF
                          </button>
                        </td>
                      )}
                    </tr>
                  </Fragment>
                ))
              )
            ) : (
              <tr>
                <td colSpan="6" className="text-center">
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
          className="custom-paginator"
        />
      </Container>
    </Fragment>
  );
};

export default ManagerLeaveSummary;
