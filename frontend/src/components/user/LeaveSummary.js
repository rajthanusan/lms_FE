import React, { useState, useEffect, Fragment, useCallback } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../common/navbar";
import jsPDF from "jspdf";
import "jspdf-autotable";

const LeaveSummary = () => {
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [leaveLimits, setLeaveLimits] = useState({});
  const [data, setData] = useState([]);
  const [department, setDepartment] = useState(""); // State to hold the department

  const loggedInUser = sessionStorage.getItem("loggedInUser");
  const username = loggedInUser ? JSON.parse(loggedInUser).username : "";

  const fetchLeaveTypes = useCallback(() => {
    axios
      .get("https://lms-be-beta.vercel.app/api/getLeavetype")
      .then((result) => {
        setLeaveTypes(result.data);
        const limits = {};
        result.data.forEach((item) => {
          limits[item.leave_type_name] = item.total_days || 0;
        });
        setLeaveLimits(limits);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  // Fetch department for the logged-in manager
  const fetchDepartment = useCallback(async () => {
    try {
      const response = await axios.get("https://lms-be-beta.vercel.app/find-department", {
        params: { username },
      });
      setDepartment(response.data.department);
    } catch (error) {
      console.error("Error fetching department.", error);
    }
  }, [username]);

  const fetchLeaveRequests = useCallback(() => {
    axios
      .get("https://lms-be-beta.vercel.app/api/LeaveView/")
      .then((result) => {
        const filteredData = result.data.data.filter(
          (item) => item.username === username
        );
        setData(filteredData);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [username]);

  useEffect(() => {
    fetchLeaveTypes();
    fetchDepartment(); // Fetch department when component mounts
    fetchLeaveRequests();
  }, [fetchLeaveTypes, fetchDepartment, fetchLeaveRequests]);

  const approvedLeaveCount = leaveTypes.map((type) => {
    const approvedCount = data.filter(
      (item) =>
        item.leave_type === type.leave_type_name && item.status === "approved"
    ).length;
    return {
      leave_type_name: type.leave_type_name,
      approved: approvedCount,
      total: leaveLimits[type.leave_type_name] || 0,
    };
  });

  const downloadPdf = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Employee Leave Summary", 14, 20);
    doc.setFontSize(12);
    doc.text(`Employee: ${username}`, 14, 30);
    doc.text(`Department: ${department}`, 14, 36);
    doc.text(`Report Date: ${new Date().toLocaleDateString()}`, 14, 42);
  
    const tableData = approvedLeaveCount.map((item) => [
      item.leave_type_name,
      item.approved,
      item.total,
    ]);
  
    doc.autoTable({
      startY: 50,
      head: [["Leave Type", "Approved", "Total"]],
      body: tableData,
      theme: "striped",
      styles: { fontSize: 10 },
      headStyles: { fillColor: [41, 128, 185] },
      margin: { top: 10, left: 14, right: 14 },
    });
  
    const detailedLeaveData = data
      .filter(leave => leave.username === username)
      .map(leave => [
        leave.leave_type,
        new Date(leave.start_date).toLocaleDateString(),
        new Date(leave.end_date).toLocaleDateString(),
        leave.comments,
        leave.status,
      ]);
  
    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 10,
      head: [["Leave Type", "Start Date", "End Date", "Comments", "Status"]],
      body: detailedLeaveData,
      theme: "grid",
      styles: { fontSize: 10 },
    });
  
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.text(`Page ${i} of ${pageCount}`, 14, doc.internal.pageSize.height - 10);
      doc.text("Leave Management Team", 170, doc.internal.pageSize.height - 10);
    }
  
    doc.save(`${username}-leave-summary-${new Date().toLocaleDateString()}.pdf`);
  };
  
  return (
    <Fragment>
      <Navbar user />
      <ToastContainer /> <br />
      <Container>
        <h2 className="mb-4 text-darkblue">Leave Summary</h2>
        <hr />
        <div className="row">
          {approvedLeaveCount.map((item, index) => (
            <div className="col-md-4 mb-4" key={index}>
              <div className="card shadow-sm">
                <div className="card-body">
                  <h4 className="card-title text-darkblue">{item.leave_type_name}</h4>
                  <hr />
                  <p className="card-text">
                    Approved Leaves: <strong>{item.approved}</strong> / <strong>{item.total}</strong>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mb-4">
          <button
            className="btn btn-primary custom-darkblue-button"
            onClick={downloadPdf}
          >
            Download Leave Summary Report
          </button>
        </div>
      </Container>
    </Fragment>
  );
};

export default LeaveSummary; 
