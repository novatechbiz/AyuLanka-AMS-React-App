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
      },
      successModalOpen: false,  // Initialize success modal state
      errorModalOpen: false,    // Initialize error modal state
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
    // Assuming deleteLeaveApplication is implemented to handle API request
    deleteLeaveApplication(leaveId).then(() => {
      this.setState(prevState => ({
        leaveApplications: prevState.leaveApplications.filter(leave => leave.id !== leaveId)
      }));
      this.handleSuccessOpen("Leave application deleted successfully.");
    }).catch(error => {
      console.error("Error deleting leave application:", error);
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
    const { isEditing, currentLeave } = this.state;
  
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
          },
          isEditing: false
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
            },
          }));
          this.handleSuccessOpen("Leave application submitted successfully.");
        })
        .catch((error) => {
          console.error("Error creating leave application:", error);
          this.handleErrorOpen("Failed to create leave application.");
        });
    }
  };

  formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-md-4">
            <h2 className="apply-leave-header">Apply for Leave</h2>
            <form onSubmit={this.handleSubmit}>
              {/* Form Fields */}
              <div className="form-group">
                <label htmlFor="employeeId">Employee</label>
                <select
                  className="form-control"
                  name="employeeId"
                  value={this.state.currentLeave.employeeId}
                  onChange={this.handleInputChange}
                  required
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
                <label htmlFor="leaveTypeId">Leave Type</label>
                <select
                  className="form-control"
                  name="leaveTypeId"
                  value={this.state.currentLeave.leaveTypeId}
                  onChange={this.handleInputChange}
                  required
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
                <label htmlFor="noOfDays">Number of Days</label>
                <input
                  type="number"
                  className="form-control"
                  name="noOfDays"
                  value={this.state.currentLeave.noOfDays}
                  onChange={this.handleInputChange}
                  placeholder="Number of Days"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="fromDate">From Date</label>
                <input
                  type="date"
                  className="form-control"
                  name="fromDate"
                  value={this.state.currentLeave.fromDate}
                  onChange={this.handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="toDate">To Date</label>
                <input
                  type="date"
                  className="form-control"
                  name="toDate"
                  value={this.state.currentLeave.toDate}
                  onChange={this.handleInputChange}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary">Apply</button>
            </form>
          </div>
          <div className="col-md-8">
            <h2 className="leaves-header">Applied Leaves</h2>
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Leave Type</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Days</th>
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
        {/* Success modal */}
        <ModalComponent show={this.state.successModalOpen} onClose={this.handleSuccessClose}  type="success" />

        {/* Error modal */}
        <ModalComponent show={this.state.errorModalOpen} onClose={this.handleErrorClose}  type="error" />

        {/* <ConfirmationModal
                isOpen={isConfirmModalOpen}
                onClose={() => setIsConfirmModalOpen(false)}
                onConfirm={handleDelete}
            /> */}
      </div>
    );
  }
}

export default ApplyLeave;
