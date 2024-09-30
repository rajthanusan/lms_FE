import React, { useState, useEffect, Fragment, useCallback } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import { Paginator } from "primereact/paginator";
import Navbar from "../common/navbar";

const Employees = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(4);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [department, setDepartment] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteEmployeeId, setDeleteEmployeeId] = useState(null);

  const username = sessionStorage.getItem("loggedInDepartmentManager")
    ? JSON.parse(sessionStorage.getItem("loggedInDepartmentManager")).username
    : "";

  // Memoize the getData function
  const getData = useCallback(() => {
    if (!department) {
      toast.error("No department specified.");
      return;
    }

    axios
      .get("https://lms-be-beta.vercel.app/api/User", {
        params: { department }, // Pass department as a query parameter
      })
      .then((result) => {
        setData(result.data);
      })
      .catch((error) => {
        console.log("Error fetching user data:", error);
        toast.error("Error fetching user data.");
      });
  }, [department]);

  // Fetch department on component mount
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
  }, [username]); // This effect runs once when the component mounts

  // Fetch employee data once department is available
  useEffect(() => {
    if (department) {
      getData();
    }
  }, [department, getData]); // Include getData in the dependency array

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const filteredData = Array.isArray(data)
  ? data.filter((item) =>
      item.username.toLowerCase().includes(searchTerm.toLowerCase())
    )
  : [];

const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);
  const onPageChange = (event) => {
    setCurrentPage(event.page + 1);
  };

  const handleDetails = (employee) => {
    setSelectedEmployee(employee);
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  const handleCloseDeleteModal = () => setShowDeleteModal(false);

  const handleShowDeleteModal = (id) => {
    setDeleteEmployeeId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (deleteEmployeeId) {
      axios
        .delete(`https://lms-be-beta.vercel.app/api/User/delete/${deleteEmployeeId}`)
        .then((result) => {
          if (result.status === 200) {
            toast.success("Employee has been deleted");
            getData(); // Re-fetch employee data after deletion
          }
        })
        .catch((error) => {
          toast.error(error.message);
        });
    }
  };

  return (
    <Fragment>
      <Navbar manager username={username} />
      <Container className="my-5">
        <ToastContainer />
        <h1 className="text-darkblue">Employees</h1>
        <hr />
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search by mail"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <h5>{department || ""} Employees</h5>{" "}
          {/* Display department */}
        </div>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Name</th>
              <th>Birth date</th>
              <th>Joined date</th>
              <th>Email</th>
              <th>Department</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentRows.map((item, index) => (
              <tr key={index}>
                <td>{item.name}</td>
                <td>{new Date(item.birthday).toLocaleDateString()}</td>
                <td>{new Date(item.joindate).toLocaleDateString()}</td>

                <td>{item.username}</td>
                <td>{item.department}</td>
                <td>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleShowDeleteModal(item.id)}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                  <button
                    className="btn btn-primary ms-2 custom-darkblue-button"
                    onClick={() => handleDetails(item)}
                  >
                    <FontAwesomeIcon icon={faCircleInfo} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <Paginator
  first={indexOfFirstRow}
  rows={rowsPerPage}
  totalRecords={filteredData.length}
  onPageChange={onPageChange}
  className="custom-paginator" // Add your custom class here
/>
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title className="text-darkblue">
              Employee Details
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedEmployee && (
              <div>
                <h5>{selectedEmployee.name}</h5>
                <p>
                  Birth date:{" "}
                  {new Date(selectedEmployee.birthday).toLocaleDateString()}
                </p>
                <p>
                  Joined date:{" "}
                  {new Date(selectedEmployee.joindate).toLocaleDateString()}
                </p>

                <p>Email: {selectedEmployee.username}</p>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Deletion</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to delete this employee?
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseDeleteModal}>
              Cancel
            </Button>
            <Button variant="danger" onClick={confirmDelete}>
              Delete
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </Fragment>
  );
};

export default Employees;
