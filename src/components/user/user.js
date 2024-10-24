import React from "react";
import UserTemplate from "./user.jsx";
import "./user.css";
import { fetchUsers, createUser, updateUser, fetchShiftMasters, fetchDesignations, fetchEmploymentTypes } from "../../services/userManagementApi.js"; // Adjust the path as necessary

class User extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      shiftMasters: [],
      employmentTypes: [],
      designations: [],
      currentUser: {
        id: null,
        fullName: "",
        callingName: "",
        employeeNumber: "",
        address: "",
        nic: "",
        joinedDate: "",
        shiftMasterId: "",
        employmentTypeId: "",
        designationId: "",
        username: "",
        password: "",
      },
      isEditing: false,
      successModalOpen: false,
      errorModalOpen: false,
      submitAttempted: false,
    };
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

  componentDidMount() {
    this.fetchUsers();
    this.fetchShiftMasters();
    this.fetchEmploymentTypes();
    this.fetchDesignations();
  }

  fetchUsers = () => {
    fetchUsers()
      .then((data) => this.setState({ users: data }))
      .catch((error) => console.error("Error fetching users:", error));
  };

  fetchShiftMasters = () => {
    fetchShiftMasters()
      .then((data) => this.setState({ shiftMasters: data }))
      .catch((error) => console.error("Error fetching shift masters:", error));
  };

  fetchEmploymentTypes = () => {
    fetchEmploymentTypes()
      .then((data) => this.setState({ employmentTypes: data }))
      .catch((error) => console.error("Error fetching employment types:", error));
  };

  fetchDesignations = () => {
    fetchDesignations()
      .then((data) => this.setState({ designations: data }))
      .catch((error) => console.error("Error fetching designations:", error));
  };

  fetchUsers = () => {
    fetchUsers()
      .then((data) => this.setState({ users: data }))
      .catch((error) => console.error("Error fetching users:", error));
  };

  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState((prevState) => ({
      currentUser: {
        ...prevState.currentUser,
        [name]: value,
      },
    }));
  };

  handleSubmit = (event) => {
    event.preventDefault();
    console.log("Form Submitted"); 
    this.setState({ submitAttempted: true }); // Ensure this is set every time the form is submitted
    const { isEditing, currentUser } = this.state;
    if (this.validateForm(currentUser)) { // Use the validateForm function to check the form data
      if (isEditing) {
        this.updateUser(currentUser);
      } else {
        this.createUser(currentUser);
      }
    } else {
      console.error("Validation failed");
    }
  };
  
  validateForm = (user) => {
    // Ensure that all required fields are filled
    const isValid = user.fullName && user.address && user.nic && user.joinedDate &&
    user.shiftMasterId && user.employmentTypeId && user.designationId &&
    user.username && (user.password || this.state.isEditing);
    console.log("Form validation status:", isValid);
    return isValid;
  };

  createUser = (user) => {
    createUser(user)
      .then((data) => {
        this.setState((prevState) => ({
          users: [...prevState.users, data],
          currentUser: {
            id: null, fullName: "", address: "", nic: "", joinedDate: "",
            shiftMasterId: "", employmentTypeId: "", designationId: "",
            username: "", password: "",
          },
          successModalOpen: true, // Open success modal on successful creation
        }));
      })
      .catch((error) => {
        console.error("Error creating user:", error);
        this.handleErrorOpen(); // Open error modal on error
      });
  };
  
  updateUser = (user) => {
    updateUser(user)
      .then((data) => {
        this.setState((prevState) => ({
          users: prevState.users.map(usr => usr.id === data.id ? data : usr),
          currentUser: {
            id: null, fullName: "", address: "", nic: "", joinedDate: "",
            shiftMasterId: "", employmentTypeId: "", designationId: "",
            username: "", password: "",
          },
          isEditing: false,
          successModalOpen: true, // Open success modal on successful update
        }));
      })
      .catch((error) => {
        console.error("Error updating user:", error);
        this.handleErrorOpen(); // Open error modal on error
      });
  };

  editUser = (user) => {
    const formattedDate = user.joinedDate ? new Date(user.joinedDate).toISOString().split('T')[0] : '';
    this.setState({
      currentUser: {
        ...user,
        password: '',
        joinedDate: formattedDate, // Ensure the date is formatted as 'YYYY-MM-DD'
      },
      isEditing: true,
    });
  };
  
  

  render() {
    return (
      <UserTemplate
        users={this.state.users}
        currentUser={this.state.currentUser}
        isEditing={this.state.isEditing}
        handleInputChange={this.handleInputChange}
        handleSubmit={this.handleSubmit}
        editUser={this.editUser}
        shiftMasters={this.state.shiftMasters}
        employmentTypes={this.state.employmentTypes}
        designations={this.state.designations}
        successModalOpen={this.state.successModalOpen}
        handleSuccessClose={this.handleSuccessClose}
        errorModalOpen={this.state.errorModalOpen}
        handleErrorClose={this.handleErrorClose}
        submitAttempted={this.state.submitAttempted}
      />
    );
  }
}

export default User;
