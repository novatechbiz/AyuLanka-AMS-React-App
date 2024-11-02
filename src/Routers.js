import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

import Login from "./components/login";
import Sidebar from "./components/sideBar/sideBar";
import User from "./components/user/user";
import ApplyLeave from "./components/leave/applyLeave";
import EmployeeRoster from "./components/employeeRoster/employeeRoster";
import AppointmentScheduler from "./components/appointmentScheduler/appointmentScheduler";
import UpdateRoster from "./components/updateRoster/updateRoster";
import ChangeDayOff from "./components/changeDayOff/changeDayOff";
import ApproveRoster from "./components/approveRoster/approveRoster";
import ViewRoster from "./components/viewRoster/viewRoster";
import ApproveDayOff from "./components/approveDayOff/approveDayOff";
import ChangeShift from "./components/changeShift/changeShift";
import ApproveShift from "./components/approveShift/approveShift";
import ManageAttendance from "./components/attendance/manageAttendance";
import Logout from "./components/logout/logout";
import AppointmentReport from "./components/appointmentReport/appointmentReport";

const Layout = ({ children }) => {
  const location = useLocation();
  const isLoginPage = location.pathname === "/";

  return (
    <div className="app-container">
      {!isLoginPage && <Sidebar />}
      <div className={`main-content ${isLoginPage ? 'full-width' : ''}`}>
        {children}
      </div>
    </div>
  );
};

const Routers = () => {
  return (
      <Layout>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/user" element={<User />} />
          <Route path="/apply-leave" element={<ApplyLeave />} />
          <Route path="/attendance-upload" element={<ManageAttendance />} />
          <Route path="/employee-roster" element={<EmployeeRoster />} />
          <Route path="/appoinment-schedular" element={<AppointmentScheduler />} />
          <Route path="/update-roster" element={<UpdateRoster />} />
          <Route path="/approve-roster" element={<ApproveRoster />} />
          <Route path="/view-roster" element={<ViewRoster />} />
          <Route path="/change-dayoff" element={<ChangeDayOff />} />
          <Route path="/approve-dayoff" element={<ApproveDayOff />} />
          <Route path="/change-shift" element={<ChangeShift />} />
          <Route path="/approve-shift" element={<ApproveShift />} />
          <Route path="/appointment-report" element={<AppointmentReport />} />
          <Route path="/logout" element={<Logout />} />
        </Routes>
      </Layout>
  );
};

export default Routers;
