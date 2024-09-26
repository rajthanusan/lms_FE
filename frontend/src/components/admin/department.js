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

const Department = () => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);

  // Add
  const [departmentName, setDepartmentName] = useState("");
  const [managerEmail, setManagerEmail] = useState("");
  const [managerPassword, setManagerPassword] = useState("");

  // Edit
  const [editID, setEditId] = useState("");
  const [editDepartmentName, setEditDepartmentName] = useState("");
  const [editManagerEmail, setEditManagerEmail] = useState("");
  const [editManagerPassword, setEditManagerPassword] = useState("");

  const [data, setData] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    axios
      .get("http://localhost:8085/api/Department")
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
      .get(`http://localhost:8085/api/Department/${id}`)
      .then((result) => {
        setEditDepartmentName(result.data.department_name);
        setEditManagerEmail(result.data.manager_email);
        setEditManagerPassword(result.data.manager_password);
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

    const url = `http://localhost:8085/api/Department/${editID}`;
    const updatedData = {
      department_name: editDepartmentName,
      manager_email: editManagerEmail,
      manager_password: editManagerPassword,
    };

    axios
      .put(url, updatedData)
      .then((result) => {
        toast.success("Department has been updated");
        getData(); // Refresh the data
        setShow(false); // Close the modal
      })
      .catch((error) => {
        toast.error("Department updating failed");
      });
  };

  const handleSave = () => {
    const url = "http://localhost:8085/api/Department";
    const newData = {
      department_name: departmentName,
      manager_email: managerEmail,
      manager_password: managerPassword,
    };
    axios
      .post(url, newData)
      .then((result) => {
        getData();
        clear();
        toast.success("Department has been added");
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  const clear = () => {
    setDepartmentName("");
    setManagerEmail("");
    setManagerPassword("");

    setEditDepartmentName("");
    setEditManagerEmail("");
    setEditManagerPassword("");
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
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const handleCloseDeleteModal = () => setShowDeleteModal(false);
  const handleShowDeleteModal = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (deleteId) {
      axios
        .delete(`http://localhost:8085/api/Department/${deleteId}`)
        .then((result) => {
          if (result.status === 200) {
            toast.success("Department has been deleted");
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
                    <h1 className="text-darkblue">Create Department</h1> <hr />{" "}
                    <br />
                    <label>Department Name</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Department Name"
                      value={departmentName}
                      onChange={(e) => setDepartmentName(e.target.value)}
                      required
                    />
                    <br />
                    <label>Manager Email</label>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="Manager Email"
                      value={managerEmail}
                      onChange={(e) => setManagerEmail(e.target.value)}
                      required
                    />
                    <br />
                    <label>Manager Password</label>
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Manager Password"
                      value={managerPassword}
                      onChange={(e) => setManagerPassword(e.target.value)}
                      required
                    />
                    <br />
                    <button
                      className="btn btn-primary custom-darkblue-button"
                      onClick={handleSave}
                    >
                      Create
                    </button>{" "}
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
                    <h1 className="text-darkblue">Departments</h1>{" "}
                    <hr />
                    <Table>
                      <thead>
                        <tr>
                          <th>Department Name</th>
                          <th>Manager Email</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentItems.map((item, index) => (
                          <tr key={index}>
                            <td>{item.department_name}</td>
                            <td>{item.manager_email}</td>
                            <td>
                              <button
                                className="btn btn-primary custom-darkblue-button"
                                onClick={() => handleEdit(item.id)}
                              >
                                <FontAwesomeIcon icon={faPencil} />
                              </button>
                              &nbsp;
                              <button
                                className="btn btn-danger"
                                onClick={() => handleShowDeleteModal(item.id)}
                              >
                                <FontAwesomeIcon icon={faTrash} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                    <div>
                      <button
                        className="btn"
                        onClick={prevPage}
                        disabled={currentPage === 0}
                      >
                        {"<"}
                      </button>
                      &nbsp;
                      <span>
                        {currentPage + 1} / {totalPages}
                      </span>
                      &nbsp;
                      <button
                        className="btn custom-darkblue-button"
                        onClick={nextPage}
                        disabled={currentPage === totalPages - 1}
                      >
                        {">"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <Modal show={show} onHide={handleClose}>
              <Modal.Header closeButton>
                <Modal.Title className="text-darkblu">
                  Update Department
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Row>
                  <Col>
                    <label>Department Name</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Department Name"
                      value={editDepartmentName}
                      onChange={(e) => setEditDepartmentName(e.target.value)}
                    ></input>
                  </Col>
                  <Col>
                    <label>Manager Email</label>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="Manager Email"
                      value={editManagerEmail}
                      onChange={(e) => setEditManagerEmail(e.target.value)}
                    ></input>
                  </Col>
                </Row>
                <br />
                <label>Manager Password</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Manager Password"
                  value={editManagerPassword}
                  onChange={(e) => setEditManagerPassword(e.target.value)}
                ></input>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                  Close
                </Button>
                <Button variant="primary" onClick={handleUpdate}>
                  Save Changes
                </Button>
              </Modal.Footer>
            </Modal>

            <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
              <Modal.Header closeButton>
                <Modal.Title>Delete Confirmation</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                Are you sure you want to delete this department?
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseDeleteModal}>
                  Close
                </Button>
                <Button variant="danger" onClick={confirmDelete}>
                  Delete
                </Button>
              </Modal.Footer>
            </Modal>
          </Col>
        </Row>
      </div>
    </Fragment>
  );
};

export default Department;
