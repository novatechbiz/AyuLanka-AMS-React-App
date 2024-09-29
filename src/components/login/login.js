import React, { useState } from "react";
import template from "./login.jsx";
import { login_api } from "../../services/userManagementApi.js";
import { jwtDecode } from 'jwt-decode';

class login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      permissionId: 1,
      error: null,
      showErrorToast: false,
      showSuccessToast: false,
      errorMessageToast: "",
      successMessageToast: "",
      redirectToMain: false, // Flag to trigger the redirection
      loading: false, // Flag to indicate loading state
    };
  }

  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState({
      [name]: value,
    });
  };

  handleFormSubmit = async (event) => {
    event.preventDefault();
    const { username, password } = this.state;

    // Set loading to true to show loading spinner
    this.setState({ loading: true });

    try {
      const formData = {
        username: username,
        password: password
      };

      const response = await login_api(formData);

        if (response.token) {
          // Decode the JWT to extract user details
          const decoded = jwtDecode(response.token);
          console.log("Decoded JWT:", decoded);

          if (decoded.userId && decoded.fullName && decoded.designationCode) {
            sessionStorage.setItem('exp', decoded.exp);
            sessionStorage.setItem('userId', decoded.userId);
            sessionStorage.setItem('fullName', decoded.fullName);
            sessionStorage.setItem('designationCode', decoded.designationCode);

            this.setState({
              showSuccessToast: true,
              successMessageToast: "Login successful!",
              redirectToMain: true,
              loading: false,
            });
          } else {
            throw new Error("Necessary user details not found in token");
          }
        } else {
          throw new Error("No token received, authorization failed.");
        }
      } catch (error) {
        let errorMessage = "Error occurred while processing the request.";
        if (error.response && error.response.status === 401) {
          errorMessage = "Unauthorized access. Please check your username and password.";
        } else if (error.message) {
          errorMessage = error.message;
        }

        this.setState({
          showErrorToast: true,
          errorMessageToast: errorMessage,
          loading: false,
        });
      }
  };

  render() {
    return template.call(this);
  }
}

export default login;
