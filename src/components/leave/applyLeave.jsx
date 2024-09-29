import React from "react";
import {
  fetchEmployees,
  fetchLeaveTypes,
  createLeaveApplication,
  fetchLeaveApplications,
  updateLeaveApplication,
  deleteLeaveApplication
} from "../../services/leaveManagementApi.js"; // Adjust the path as necessary
import ModalComponent from "../modalComponent/modalComponent.jsx";
import "./applyLeave.css";
import { ConfirmationModal } from "../confirmationModal/confirmationModal.jsx";

class ApplyLeave extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      employees: [],
      leaveTypes: [],
      leaveApplications: [], // Array to store the leave applications
      currentLeave: {
        employeeId: "",
        leaveTypeId: "",
        noOfDays: "",
        fromDate: "",
        toDate: "",
        halfDay: ""
      },
      successModalOpen: false,  // Initialize success modal state
      errorModalOpen: false,    // Initialize error modal state
      submitAttempted: false,
      confirmModalOpen: false,  // Track confirmation modal state
      leaveToDelete: null,      // Track the leave to be deleted
    };
  }

  fetchLeaveApplications = () => {
    fetchLeaveApplications()
      .then((data) => this.setState({ leaveApplications: data }))
      .catch((error) => console.error("Error fetching leave applications:", error));
  };

  componentDidMount() {
    this.fetchEmployees();
    this.fetchLeaveTypes();
    this.fetchLeaveApplications();
  }

  handleSuccessOpen = () => {
    this.setState({ successModalOpen: true });
  };
  
  handleSuccessClose = () => {
    this.setState({ successModalOpen: false });
  };
  
  handleErrorOpen = () => {
    this.setState({ errorModalOpen: true });
  };
  
  handleErrorClose = () => {
    this.setState({ errorModalOpen: false });
  };

  handleEditLeave = (leave) => {
    const formattedFromDate = leave.fromDate ? new Date(leave.fromDate).toISOString().split('T')[0] : '';
    const formattedToDate = leave.toDate ? new Date(leave.toDate).toISOString().split('T')[0] : '';
    this.setState({
      currentLeave: {
        ...leave,
        fromDate: formattedFromDate,
        toDate: formattedToDate,
      },
      isEditing: true
    });
  };

  handleDeleteLeave = (leaveId) => {
    this.setState({ confirmModalOpen: true, leaveToDelete: leaveId });
  };

  confirmDeleteLeave = () => {
    const { leaveToDelete } = this.state;
    deleteLeaveApplication(leaveToDelete).then(() => {
      this.setState(prevState => ({
        leaveApplications: prevState.leaveApplications.filter(leave => leave.id !== leaveToDelete),
        confirmModalOpen: false,
        leaveToDelete: null,
      }));
      this.handleSuccessOpen("Leave application deleted successfully.");
    }).catch(error => {
      console.error("Error deleting leave application:", error);
      this.setState({ confirmModalOpen: false, leaveToDelete: null });
      this.handleErrorOpen("Failed to delete leave application.");
    });
  };

  fetchEmployees = () => {
    fetchEmployees()
      .then((data) => this.setState({ employees: data }))
      .catch((error) => console.error("Error fetching employees:", error));
  };

  fetchLeaveTypes = () => {
    fetchLeaveTypes()
      .then((data) => this.setState({ leaveTypes: data }))
      .catch((error) => console.error("Error fetching leave types:", error));
  };

  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState((prevState) => ({
      currentLeave: {
        ...prevState.currentLeave,
        [name]: value,
      },
    }));
  };

  handleSubmit = (event) => {
    event.preventDefault();
    this.setState({ submitAttempted: true });

    const { isEditing, currentLeave } = this.state;
    if (this.validateForm(currentLeave)) { // Validate the form before submission
      if (isEditing) {
        updateLeaveApplication(currentLeave).then((updatedLeave) => {
          this.setState(prevState => ({
            leaveApplications: prevState.leaveApplications.map(leave =>
              leave.id === updatedLeave.id ? updatedLeave : leave
            ),
            currentLeave: {
              employeeId: "",
              leaveTypeId: "",
              noOfDays: "",
              fromDate: "",
              toDate: "",
              halfDay: "",
            },
            isEditing: false,
            submitAttempted: false,
          }));
          this.handleSuccessOpen("Leave application updated successfully.");
        }).catch(error => {
          console.error("Error updating leave application:", error);
          this.handleErrorOpen("Failed to update leave application.");
        });
      } else {
        createLeaveApplication(currentLeave)
          .then((newLeave) => {
            this.setState(prevState => ({
              leaveApplications: [...prevState.leaveApplications, newLeave],
              currentLeave: {
                employeeId: "",
                leaveTypeId: "",
                noOfDays: "",
                fromDate: "",
                toDate: "",
                halfDay: "",
              },
              submitAttempted: false,
            }));
            this.handleSuccessOpen("Leave application submitted successfully.");
          })
          .catch((error) => {
            console.error("Error creating leave application:", error);
            this.handleErrorOpen("Failed to create leave application.");
          });
      }
    } else {
      console.error("Validation failed");
    }
  };

  validateForm = (leave) => {
    const isValid = leave.employeeId && leave.leaveTypeId && leave.noOfDays && leave.fromDate && leave.toDate && (leave.noOfDays !== "0.5" || leave.halfDay);
    console.log("Form validation status:", isValid);
    return isValid;
  };

  formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  render() {
    const { currentLeave, submitAttempted, confirmModalOpen } = this.state;
    console.log('currentLeave', currentLeave)
    // Helper function to check if the field should show an error border
    const shouldShowError = (field) => {
      const isEmpty = !currentLeave[field];
      const shouldShow = isEmpty && submitAttempted;
      console.log(`Field: ${field}, Empty: ${isEmpty}, Show Error: ${shouldShow}`);
      return shouldShow;
    };

    return  (
      <div className="container">
        <div className="row">
          <div className="col-md-4">
            <h2 className="apply-leave-header">Apply for Leave</h2>
            <form onSubmit={this.handleSubmit}>
              {/* Form Fields */}
              <div className="form-group">
                <label htmlFor="employeeId">Employee <span className="required-star">*</span></label>
                <select
                  className={`form-control ${shouldShowError('employeeId') ? 'error-border' : ''}`}
                  name="employeeId"
                  value={currentLeave.employeeId}
                  onChange={this.handleInputChange}
                  disabled={this.state.isEditing}
                >
                  <option value="">Select Employee</option>
                  {this.state.employees.map((employee) => (
                    <option key={employee.id} value={employee.id}>
                      {employee.fullName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="leaveTypeId">Leave Type <span className="required-star">*</span></label>
                <select
                  className={`form-control ${shouldShowError('leaveTypeId') ? 'error-border' : ''}`}
                  name="leaveTypeId"
                  value={currentLeave.leaveTypeId}
                  onChange={this.handleInputChange}
                >
                  <option value="">Select Leave Type</option>
                  {this.state.leaveTypes.map((leaveType) => (
                    <option key={leaveType.id} value={leaveType.id}>
                      {leaveType.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="noOfDays">Number of Days <span className="required-star">*</span></label>
                <input
                  type="number"
                  className={`form-control ${shouldShowError('noOfDays') ? 'error-border' : ''}`}
                  name="noOfDays"
                  value={currentLeave.noOfDays}
                  onChange={this.handleInputChange}
                  placeholder="Number of Days"
                />
              </div>
              {/* Half-Day Selection */}
              {(currentLeave.noOfDays === 0.5 || currentLeave.noOfDays === "0.5") && (
                <div className="form-group">
                  <label htmlFor="halfDay">
                    Select Half Day <span className="required-star">*</span>
                  </label>
                  <select
                    className={`form-control ${
                      shouldShowError("halfDay") ? "error-border" : ""
                    }`}
                    name="halfDay"
                    value={currentLeave.halfDay}
                    onChange={this.handleInputChange}
                  >
                    <option value="">Select Time</option>
                    <option value="1">Morning</option>
                    <option value="2">Evening</option>
                  </select>
                </div>
              )}
              <div className="form-group">
                <label htmlFor="fromDate">From Date <span className="required-star">*</span></label>
                <input
                  type="date"
                  className={`form-control ${shouldShowError('fromDate') ? 'error-border' : ''}`}
                  name="fromDate"
                  value={currentLeave.fromDate}
                  onChange={this.handleInputChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="toDate">To Date <span className="required-star">*</span></label>
                <input
                  type="date"
                  className={`form-control ${shouldShowError('toDate') ? 'error-border' : ''}`}
                  name="toDate"
                  value={currentLeave.toDate}
                  onChange={this.handleInputChange}
                />
              </div>
              <button type="submit" className="btn btn-primary">Apply</button>
            </form>
          </div>
          <div className="col-md-8">
            <h2 className="leaves-header">Applied Leaves</h2>
            <div className="table-scrollable">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Leave Type</th>
                    <th>From</th>
                    <th>To</th>
                    <th>Days</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.leaveApplications.map((leave, index) => (
                    <tr key={index}>
                      <td>{leave.employee ? leave.employee.fullName : ''}</td>
                      <td>{leave.leaveType ? leave.leaveType.name : ''}</td>
                      <td>{this.formatDate(leave.fromDate)}</td>
                      <td>{this.formatDate(leave.toDate)}</td>
                      <td>{leave.noOfDays}</td>
                      <td>
                        <button className="btn btn-success btn-sm" style={{backgroundColor:'#28a745'}} onClick={() => this.handleEditLeave(leave)}>Edit</button>
                        <button className="btn btn-danger btn-sm" onClick={() => this.handleDeleteLeave(leave.id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        {/* Success modal */}
        <ModalComponent show={this.state.successModalOpen} onClose={this.handleSuccessClose}  type="success" />

        {/* Error modal */}
        <ModalComponent show={this.state.errorModalOpen} onClose={this.handleErrorClose}  type="error" />

        <ConfirmationModal
          isOpen={confirmModalOpen}
          onClose={() => this.setState({ confirmModalOpen: false, leaveToDelete: null })}
          onConfirm={this.confirmDeleteLeave}
          headerMessage="Confirm Deletion"
          bodyMessage="Are you sure you want to delete this leave application?"
        />
      </div>
    );
  }
}

export default ApplyLeave;
