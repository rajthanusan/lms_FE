import React, { useState, useEffect, Fragment, useCallback } from "react";
import Navbar from "../common/navbar";
import Table from "react-bootstrap/Table";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsDown, faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import "react-toastify/dist/ReactToastify.css";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { Paginator } from "primereact/paginator"; // Make sure to import the Paginator

const Leaverequest = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [department, setDepartment] = useState("");

  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);

  const username = sessionStorage.getItem("loggedInDepartmentManager")
    ? JSON.parse(sessionStorage.getItem("loggedInDepartmentManager")).username
    : "";

  useEffect(() => {
    const getDepartment = async () => {
      try {
        const response = await axios.get(
          "https://lms-be-beta.vercel.app/find-department",
          {
            params: { username },
          }
        );
        setDepartment(response.data.department);
      } catch (err) {
        setDepartment("");
        toast.error(err.response?.data?.message || "An error occurred");
      }
    };

    getDepartment();
  }, [username]);

  const getData = useCallback(() => {
    if (department) {
      axios
        .get("https://lms-be-beta.vercel.app/api/LeaveApply/", {
          params: { department },
        })
        .then((result) => {
          if (result.data && result.data.data) {
            setData(result.data.data);
          } else {
            setData([]);
          }
        })
        .catch((error) => {
          toast.error("Error fetching data");
          console.log(error);
        });
    }
  }, [department]);

  useEffect(() => {
    getData(); // Fetch data when department changes
  }, [department, getData]);

  const handleAccept = (id) => {
    setSelectedItemId(id);
    setShowAcceptModal(true);
  };

  const handleDecline = (id) => {
    setSelectedItemId(id);
    setShowDeclineModal(true);
  };

  const confirmAccept = () => {
    axios
      .put(`https://lms-be-beta.vercel.app/api/LeaveApply/${selectedItemId}/approved`)
      .then((response) => {
        toast.success("Leave request accepted");
        getData();
        setShowAcceptModal(false);
      })
      .catch((error) => {
        toast.error("Error accepting leave request");
        console.log(error);
      });
  };

  const confirmDecline = () => {
    axios
      .put(`https://lms-be-beta.vercel.app/api/LeaveApply/${selectedItemId}/rejected`)
      .then(() => {
        toast.success("Leave request declined");
        getData();
        setShowDeclineModal(false);
      })
      .catch((error) => {
        toast.error("Error declining leave request");
        console.log(error);
      });
  };

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;

  // Filtering logic to accommodate searching by leave type, username, and date
  const filteredData = Array.isArray(data)
    ? data.filter((item) => {
        const leaveTypeMatch = item.leave_type.toLowerCase().includes(searchTerm.toLowerCase());
        const usernameMatch = item.username.toLowerCase().includes(searchTerm.toLowerCase());
        const startDateMatch = new Date(item.start_date).toLocaleDateString().includes(searchTerm);
        const endDateMatch = new Date(item.end_date).toLocaleDateString().includes(searchTerm);
        
        return leaveTypeMatch || usernameMatch || startDateMatch || endDateMatch;
      })
    : [];

  const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);

  const onPageChange = (event) => {
    setCurrentPage(event.page + 1); // Update current page when pagination changes
  };

  return (
    <Fragment>
      <Navbar manager />
      <ToastContainer />
      <br />
      <div className="container">
        <h1 className="text-darkblue">Employee Leave Requests</h1>
        <hr />
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search by email, leave type, or date (MM/DD/YYYY)"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Table striped hover className="table-light">
          <thead>
            <tr>
              <th>Employee Email</th>
              <th>Leave Type</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Actions</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {currentRows.map((item) => (
              <tr key={item.id}>
                <td>{item.username}</td>
                <td>{item.leave_type}</td>
                <td>{new Date(item.start_date).toLocaleDateString()}</td>
                <td>{new Date(item.end_date).toLocaleDateString()}</td>
                <td>
                  <OverlayTrigger
                    placement="top"
                    overlay={
                      <Tooltip id={`tooltip-accept-${item.id}`}>Accept</Tooltip>
                    }
                  >
                    <Button
                      className="btn btn-primary custom-darkblue-button"
                      disabled={
                        item.status === "Accepted" || item.status === "Declined"
                      }
                      onClick={() => handleAccept(item.id)}
                    >
                      <FontAwesomeIcon icon={faThumbsUp} />
                    </Button>
                  </OverlayTrigger>
                  <OverlayTrigger
                    placement="top"
                    overlay={
                      <Tooltip id={`tooltip-decline-${item.id}`}>
                        Decline
                      </Tooltip>
                    }
                  >
                    <Button
                      className="btn btn-danger ms-2"
                      disabled={
                        item.status === "Accepted" || item.status === "Declined"
                      }
                      onClick={() => handleDecline(item.id)}
                    >
                      <FontAwesomeIcon icon={faThumbsDown} />
                    </Button>
                  </OverlayTrigger>
                </td>
                <td>{item.status}</td>
              </tr>
            ))}
          </tbody>
        </Table>

        {/* Paginator */}
        <Paginator
          first={indexOfFirstRow}
          rows={rowsPerPage}
          totalRecords={filteredData.length}
          onPageChange={onPageChange}
          className="custom-paginator"
        />
      </div>

      {/* Accept Modal */}
      <Modal show={showAcceptModal} onHide={() => setShowAcceptModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Accept</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to accept this leave request?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAcceptModal(false)}>
            Cancel
          </Button>
          <Button variant="primary custom-darkblue-button" onClick={confirmAccept}>
            Accept
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Decline Modal */}
      <Modal show={showDeclineModal} onHide={() => setShowDeclineModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Decline</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to decline this leave request?
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowDeclineModal(false)}
          >
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDecline}>
            Decline
          </Button>
        </Modal.Footer>
      </Modal>
    </Fragment>
  );
};

export default Leaverequest;
