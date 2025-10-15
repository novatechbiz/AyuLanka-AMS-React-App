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
export const fetchAllLocations = async () => {
  try {
    const response = await api.get("/location");
    return response.data;  // Assuming the response data contains the array of shifts
  } catch (error) {
    console.error("Error fetching treatment locations:", error);
    throw error;
  }
};

export const fetchEliteCareTreatmentLocations = async () => {
  try {
    const response = await api.get("/location/elitecare");
    return response.data;  // Assuming the response data contains the array of shifts
  } catch (error) {
    console.error("Error fetching treatment locations:", error);
    throw error;
  }
};

// Fetch treatment locations from the server
export const fetchPrimeCareTreatmentLocations = async () => {
  try {
    const response = await api.get("/location/primecare");
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

export const deleteAppointment = async (appointmentId, userId, remark) => {
  try {
    const response = await api.delete(`/appointmentschedule/${appointmentId}?deletedByUserId=${userId}&remark=${remark}`);
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

export const fetchDayOffsData = async (date) => {
  try {
    const response = await api.get(`/staffroster/getdayoffsbydate/${date}`);
    return response.data;  // Assuming the API returns an array of appointments
  } catch (error) {
    console.error("Error fetching day offs:", error);
    throw error;
  }
};

export const fetchAppoitmentByDate = async (date) => {
  try {
    const response = await api.get(`/AppointmentSchedule/ByDate/${date}`);
    return response.data;  // Assuming the API returns an array of appointments
  } catch (error) {
    console.error("Error fetching day offs:", error);
    throw error;
  }
};

export const fetchPrimeCareAppoitmentByDate = async (date) => {
  try {
    const response = await api.get(`/AppointmentSchedule/ByDate/${date}`);
    return response.data;  // Assuming the API returns an array of appointments
  } catch (error) {
    console.error("Error fetching day offs:", error);
    throw error;
  }
};

export const fetchDeletedAppoitmentByDate = async (startDate, endDate) => {
  console.log(startDate, ' ', endDate)

  // Ensure startDate and endDate are valid Date objects
  const start = typeof startDate === "string" ? new Date(startDate) : startDate;
  const end = typeof endDate === "string" ? new Date(endDate) : endDate;
  try {
    const response = await axios.get(`${API_BASE_URL}/appointmentschedule/DeletedAppointmentsByDateRange`, {
      params: {
        startDate: start.toISOString().substring(0, 10), // Format as YYYY-MM-DD
        endDate: end.toISOString().substring(0, 10)      // Format as YYYY-MM-DD
      }
    });
    return response.data;  // Assuming the API returns an array of appointments
  } catch (error) {
    console.error("Error fetching day offs:", error);
    throw error;
  }
};

export const fetchAppointmentsByDateRange = async (startDate, endDate) => {
  console.log(startDate, ' ', endDate)

  // Ensure startDate and endDate are valid Date objects
  const start = typeof startDate === "string" ? new Date(startDate) : startDate;
  const end = typeof endDate === "string" ? new Date(endDate) : endDate;

  try {
    const response = await axios.get(`${API_BASE_URL}/appointmentschedule/bydaterange`, {
      params: {
        startDate: start.toISOString().substring(0, 10), // Format as YYYY-MM-DD
        endDate: end.toISOString().substring(0, 10)      // Format as YYYY-MM-DD
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching appointmentschedule:", error);
    throw error;
  }
};

const formatDate = (date) => {
  const d = new Date(date);
  const month = `${d.getMonth() + 1}`.padStart(2, "0");
  const day = `${d.getDate()}`.padStart(2, "0");
  const year = d.getFullYear();
  return `${year}-${month}-${day}`;
};

export const fetchPrimeCareAppointmentsByDateRange = async (startDate, endDate) => {
  console.log(startDate, ' ', endDate)

  // Ensure startDate and endDate are valid Date objects
  const start = formatDate(startDate);
  const end = formatDate(endDate);

  try {
    const response = await axios.get(`${API_BASE_URL}/appointmentschedule/primecarebydaterange`, {
      params: { startDate: start, endDate: end }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching appointmentschedule:", error);
    throw error;
  }
};

export const fetchTokensByDate = async (scheduledDate) => {
  console.log(scheduledDate)

  // Ensure startDate and endDate are valid Date objects
  const scDate = typeof scheduledDate === "string" ? new Date(scheduledDate) : scheduledDate;

  try {
    const response = await axios.get(`${API_BASE_URL}/appointmentschedule/tokensbydate`, {
      params: {
        date: scDate.toISOString().substring(0, 10),
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching appointmentschedule:", error);
    throw error;
  }
};

export const fetchIssuedTokens = async () => {
  try {
    const response = await api.get(`/appointmentschedule/issuedtokens`);
    return response.data;
  } catch (error) {
    console.error("Error fetching treatment types:", error);
    throw error;
  }
};

export const fetchAllAppointmentsByDateRange = async (startDate, endDate) => {
  console.log(startDate, ' ', endDate)

  // Ensure startDate and endDate are valid Date objects
  const start = typeof startDate === "string" ? new Date(startDate) : startDate;
  const end = typeof endDate === "string" ? new Date(endDate) : endDate;

  try {
    const response = await axios.get(`${API_BASE_URL}/appointmentschedule/getAllPreScheduledScheduledAppointments`, {
      params: {
        startDate: start.toISOString().substring(0, 10), // Format as YYYY-MM-DD
        endDate: end.toISOString().substring(0, 10)      // Format as YYYY-MM-DD
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching getAllPreScheduledScheduledAppointments:", error);
    throw error;
  }
};

export const fetchCompletedAppointmentsByDateRange = async (startDate, endDate) => {
  console.log(startDate, ' ', endDate)

  // Ensure startDate and endDate are valid Date objects
  const start = typeof startDate === "string" ? new Date(startDate) : startDate;
  const end = typeof endDate === "string" ? new Date(endDate) : endDate;

  try {
    const response = await axios.get(`${API_BASE_URL}/appointmentschedule/getCompletedPreScheduledScheduledAppointments`, {
      params: {
        startDate: start.toISOString().substring(0, 10), // Format as YYYY-MM-DD
        endDate: end.toISOString().substring(0, 10)      // Format as YYYY-MM-DD
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching getCompletedPreScheduledScheduledAppointments:", error);
    throw error;
  }
};

export const fetchLeaveData = async (date) => {
  try {
    const response = await api.get(`/staffleave/getleavesbydate/${date}`);
    return response.data;  // Assuming the API returns an array of appointments
  } catch (error) {
    console.error("Error fetching leaves:", error);
    throw error;
  }
};

export const fetchShiftsData = async (date) => {
  try {
    const response = await api.get(`/staffroster/getworkingshiftssbydate/${date}`);
    return response.data;  // Assuming the API returns an array of appointments
  } catch (error) {
    console.error("Error fetching shifts:", error);
    throw error;
  }
};
