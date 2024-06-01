import React from "react";
import "./user.css"; // Make sure the path is correct
import ModalComponent from "../modalComponent/modalComponent";

function UserTemplate(props) {
  console.log(props)
  return (
    <div className="container">
      <div className="row user-content">
      <div className="col-md-4 form-column">
  <h2 className="edit-create-header">{props.isEditing ? "Edit Employee" : "Create Employee"}</h2>

  <form onSubmit={props.handleSubmit}>
    <div className="form-group">
      <label htmlFor="fullName">Full Name</label>
      <input
        type="text"
        className="form-control"
        id="fullName"
        name="fullName"
        value={props.currentUser.fullName}
        onChange={props.handleInputChange}
        placeholder="e.g., John Doe"
        required
      />
    </div>
    <div className="form-group">
      <label htmlFor="address">Address</label>
      <input
        type="text"
        className="form-control"
        id="address"
        name="address"
        value={props.currentUser.address}
        onChange={props.handleInputChange}
        placeholder="e.g., 1234 Main St, City"
        required
      />
    </div>
    <div className="form-group">
      <label htmlFor="nic">NIC</label>
      <input
        type="text"
        className="form-control"
        id="nic"
        name="nic"
        value={props.currentUser.nic}
        onChange={props.handleInputChange}
        placeholder="e.g., 123456789V"
        required
      />
    </div>
    <div className="form-group">
      <label htmlFor="joinedDate">Joined Date</label>
      <input
        type="date"
        className="form-control"
        id="joinedDate"
        name="joinedDate"
        value={props.currentUser.joinedDate}
        onChange={props.handleInputChange}
        required
      />
    </div>
    <div className="form-group">
      <label htmlFor="shiftMasterId">Shift</label>
      <select
        className="form-control"
        id="shiftMasterId"
        name="shiftMasterId"
        value={props.currentUser.shiftMasterId}
        onChange={props.handleInputChange}
        required
      >
        <option value="">--Select--</option>
        {props.shiftMasters.map((shift) => (
          <option key={shift.id} value={shift.id}>
            {shift.fromTime} - {shift.toTime}
          </option>
        ))}
      </select>
    </div>
    <div className="form-group">
      <label htmlFor="employmentTypeId">Employment Type</label>
      <select
        className="form-control"
        id="employmentTypeId"
        name="employmentTypeId"
        value={props.currentUser.employmentTypeId}
        onChange={props.handleInputChange}
        required
      >
        <option value="">--Select--</option>
        {props.employmentTypes.map((type) => (
          <option key={type.id} value={type.id}>
            {type.name}
          </option>
        ))}
      </select>
    </div>
    <div className="form-group">
      <label htmlFor="designationId">Designation</label>
      <select
        className="form-control"
        id="designationId"
        name="designationId"
        value={props.currentUser.designationId}
        onChange={props.handleInputChange}
        required
      >
        <option value="">--Select--</option>
        {props.designations.map((designation) => (
          <option key={designation.id} value={designation.id}>
            {designation.name}
          </option>
        ))}
      </select>
    </div>
    <div className="form-group">
      <label htmlFor="username">Username</label>
      <input
        type="text"
        className="form-control"
        id="username"
        name="username"
        value={props.currentUser.username}
        onChange={props.handleInputChange}
        placeholder="e.g., john.doe"
        required
      />
    </div>
    {!props.isEditing && (
        <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
                type="password"
                className="form-control"
                id="password"
                name="password"
                value={props.currentUser.password}
                onChange={props.handleInputChange}
                placeholder="e.g., ••••••••"
                required={!props.isEditing}
            />
        </div>
    )}
    <button type="submit" className="btn btn-primary btn-block">
      {props.isEditing ? "Update" : "Create"}
    </button>
  </form>
</div>

        <div className="col-md-7 table-column">
          <h2 className="employees-header">Employees</h2>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Full Name</th>
                <th>NIC</th>
                <th className="actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              {props.users.map((user) => (
                <tr key={user.id}>
                  <td>{user.fullName}</td>
                  <td>{user.nic}</td>
                  <td className="actions">
                    <button style={{backgroundColor:'#28a745'}}
                      className="btn btn-sm btn-success"
                      onClick={() => props.editUser(user)}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
        {/* Success modal */}
        <ModalComponent show={props.successModalOpen} onClose={props.handleSuccessClose} type="success" />

        {/* Error modal */}
        <ModalComponent show={props.errorModalOpen} onClose={props.handleErrorClose} type="error" />
    </div>
  );
}

export default UserTemplate;
