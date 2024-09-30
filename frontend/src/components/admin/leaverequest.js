import React, { useState, useEffect, Fragment } from "react";
import Navbar from "../common/navbar";
import Table from "react-bootstrap/Table";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsDown, faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import "react-toastify/dist/ReactToastify.css";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

const Leaverequest = () => {
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage] = useState(5);
    const [searchTerm, setSearchTerm] = useState("");

    const [showAcceptModal, setShowAcceptModal] = useState(false);
    const [showDeclineModal, setShowDeclineModal] = useState(false);
    const [selectedItemId, setSelectedItemId] = useState(null);

    useEffect(() => {
        getData();
    }, []);

    const getData = () => {
        axios.get("https://lms-be-beta.vercel.app/api/LeaveApply/")
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
    };

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
                console.log('Response:', response); // Log response for debugging
                toast.success("Leave request accepted");
                getData();
                setShowAcceptModal(false);
            })
            .catch((error) => {
                console.error('Error accepting leave request:', error); // Log error for debugging
                toast.error("Error accepting leave request");
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
    const filteredData = Array.isArray(data) ? data.filter((item) =>
        item.leave_type.toLowerCase().includes(searchTerm.toLowerCase())
    ) : [];
    const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <Fragment>
            <Navbar manager />
            <ToastContainer />
            <br />
            <div className="container">
                <h1 className="text-darkblue">Admin Leave Request Log</h1>
                <hr />
                <div className="input-group mb-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search by leave type"
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Table striped hover className="table-light">
                    <thead>
                        <tr>
                            <th>Employee Username</th>
                            <th>Leave Type</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Comments</th>
                            <th>Actions</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentRows.map((item) => (
                            <tr key={item.id}>
                                <td>{item.username}</td>
                                <td>{item.leave_type}</td>
                                <td>{item.start_date}</td>
                                <td>{item.end_date}</td>
                                <td>{item.comments}</td>
                                <td>
                                    <OverlayTrigger
                                        placement="top"
                                        overlay={<Tooltip id={`tooltip-accept-${item.id}`}>Accept</Tooltip>}
                                    >
                                        <Button
                                            className="btn btn-primary custom-darkblue-button"
                                            disabled={item.status === 'Accepted' || item.status === 'Declined'}
                                            onClick={() => handleAccept(item.id)}
                                        >
                                            <FontAwesomeIcon icon={faThumbsUp} />
                                        </Button>
                                    </OverlayTrigger>
                                    <OverlayTrigger
                                        placement="top"
                                        overlay={<Tooltip id={`tooltip-decline-${item.id}`}>Decline</Tooltip>}
                                    >
                                        <Button
                                            className="btn btn-danger ms-2"
                                            disabled={item.status === 'Accepted' || item.status === 'Declined'}
                                            onClick={() => handleDecline(item.id)}
                                        >
                                            <FontAwesomeIcon icon={faThumbsDown} />
                                        </Button>
                                    </OverlayTrigger>
                                </td>
                                <td>
                                <div
  className={`badge text-wrap ${item.status === 'pending' ? 'bg-warning' : item.status === 'Accepted' ? 'bg-success' : item.status === 'Declined' ? 'bg-danger' : ''}`}
  style={{
    color: item.status === 'pending' ? 'black' : 
           item.status === 'approved' ? 'green' : 
           item.status === 'rejected' ? 'red' : 'inherit'
  }}
>
  {item.status}
</div>

                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                <div className="d-flex justify-content-center">
                    <nav aria-label="Page navigation example">
                        <ul className="pagination">
                            {Array.from(
                                { length: Math.ceil(filteredData.length / rowsPerPage) },
                                (_, index) => (
                                    <li
                                        key={index}
                                        className={`page-item ${currentPage === index + 1 ? "active" : ""}`}
                                    >
                                        <button
                                            className="page-link"
                                            onClick={() => paginate(index + 1)}
                                        >
                                            {index + 1}
                                        </button>
                                    </li>
                                )
                            )}
                        </ul>
                    </nav>
                </div>
            </div>
            <Modal show={showAcceptModal} onHide={() => setShowAcceptModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title className="text-darkblue">Confirm Accept</Modal.Title>
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

            <Modal show={showDeclineModal} onHide={() => setShowDeclineModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title className="text-danger">Confirm Decline</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to decline this leave request?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeclineModal(false)}>
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
