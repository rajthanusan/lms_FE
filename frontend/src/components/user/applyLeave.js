import React, { useState, useEffect, Fragment } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from "react-bootstrap/Container";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from "../common/navbar";
import { Calendar } from 'primereact/calendar';
import { Card } from 'primereact/card';

const ApplyLeave = () => {
    const [leave, setLeave] = useState('')
    const [startdate, setStartdate] = useState('')
    const [enddate, setEnddate] = useState('')
    const [comments, setComments] = useState('')
    const [, setData] = useState([]);
    const [additionalData, setAdditionalData] = useState([]);
    const [errors, setErrors] = useState({});

    const loggedInUser = sessionStorage.getItem('loggedInUser');
    const username = loggedInUser ? JSON.parse(loggedInUser).username : '';

    useEffect(() => {
        getData();
    }, [])

    useEffect(() => {
        axios.get('http://localhost:8085/api/Leavetype')
            .then((result) => {
                setAdditionalData(result.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    const getData = () => {
        axios.get('http://localhost:8085/api/Leaveapply')
            .then((result) => {
                setData(result.data)
            })
            .catch((error) => {
                console.log(error)
            })
    }

    const handleSave = () => {
        const validationErrors = {};
        let isValid = true;

        if (!leave) {
            validationErrors.leave = 'Please select a leave type.';
            isValid = false;
        }

        if (!startdate) {
            validationErrors.startdate = 'Please select a start date.';
            isValid = false;
        }

        if (!enddate) {
            validationErrors.enddate = 'Please select an end date.';
            isValid = false;
        }

        if (!comments) {
            validationErrors.comments = 'Please provide comments.';
            isValid = false;
        }

        if (!isValid) {
            setErrors(validationErrors);
            return;
        }

        const url = 'http://localhost:8085/api/Leaveapply';
        const data = {
            "leave": leave,
            "startdate": new Date(startdate).toISOString().split('T')[0],
            "enddate": new Date(enddate).toISOString().split('T')[0],
            "comments": comments,
            "username": username,
            "status": "pending"
        }
        axios.post(url, data)
            .then((result) => {
                getData();
                clear();
                toast.success('Leave request has been created');
                setErrors({});
            })
            .catch((error) => {
                toast.error(error);
            })
    }

    const clear = () => {
        setLeave('');
        setStartdate('');
        setEnddate('');
        setComments('');
    }

    return (
        <Fragment>
            <Navbar user />
            <ToastContainer /> <br />
            <Container>
            <div className="container pt-5">
  <div className="row row-grid align-items-center">
    {/* Image Section */}
    <div className="col-12 col-md-5 col-lg-6 text-center">
      <figure className="w-100">
        <img
          src="https://media.licdn.com/dms/image/C4D12AQH3moW8i3ewrw/article-cover_image-shrink_600_2000/0/1628589993746?e=2147483647&v=beta&t=x0r-d-0VMlcRA_l3hQGm6RBCel5ZrQrV1KkIE6N167g"
          alt="Leave Management"
          className="img-fluid mw-md-120"
        />
      </figure>
    </div>

    {/* Form Section */}
    <div className="col-12 col-md-7 col-lg-6">
      <Card className="p-3 shadow-lg rounded bg-light registration-card">
        <h1 className="text-center mb-4 text-darkblue">Apply For Leave</h1>
        <hr />
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
        >
          <div className="mb-3">
            <label className="form-label">Leave Type</label>
            {additionalData.length > 0 ? (
              <select
                className="form-select"
                value={leave}
                onChange={(e) => setLeave(e.target.value)}
              >
                <option value="">--Select Leave Type--</option>
                {additionalData.map((item) => (
                  <option key={item.id} value={item.leave_type_name}>
                    {item.leave_type_name}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                className="form-control"
                placeholder="Leave Type"
                value={leave}
                onChange={(e) => setLeave(e.target.value)}
              />
            )}
            {errors.leave && <div className="text-danger">{errors.leave}</div>}
          </div>

          <div className="row mb-3">
            <div className="col">
              <span className="p-float-label">
                <Calendar
                  id="startdate"
                  value={startdate}
                  onChange={(e) => setStartdate(e.target.value)}
                  dateFormat="dd/mm/yy"
                  showIcon
                />
                <label htmlFor="startdate">Start date</label>
              </span>
              {errors.startdate && <div className="text-danger">{errors.startdate}</div>}
            </div>
            <div className="col">
              <span className="p-float-label">
                <Calendar
                  id="enddate"
                  value={enddate}
                  onChange={(e) => setEnddate(e.target.value)}
                  dateFormat="dd/mm/yy"
                  showIcon
                />
                <label htmlFor="enddate">End date</label>
              </span>
              {errors.enddate && <div className="text-danger">{errors.enddate}</div>}
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Request Comments</label>
            <textarea
              className="form-control"
              placeholder="Comments"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              rows={2}
            />
            {errors.comments && <div className="text-danger">{errors.comments}</div>}
          </div>
          <button type="submit" className="custom-darkblue-button btn btn-primary w-100">
            Create
          </button>
        </form>
      </Card>
    </div>
  </div>
</div>

            </Container>
        </Fragment>
    )
}

export default ApplyLeave;
