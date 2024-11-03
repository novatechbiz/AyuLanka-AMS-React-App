// src/api.js
import axios from "axios";

// Import URL from config file
const baseUrl = process.env.REACT_APP_API_BASEURL;
const sublink = process.env.REACT_APP_API_SUBLINK;

// Construct the base API URL
export const API_BASE_URL = `${baseUrl}${sublink}`;

// Create an Axios instance configured with the base URL
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Fetch Employees from the server
export const fetchEmployees = async () => {
  try {
    const response = await api.get("/employee");
    return response.data;  // Assuming the response data contains the array of employees
  } catch (error) {
    console.error("Error fetching employees:", error);
    throw error;  // Re-throw the error for further handling
  }
};

// Fetch treatment types from the server
export const fetchTreatmentTypes = async () => {
  try {
    const response = await api.get("/treatmenttype");
    return response.data;  // Assuming the response data contains the array of shifts
  } catch (error) {
    console.error("Error fetching treatment types:", error);
    throw error;
  }
};

// Fetch treatment locations from the server
export const fetchTreatmentLocations = async () => {
    try {
      const response = await api.get("/location");
      return response.data;  // Assuming the response data contains the array of shifts
    } catch (error) {
      console.error("Error fetching treatment locations:", error);
      throw error;
    }
  };

// Submit an Appointment to the server
export const addAppointment = async (appointment) => {
    try {
        const response = await api.post("/appointmentschedule", appointment);
        return response.data;  // Assuming the response data contains the details of the created appointment
    } catch (error) {
        console.error("Error creating appointment:", error);
        throw error;  // Re-throw the error for further handling
    }
};

export const fetchAppointmentDetails = async (id) => {
    try {
        const response = await api.get(`/appointmentschedule/${id}`);
        return response.data;  // Assuming the API returns an array of appointments
    } catch (error) {
        console.error("Error fetching appointments:", error);
        throw error;
    }
};

export const fetchEmployeeSchedule = async (id, scheduledate) => {
  try {
      const encodedDate = encodeURIComponent(scheduledate);
      const response = await api.get(`/staffroster/employeeschedule/${id}?scheduledate=${encodedDate}`);
      return response.data;  // Assuming the API returns the data or a clear message
  } catch (error) {
      if (error.response) {
          // Handle HTTP errors that are responded by the server
          console.error("Error fetching schedule:", error.response.data);
          if (error.response.status === 404) {
              // Handle not found error specifically
              alert(error.response.data); // Or show a notification
          }
      } else {
          // Handle errors in setting up the request or client side issues
          console.error("Error in request setup:", error.message);
      }
      throw error; // You can still throw the error to be handled by the caller or in global error handling
  }
};

export const fetchAppointments = async () => {
  try {
      const response = await api.get("/appointmentschedule");
      return response.data;  // Assuming the API returns an array of appointments
  } catch (error) {
      console.error("Error fetching appointments:", error);
      throw error;
  }
};

// Fetch treatment types from the server by location
export const fetchTreatmentTypesByLocation = async () => {
    try {
        const response = await api.get(`/treatmenttype`);
        return response.data;
    } catch (error) {
        console.error("Error fetching treatment types:", error);
        throw error;
    }
};

export const deleteAppointment = async (appointmentId) => {
  try {
      const response = await api.delete(`/appointmentschedule/${appointmentId}`);
      return response.data;  // Assuming the response data is the confirmation of deletion
  } catch (error) {
      console.error("Error deleting appointment:", error);
      if (error.response) {
          // Handle HTTP errors that are responded by the server
          console.error("Server responded with:", error.response.data);
          if (error.response.status === 404) {
              // Handle not found error specifically
              alert("Appointment not found."); // or use a more sophisticated error handling/notification system
          }
      } else {
          // Handle errors in setting up the request or client side issues
          console.error("Error in request setup:", error.message);
      }
      throw error; // Re-throw the error to allow calling code to handle it further if necessary
  }
};

export const fetchDayOffsData  = async (date) => {
  try {
      const response = await api.get(`/staffroster/getdayoffsbydate/${date}`);
      return response.data;  // Assuming the API returns an array of appointments
  } catch (error) {
      console.error("Error fetching day offs:", error);
      throw error;
  }
};

export const fetchAppoitmentByDate  = async (date) => {
  try {
      const response = await api.get(`/AppointmentSchedule/ByDate/${date}`);
      return response.data;  // Assuming the API returns an array of appointments
  } catch (error) {
      console.error("Error fetching day offs:", error);
      throw error;
  }
};

export const fetchAppointmentsByDateRange = async (startDate, endDate) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/appointmentschedule/bydaterange`, {
      params: {
        startDate: startDate.toISOString().substring(0, 10), // Format as YYYY-MM-DD
        endDate: endDate.toISOString().substring(0, 10)      // Format as YYYY-MM-DD
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching appointmentschedule:", error);
    throw error;
  }
};

export const fetchLeaveData   = async (date) => {
  try {
      const response = await api.get(`/staffleave/getleavesbydate/${date}`);
      return response.data;  // Assuming the API returns an array of appointments
  } catch (error) {
      console.error("Error fetching leaves:", error);
      throw error;
  }
};

export const fetchShiftsData   = async (date) => {
  try {
      const response = await api.get(`/staffroster/getworkingshiftssbydate/${date}`);
      return response.data;  // Assuming the API returns an array of appointments
  } catch (error) {
      console.error("Error fetching shifts:", error);
      throw error;
  }
};
