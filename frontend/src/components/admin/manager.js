import React, { useState, useEffect, Fragment } from "react";
import Table from "react-bootstrap/Table";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Dropdown from "react-bootstrap/Dropdown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil, faTrash } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../common/navbar";

const Manager = () => {
  const [show, setShow] = useState(false);
  const [department, setDepartment] = useState("");
  const [editID, setEditId] = useState("");
  const [editDepartment, setEditDepartment] = useState("");
  const [editUsername, setEditUsername] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [editName, setEditName] = useState("");
  const [editLandline, setEditLandline] = useState(""); // For landline
  const [editHandphone, setEditHandphone] = useState(""); // For handphone
  const [data, setData] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [landline, setLandline] = useState("");
  const [handphone, setHandphone] = useState("");

  useEffect(() => {
    getData();
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await axios.get("https://lms-be-beta.vercel.app/api/AllDepartment");
      setDepartments(response.data);
    } catch (error) {
      console.error("Failed to fetch departments", error);
      toast.error("Failed to load departments");
    }
  };

  const getData = () => {
    axios
      .get("https://lms-be-beta.vercel.app/api/Manager")
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
      .get(`https://lms-be-beta.vercel.app/api/Manager/${id}`)
      .then((result) => {
        setEditDepartment(result.data.department);
        setEditUsername(result.data.username);
        setEditPassword(result.data.password);
        setEditName(result.data.name);
        setEditLandline(result.data.landline || "");
        setEditHandphone(result.data.handphone || "");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleUpdate = () => {
    if (!editID || !editUsername || !editName || !editHandphone) {
      toast.error("All fields are required");
      return;
    }

    const url = `https://lms-be-beta.vercel.app/api/Manager/${editID}`;
    const data = {
      username: editUsername,
      password: editPassword,
      name: editName,
      department: editDepartment,
      landline: editLandline || null,
      handphone: editHandphone,
    };

    axios
      .put(url, data)
      .then(() => {
        toast.success("Manager has been updated");
        getData(); // Refresh data
        clear(); // Clear form fields
        setShow(false); // Close modal
      })
      .catch((error) => {
        console.error("Error during update:", error);
        toast.error("Manager updating failed");
      });
  };

  const handleSave = () => {
    const url = "https://lms-be-beta.vercel.app/api/crmanager";
    const data = {
      username: username,
      password: password,
      name: name,
      landline: landline,
      handphone: handphone,
      department: department,
      role: "manager",
    };

    axios
      .post(url, data)
      .then(() => {
        getData();
        clear();
        toast.success("Manager has been added");
      })
      .catch((error) => {
        toast.error("Failed to add manager");
      });
  };

  const clear = () => {
    setDepartment("");
    setEditDepartment("");
    setEditId("");
    setUsername("");
    setPassword("");
    setName("");
    setLandline("");
    setHandphone("");
    setEditUsername("");
    setEditPassword("");
    setEditName("");
    setEditLandline("");
    setEditHandphone("");
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
        .delete(`https://lms-be-beta.vercel.app/api/Manager/${deleteId}`)
        .then(() => {
          toast.success("Manager has been deleted");
          getData();
          handleCloseDeleteModal();
        })
        .catch((error) => {
          toast.error("Failed to delete manager");
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
                    <h1 className="text-darkblue">Register Manager</h1> <hr />
                    <br />
                    <label>Email</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Mail Address"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                    <br />
                    <label>Password</label>
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <br />
                    <label>Name</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                    <br />
                    <label>Landline (Optional)</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Landline (Optional)"
                      value={landline}
                      onChange={(e) => setLandline(e.target.value)}
                    />
                    <br />
                    <label>Handphone</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Handphone"
                      value={handphone}
                      onChange={(e) => setHandphone(e.target.value)}
                      required
                    />
                    <br />
                    <label>Department</label>
                    <Dropdown
                      onToggle={() => setDropdownOpen(!dropdownOpen)}
                      className="mb-3"
                    >
                      <Dropdown.Toggle
                        className="form-control"
                        variant="light"
                        id="dropdown-basic"
                      >
                        {department || "Select Department"}
                      </Dropdown.Toggle>

                      <Dropdown.Menu show={dropdownOpen}>
                        {departments.length > 0 ? (
                          departments.map((dept, index) => (
                            <Dropdown.Item
                              key={index}
                              onClick={() => {
                                setDepartment(dept);
                                setDropdownOpen(false);
                              }}
                            >
                              {dept}
                            </Dropdown.Item>
                          ))
                        ) : (
                          <Dropdown.Item disabled>
                            No departments available
                          </Dropdown.Item>
                        )}
                      </Dropdown.Menu>
                    </Dropdown>
                    <br />
                    <Button
                      className="btn btn-primary custom-darkblue-button"
                      onClick={handleSave}
                    >
                      Create
                    </Button>
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
                    <Table responsive>
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Department</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentItems.map((item, index) => (
                          <tr key={index}>
                            <td>{item.name}</td>
                            <td>{item.username}</td>
                            <td>{item.department}</td>
                            <td>
                                                            <button className="btn btn-primary custom-darkblue-button" onClick={() => handleEdit(item.id)}><FontAwesomeIcon icon={faPencil} /></button>&nbsp;
                                                            <button className="btn btn-danger" onClick={() => handleShowDeleteModal(item.id)}><FontAwesomeIcon icon={faTrash} /></button>
                                                        </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                    <div>
                                            <button className="btn" onClick={prevPage} disabled={currentPage === 0}>{"<"}</button>
                                            &nbsp;<span>{currentPage + 1} / {totalPages}</span>&nbsp;
                                            <button className="btn custom-darkblue-button" onClick={nextPage} disabled={currentPage === totalPages - 1}>{">"}</button>
                                        </div>
                  </div>
                </div>
              </div>
            </div>
          </Col>
        </Row>

        <Modal show={show} onHide={() => setShow(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Manager</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <label>Email</label>
            <input
              type="text"
              className="form-control"
              placeholder="Mail Address"
              value={editUsername}
              onChange={(e) => setEditUsername(e.target.value)}
            />
            <br />
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Password"
              value={editPassword}
              onChange={(e) => setEditPassword(e.target.value)}
            />
            <br />
            <label>Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="Name"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
            />
            <br />
            <label>Landline (Optional)</label>
            <input
              type="text"
              className="form-control"
              placeholder="Landline (Optional)"
              value={editLandline}
              onChange={(e) => setEditLandline(e.target.value)}
            />
            <br />
            <label>Handphone</label>
            <input
              type="text"
              className="form-control"
              placeholder="Handphone"
              value={editHandphone}
              onChange={(e) => setEditHandphone(e.target.value)}
              required
            />
            <br />
            <label>Department</label>
            <Dropdown
              onToggle={() => setDropdownOpen(!dropdownOpen)}
              className="mb-3"
            >
              <Dropdown.Toggle
                className="form-control"
                variant="light"
                id="dropdown-basic"
              >
                {editDepartment || "Select Department"}
              </Dropdown.Toggle>

              <Dropdown.Menu show={dropdownOpen}>
                {departments.length > 0 ? (
                  departments.map((dept, index) => (
                    <Dropdown.Item
                      key={index}
                      onClick={() => {
                        setEditDepartment(dept);
                        setDropdownOpen(false);
                      }}
                    >
                      {dept}
                    </Dropdown.Item>
                  ))
                ) : (
                  <Dropdown.Item disabled>No departments available</Dropdown.Item>
                )}
              </Dropdown.Menu>
            </Dropdown>
            <br />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShow(false)}>
              Close
            </Button>
            <Button variant="primary custom-darkblue-button" onClick={handleUpdate}>
              Update
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
          <Modal.Header closeButton>
            <Modal.Title>Delete Manager</Modal.Title>
          </Modal.Header>
          <Modal.Body>Are you sure you want to delete this manager?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseDeleteModal}>
              Cancel
            </Button>
            <Button variant="danger" onClick={confirmDelete}>
              Delete
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </Fragment>
  );
};

export default Manager;
