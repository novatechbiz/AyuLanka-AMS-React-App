import React from "react";
import "./user.css";
import ModalComponent from "../modalComponent/modalComponent";

function UserTemplate(props) {
  const {
    submitAttempted,
    currentUser,
    handleInputChange,
    handleSubmit,
    isEditing,
    shiftMasters,
    employmentTypes,
    designations,
    users,
    successModalOpen,
    handleSuccessClose,
    errorModalOpen,
    handleErrorClose
  } = props;

  console.log("Submit Attempted:", submitAttempted);

  // Helper function to check if the field should show an error border
  const shouldShowError = (field) => {
    const isEmpty = !currentUser[field];
    const shouldShow = isEmpty && submitAttempted;
    console.log(`Field: ${field}, Empty: ${isEmpty}, Show Error: ${shouldShow}`);
    return shouldShow;
  };

  return (
    <div className="container">
      <div className="row user-content">
        <div className="col-md-4 form-column">
          <h2 className="edit-create-header">{isEditing ? "Edit Employee" : "Create Employee"}</h2>
          <form onSubmit={handleSubmit}>
            {[
              { id: "fullName", label: "Full Name" },
              { id: "callingName", label: "Calling Name" },
              { id: "employeeNumber", label: "Employee Number" },
              { id: "address", label: "Address" },
              { id: "nic", label: "NIC" },
              { id: "joinedDate", label: "Joined Date", type: "date" },
              { id: "shiftMasterId", label: "Shift", type: "select", options: shiftMasters, optionLabelFields: ['fromTime', 'toTime'] },
              { id: "employmentTypeId", label: "Employment Type", type: "select", options: employmentTypes, optionLabelField: 'name' },
              { id: "designationId", label: "Designation", type: "select", options: designations, optionLabelField: 'name' },
              { id: "username", label: "Username" }
            ].map((field) => (
              <div key={field.id} className="form-group">
                <label htmlFor={field.id}>{field.label} <span className="required-star">*</span></label>
                {field.type === 'select' ? (
                  <select
                    className={`form-control ${shouldShowError(field.id) ? 'error-border' : ''}`}
                    id={field.id}
                    name={field.id}
                    value={currentUser[field.id]}
                    onChange={handleInputChange}
                  >
                    <option value="">--Select--</option>
                    {field.options.map((option) => (
                      <option key={option.id} value={option.id}>
                        {field.optionLabelFields ? field.optionLabelFields.map(f => option[f]).join(' - ') : option[field.optionLabelField]}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type || "text"}
                    className={`form-control ${shouldShowError(field.id) ? 'error-border' : ''}`}
                    id={field.id}
                    name={field.id}
                    value={currentUser[field.id]}
                    onChange={handleInputChange}
                  />
                )}
              </div>
            ))}
            {!isEditing && (
              <div className="form-group">
                <label htmlFor="password">Password <span className="required-star">*</span></label>
                <input
                  type="password"
                  className={`form-control ${shouldShowError('password') ? 'error-border' : ''}`}
                  id="password"
                  name="password"
                  value={currentUser.password}
                  onChange={handleInputChange}
                  required={!isEditing}
                />
              </div>
            )}
            <button type="submit" className="btn btn-primary btn-block">
              {isEditing ? "Update" : "Create"}
            </button>
          </form>
        </div>
        <div className="col-md-7 table-column">
          <h2 className="employees-header">Employees</h2>
          <div className="table-scrollable">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>NIC</th>
                  <th className="actions">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.employeeNumber} - {user.callingName}</td>
                    <td>{user.nic}</td>
                    <td className="actions">
                      <button
                        className="btn btn-sm btn-success"
                        onClick={() => props.editUser(user)}
                        style={{ backgroundColor: '#28a745' }}
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
      </div>
      {/* Success modal */}
      <ModalComponent show={successModalOpen} onClose={handleSuccessClose} type="success" />
      {/* Error modal */}
      <ModalComponent show={errorModalOpen} onClose={handleErrorClose} type="error" />
    </div>
  );
}

export default UserTemplate;
