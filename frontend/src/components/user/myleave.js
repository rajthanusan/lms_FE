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

const MyLeave = () => {
    const [show, setShow] = useState(false);
    const [show1, setShow1] = useState(false);
    const [deleteItemId] = useState(null);
    const [editID] = useState(null);
    const [editLeave, setEditLeave] = useState('');
    const [editStartdate, setEditStartdate] = useState('');
    const [editEnddate, setEditEnddate] = useState('');
    const [editComments, setEditComments] = useState('');
    const [data, setData] = useState([]);
    const [leaveTypes, setLeaveTypes] = useState([]);
    const [leaveLimits, setLeaveLimits] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 6;

    const loggedInUser = sessionStorage.getItem('loggedInUser');
    const username = loggedInUser ? JSON.parse(loggedInUser).username : '';

    const getData = useCallback(() => {
        axios.get('http://localhost:8085/api/LeaveView/')
            .then((result) => {
                const filteredData = result.data.data.filter(item => item.username === username);
                setData(filteredData);
            })
            .catch((error) => {
                console.log(error);
            });
    }, [username]);

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

    useEffect(() => {
        getData();
        fetchLeaveTypes();
    }, [username, getData, fetchLeaveTypes]);

    
    

    const confirmDelete = () => {
        if (deleteItemId) {
            axios.delete(`http://localhost:8085/api/LeaveView/delete/${deleteItemId}`)
                .then((result) => {
                    if (result.status === 200) {
                        toast.success("Leave request has been deleted");
                        getData();
                        setShow1(false);
                    }
                })
                .catch((error) => {
                    toast.error(error.message);
                });
        }
    };

    const handleUpdate = () => {
        if (!editID) {
            toast.error('Invalid ID');
            return;
        }

        const url = `http://localhost:8085/api/LeaveView/${editID}`;
        const data = {
            id: editID,
            leave_type: editLeave,
            start_date: editStartdate,
            end_date: editEnddate,
            comments: editComments,
            username: username,
            status: "pending"
        };

        axios.put(url, data)
            .then((result) => {
                toast.success('Leave request has been updated');
                getData();  // Refresh the data
                setShow(false);  // Close the modal
            })
            .catch((error) => {
                console.error('Error during update:', error);
                toast.error('Leave request updating failed');
            });
    };

    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = data.slice(indexOfFirstRow, indexOfLastRow);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Calculate total approved leaves by leave type
   

    return (
        <Fragment>
            <Navbar user />
            <ToastContainer /> <br />
            <Container>
                <h2 className="text-darkblue">My Leave Requests</h2> <hr />
                <Table striped hover className="table-light">
                    <thead>
                        <tr>
                            <th>Leave Type</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Comments</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentRows.map((item, index) => (
                            <tr key={index}>
                                <td>{item.leave_type}</td>
                                <td>{new Date(item.start_date).toLocaleDateString()}</td>
<td>{new Date(item.end_date).toLocaleDateString()}</td>
                                <td>{item.comments}</td>
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
                    <ul className="pagination">
                        {Array.from(
                            { length: Math.ceil(data.length / rowsPerPage) },
                            (_, index) => (
                                <li key={index} className={`page-item ${currentPage === index + 1 ? "active" : ""}`}>
                                    <button className="page-link" onClick={() => paginate(index + 1)}>
                                        {index + 1}
                                    </button>
                                </li>
                            )
                        )}
                    </ul>
                </div>
            </Container>

            {/* Edit Modal */}
            <Modal show={show} onHide={() => setShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title className="text-darkblue">Update Leave Request</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Col>
                        <label>Leave Type</label>
                        {leaveTypes.length > 0 ? (
                            <select className="form-control" value={editLeave} onChange={(e) => setEditLeave(e.target.value)} required>
                                <option value="">--Select Leave Type--</option>
                                {leaveTypes.map((item, index) => (
                                    <option key={item.id} value={item.leave_type_name}>
                                        {item.leave_type_name}
                                    </option>
                                ))}
                            </select>
                        ) : (
                            <p>Loading leave types...</p>
                        )}
                        <br />
                        <label>Start Date</label>
                        <input type="date" className="form-control" value={editStartdate} onChange={(e) => setEditStartdate(e.target.value)} required />
                        <br />
                        <label>End Date</label>
                        <input type="date" className="form-control" value={editEnddate} onChange={(e) => setEditEnddate(e.target.value)} required />
                        <br />
                        <label>Comments</label>
                        <textarea className="form-control" value={editComments} onChange={(e) => setEditComments(e.target.value)} />
                    </Col>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShow(false)}>Close</Button>
                    <Button variant="primary" onClick={handleUpdate}>Update</Button>
                </Modal.Footer>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal show={show1} onHide={() => setShow1(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete Confirmation</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to delete this leave request?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShow1(false)}>Cancel</Button>
                    <Button variant="danger" onClick={confirmDelete}>Delete</Button>
                </Modal.Footer>
            </Modal>
        </Fragment>
    );
};

export default MyLeave;
