import React, { useState } from "react";
import { Link } from "react-router-dom";
import './sideBar.css';

const Sidebar = () => {
  const [menuState, setMenuState] = useState({
    user: false,
    leaves: false,
    roster: false,
  });

  const toggleMenu = (menu) => {
    setMenuState(prevState => ({
      ...prevState,
      [menu]: !prevState[menu]
    }));
  };

  return (
    <div className="sidebar">
      <h2 className="sidebar-heading">Menu</h2>
      <ul>
        <li className={menuState.user ? 'active' : ''}>
          <span onClick={() => toggleMenu('user')}>User</span>
          {menuState.user && (
            <ul>
              <li>
                <Link to="/">Create/Update Users</Link>
              </li>
            </ul>
          )}
        </li>
        <li className={menuState.leaves ? 'active' : ''}>
          <span onClick={() => toggleMenu('leaves')}>Leaves</span>
          {menuState.leaves && (
            <ul>
              <li>
                <Link to="/apply-leave">Create/Update/Delete Leaves</Link>
              </li>
            </ul>
          )}
        </li>
        <li className={menuState.roster ? 'active' : ''}>
          <span onClick={() => toggleMenu('roster')}>Roster</span>
          {menuState.roster && (
            <ul>
              <li>
                <Link to="/employee-roster">Create Roster</Link>
              </li>
              <li>
                <Link to="/update-roster">Update Roster</Link>
              </li>
              <li>
                <Link to="/approve-roster">Approve Roster</Link>
              </li>
              <li>
                <Link to="/view-roster">View Roster</Link>
              </li>
              <li>
                <Link to="/change-dayoff">Change Day Off</Link>
              </li>
              <li>
                <Link to="/approve-dayoff">Approve Change Day Off</Link>
              </li>
              <li>
                <Link to="/change-shift">Change Shift</Link>
              </li>
              <li>
                <Link to="/approve-shift">Approve Change Shift</Link>
              </li>
            </ul>
          )}
        </li>
        <li>
          <Link to="/appoinment-schedular">Appointment Scheduler</Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
