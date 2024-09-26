import React from 'react'
import Navbar from './navbar'

export function Homebase() {
    return (
        <>
        <Navbar />
        <div className="container mt-5">
            <div className="row row-grid align-items-center">
                <div className="col-12 col-md-5 col-lg-6 order-md-2 text-center">
                    <figure className="w-100">
                        <img 
                            src="https://imconnect.in/wp-content/uploads/2024/04/imconnect-employee-location-tracking-app.gif" 
                            alt="Leave Management" 
                            className="img-fluid mw-md-120"
                        />
                    </figure>
                </div>
                <div className="col-12 col-md-7 col-lg-6 order-md-1 pr-md-5">
                    <h1 className="display-4 text-center text-md-left mb-3">
                        Welcome to <strong className="text-darkblue">Leave Management</strong>
                    </h1>
                    <p className="lead text-center text-md-left text-muted">
                        A comprehensive Leave Management System encompasses a range of essential features to streamline the leave management process effectively.
                    </p>

                    <div className="text-center text-md-left mt-5 ">
                        <a href="/home" className="btn btn-primary btn-icon custom-gold-button " style={{ pointerEvents: 'none' }}>
                            <span className="btn-inner--text ">Get started</span>
                            <span className="btn-inner--icon"><i data-feather="chevron-right"></i></span>
                        </a>
                        <a href="/home" className="btn btn-neutral btn-icon d-none d-lg-inline-block ml-2 " style={{ pointerEvents: 'none' }}>See Features</a>
                    </div>
                </div>
            </div>
        </div>
    </>
    );
}

export function Homeuser() {
    return (
        <>
            <Navbar user />
            <div className="container mt-5">
            <div className="row row-grid align-items-center">
                <div className="col-12 col-md-5 col-lg-6 order-md-2 text-center">
                    <figure className="w-100">
                        <img 
                            src="https://media.licdn.com/dms/image/C4D12AQH3moW8i3ewrw/article-cover_image-shrink_600_2000/0/1628589993746?e=2147483647&v=beta&t=x0r-d-0VMlcRA_l3hQGm6RBCel5ZrQrV1KkIE6N167g" 
                            alt="Leave Management" 
                            className="img-fluid mw-md-120"
                        />
                    </figure>
                </div>
                <div className="col-12 col-md-7 col-lg-6 order-md-1 pr-md-5">
                    <h1 className="display-4 text-center text-md-left mb-3">
                    Welcome <strong className="text-darkblue">Employee</strong>, to the Leave Management System.
                    </h1>
                    <p className="lead text-center text-md-left text-muted">
                    A well-rounded Leave Management System offers various features that help manage employee leave efficiently. Employees can easily submit leave requests, check their available leave balances, and monitor the status of their requests. 
                    </p>

                    <div className="text-center text-md-left mt-5">
                        <a href="/home" className="btn btn-primary btn-icon custom-gold-button" style={{ pointerEvents: 'none' }}>
                            <span className="btn-inner--text ">Get started</span>
                            <span className="btn-inner--icon"><i data-feather="chevron-right"></i></span>
                        </a>
                        <a href="/home" className="btn btn-neutral btn-icon d-none d-lg-inline-block ml-2" style={{ pointerEvents: 'none' }}>See Features</a>
                    </div>
                </div>
            </div>
        </div>
    </>
    );
}

export function Homeadmin() {
    return (
        <>
            <Navbar admin />
            <div className="container mt-5">
            <div className="row row-grid align-items-center">
                <div className="col-12 col-md-5 col-lg-6 order-md-2 text-center">
                    <figure className="w-100">
                        <img 
                            src="https://www.chawtechsolutions.com/wp-content/uploads/2019/03/developer-dribbble.gif" 
                            alt="Leave Management" 
                            className="img-fluid mw-md-120"
                        />
                    </figure>
                </div>
                <div className="col-12 col-md-7 col-lg-6 order-md-1 pr-md-5">
                    <h1 className="display-4 text-center text-md-left mb-3">
                    Welcome <strong className="text-darkblue">Admin</strong>, to the Leave Management System.
                    </h1>
                    <p className="lead text-center text-md-left text-muted">
                    The Leave Management System provides administrators with powerful tools to manage employee leave efficiently. Admins can oversee leave requests, track employee leave balances, and manage approvals or rejections, ensuring smooth operations and improved coordination across the organization.
                    </p>

                    <div className="text-center text-md-left mt-5">
                        <a href="/home" className="btn btn-primary btn-icon custom-gold-button" style={{ pointerEvents: 'none' }}>
                            <span className="btn-inner--text ">Get started</span>
                            <span className="btn-inner--icon"><i data-feather="chevron-right"></i></span>
                        </a>
                        <a href="/home" className="btn btn-neutral btn-icon d-none d-lg-inline-block ml-2" style={{ pointerEvents: 'none' }}>See Features</a>
                    </div>
                </div>
            </div>
        </div>
    </>
    );
}

export function HomeDepartmentManager() {
    return (
        <>
            <Navbar manager />
            <div className="container mt-5">
            <div className="row row-grid align-items-center">
                <div className="col-12 col-md-5 col-lg-6 order-md-2 text-center">
                    <figure className="w-100">
                        <img 
                            src="https://www.kanakkupillai.com/storage/273/about-image.gif" // Replace with a relevant image URL for department managers
                            alt="Leave Management" 
                            className="img-fluid mw-md-120"
                        />
                    </figure>
                </div>
                <div className="col-12 col-md-7 col-lg-6 order-md-1 pr-md-5">
                    <h1 className="display-4 text-center text-md-left mb-3">
                    Welcome <strong className="text-darkblue">Manager</strong>, to the Leave Management System.
                    </h1>
                    <p className="lead text-center text-md-left text-muted">
                    The Leave Management System provides department managers with a suite of tools to oversee and manage employee leave within their departments. Managers can review leave requests, approve or reject them, and keep track of their department's leave balances and reports.
                    </p>

                    <div className="text-center text-md-left mt-5">
                        <a href="/home" className="btn btn-primary btn-icon custom-gold-button" style={{ pointerEvents: 'none' }}>
                            <span className="btn-inner--text ">Get started</span>
                            <span className="btn-inner--icon"><i data-feather="chevron-right"></i></span>
                        </a>
                        <a href="/home" className="btn btn-neutral btn-icon d-none d-lg-inline-block ml-2" style={{ pointerEvents: 'none' }}>See Features</a>
                    </div>
                </div>
            </div>
        </div>
    </>
    );
}

export default function Home(props) {
    if (props.user) {
        return <Homeuser />;
    }
    if (props.admin) {
        return <Homeadmin />;
    }
    if (props.departmentManager) {
        return <HomeDepartmentManager />;
    }
    else {
        return <Homebase />;
    }
}
