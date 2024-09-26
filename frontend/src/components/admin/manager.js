import React, { useState, useEffect, Fragment } from "react";
import Table from "react-bootstrap/Table";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil, faTrash } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../common/navbar";

const Manager = () => {
  const [show, setShow] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleClose = () => setShow(false);
  const handleCloseDeleteModal = () => setShowDeleteModal(false);
  const handleShowDeleteModal = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  // Add
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [department, setDepartment] = useState("");

  // Edit
  const [editID, setEditId] = useState("");
  const [editUsername, setEditUsername] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [editName, setEditName] = useState("");
  const [editContact, setEditContact] = useState("");
  const [editDepartment, setEditDepartment] = useState("");

  const [data, setData] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    axios
      .get("http://localhost:8085/api/Manager")
      .then((result) => {
        setData(result.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleEdit = (id) => {
    setShow(true);
    setEditId(id);
    axios
      .get(`http://localhost:8085/api/Manager/${id}`)
      .then((result) => {
        setEditUsername(result.data.username);
        setEditPassword(result.data.password);
        setEditName(result.data.name);
        setEditContact(result.data.contact);
        setEditDepartment(result.data.department);
        setEditId(id);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleUpdate = () => {
    if (!editID) {
      toast.error("Invalid ID");
      return;
    }

    const url = `http://localhost:8085/api/Manager/${editID}`;
    const updatedData = {
      username: editUsername,
      password: editPassword,
      name: editName,
      contact: editContact,
      department: editDepartment,
    };

    axios
      .put(url, updatedData)
      .then((result) => {
        toast.success("Manager has been updated");
        getData(); // Refresh the data
        setShow(false); // Close the modal
      })
      .catch((error) => {
        toast.error("Manager updating failed");
      });
  };

  const handleSave = () => {
    const url = "http://localhost:8085/api/Managerinsert";
    const newData = {
      username,
      password,
      name,
      contact,
      department,
    };
  
    axios
      .post(url, newData)
      .then((result) => {
        console.log(result); // Add this line to see the response
        getData(); // Refresh the table with new data
        clear(); // Clear input fields
        toast.success("Manager has been added");
      })
      .catch((error) => {
        console.error("Error adding manager:", error);
        toast.error("Failed to add manager");
      });
  };
  
  const clear = () => {
    setUsername("");
    setPassword("");
    setName("");
    setContact("");
    setDepartment("");

    setEditUsername("");
    setEditPassword("");
    setEditName("");
    setEditContact("");
    setEditDepartment("");
    setEditId("");
  };

  // Pagination
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 3;

  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const currentItems = data.slice(startIndex, endIndex);

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const nextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages - 1));
  };

  const prevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 0));
  };

  // Delete
  const [deleteId, setDeleteId] = useState(null);

  const confirmDelete = () => {
    if (deleteId) {
      axios
        .delete(`http://localhost:8085/api/Manager/${deleteId}`)
        .then((result) => {
          if (result.status === 200) {
            toast.success("Manager has been deleted");
            getData();
            handleCloseDeleteModal();
          }
        })
        .catch((error) => {
          toast.error(error);
        });
    }
  };

    return (
      <Fragment>
          <Navbar admin /> <br />
          <div className="container">
              <ToastContainer />
              <Row>
                  <Col>
                      <div className="container pt-5">
                          <div className="row justify-content-center">
                              <div className="col-md-12">
                                  <div className="card shadow-lg p-4">
                                      <h1 className="text-darkblue">Create Manager</h1> <hr /> <br />
                                      <label>Username</label>
                                      <input type="text" className="form-control" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                                      <br />
                                      <label>Password</label>
                                      <input type="password" className="form-control" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                                      <br />
                                      <label>Name</label>
                                      <input type="text" className="form-control" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
                                      <br />
                                      <label>Contact</label>
                                      <input type="text" className="form-control" placeholder="Contact (Optional)" value={contact} onChange={(e) => setContact(e.target.value)} />
                                      <br />
                                      <label>Department</label>
                                      <input type="text" className="form-control" placeholder="Department" value={department} onChange={(e) => setDepartment(e.target.value)} />
                                      <br />
                                      <button className="btn btn-primary custom-darkblue-button" onClick={handleSave}>Create</button>
                                      <br />
                                  </div>
                              </div>
                          </div>
                      </div>
                  </Col>
                  <Col>
                      <div className="container pt-5">
                          <div className="row justify-content-center">
                              <div className="col-md-12">
                                  <div className="card shadow-lg p-4">
                                      <h1 className="text-darkblue">Managers</h1> <hr />
                                      <Table>
                                          <thead>
                                              <tr>
                                                  <th>Username</th>
                                                  <th>Name</th>
                                                  <th>Contact</th>
                                                  <th>Department</th>
                                                  <th>Actions</th>
                                              </tr>
                                          </thead>
                                          <tbody>
                                              {currentItems.map((item, index) => (
                                                  <tr key={index}>
                                                      <td>{item.username}</td>
                                                      <td>{item.name}</td>
                                                      <td>{item.contact}</td>
                                                      <td>{item.department}</td>
                                                      <td>
                                                          <button className="btn btn-info custom-darkblue-button" onClick={() => handleEdit(item.id)}>
                                                          <FontAwesomeIcon icon={faPencil} />
                                                          </button>
                                                          
                                                          <button className="btn btn-danger ml-2" onClick={() => handleShowDeleteModal(item.id)}>
                                                              <FontAwesomeIcon icon={faTrash} />
                                                          </button>
                                                      </td>
                                                  </tr>
                                              ))}
                                          </tbody>
                                      </Table>
                                      <div>
                                            <button className="btn" onClick={prevPage} disabled={currentPage === 0}>
                                                {"<"}
                                            </button>
                                            &nbsp;<span>{currentPage + 1} / {totalPages}</span>&nbsp;
                                            <button className="btn custom-darkblue-button" onClick={nextPage} disabled={currentPage === totalPages - 1}>
                                                {">"}
                                            </button>
                                        </div>
                                  </div>
                              </div>
                          </div>
                      </div>
                      <Modal show={show} onHide={handleClose}>
                          <Modal.Header closeButton>
                              <Modal.Title>Edit Manager</Modal.Title>
                          </Modal.Header>
                          <Modal.Body>
                              <label>Username</label>
                              <input type="text" className="form-control" value={editUsername} onChange={(e) => setEditUsername(e.target.value)} required />
                              <br />
                              <label>Password</label>
                              <input type="password" className="form-control" value={editPassword} onChange={(e) => setEditPassword(e.target.value)} required />
                              <br />
                              <label>Name</label>
                              <input type="text" className="form-control" value={editName} onChange={(e) => setEditName(e.target.value)} />
                              <br />
                              <label>Contact</label>
                              <input type="text" className="form-control" value={editContact} onChange={(e) => setEditContact(e.target.value)} />
                              <br />
                              <label>Department</label>
                              <input type="text" className="form-control" value={editDepartment} onChange={(e) => setEditDepartment(e.target.value)} />
                          </Modal.Body>
                          <Modal.Footer>
                              <Button variant="secondary" onClick={handleClose}>Close</Button>
                              <Button variant="primary" onClick={handleUpdate}>Save Changes</Button>
                          </Modal.Footer>
                      </Modal>
                      <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
                          <Modal.Header closeButton>
                              <Modal.Title>Confirm Deletion</Modal.Title>
                          </Modal.Header>
                          <Modal.Body>Are you sure you want to delete this manager?</Modal.Body>
                          <Modal.Footer>
                              <Button variant="secondary" onClick={handleCloseDeleteModal}>Cancel</Button>
                              <Button variant="danger" onClick={confirmDelete}>Delete</Button>
                          </Modal.Footer>
                      </Modal>
                  </Col>
              </Row>
          </div>
      </Fragment>
  );
                                              }

export default Manager;
