import React, { useState, useEffect } from "react";
import { fetchPatientSearch, fetchPatientProfile } from "../../../services/patientApi";
import "./patientProfile.css";

const PatientProfile = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // 🔍 Search for patients
  const handleSearch = async (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value.length < 3) {
      setSearchResults([]);
      return;
    }

    try {
      setIsLoading(true);
      const results = await fetchPatientSearch(value);
      setSearchResults(results);
    } catch (error) {
      console.error("Error fetching patients:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 👤 Load patient profile
  const handleSelectPatient = async (patientId) => {
    try {
      setIsLoading(true);
      const profile = await fetchPatientProfile(patientId);
      setSelectedPatient(profile);
      setSearchResults([]); // hide results after select
      setSearchTerm(profile.name); // show selected name in input
    } catch (error) {
      console.error("Error loading profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="patient-profile-container">
      <h2 className="report-heading">Patient Profile</h2>

      {/* Search bar */}
      <div className="patient-search">
        <input
          type="text"
          placeholder="Search by name or contact number..."
          value={searchTerm}
          onChange={handleSearch}
          className="search-input"
        />
        {isLoading && <div className="loading-text">Loading...</div>}

        {/* Search result dropdown */}
        {searchResults.length > 0 && (
          <ul className="search-results">
            {searchResults.map((p) => (
              <li key={p.id} onClick={() => handleSelectPatient(p.id)}>
                {p.name} - {p.contactNo}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Patient details */}
      {selectedPatient && (
        <div className="patient-details">
          <h3>General Details</h3>
          <table className="details-table">
            <tbody>
              <tr><td><b>Name</b></td><td>{selectedPatient.name}</td></tr>
              <tr><td><b>Contact No</b></td><td>{selectedPatient.contactNo}</td></tr>
              <tr><td><b>Gender</b></td><td>{selectedPatient.gender}</td></tr>
              <tr><td><b>Date of Birth</b></td><td>{selectedPatient.dateOfBirth?.split('T')[0]}</td></tr>
              <tr><td><b>Address</b></td><td>{selectedPatient.address}</td></tr>
            </tbody>
          </table>

          <h3>Medical History</h3>
          <table className="report-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Treatments</th>
                <th>Time</th>
                <th>Remarks</th>
              </tr>
            </thead>
            <tbody>
              {selectedPatient.medicalHistory?.length > 0 ? (
                selectedPatient.medicalHistory.map((h) => (
                  <tr key={h.id}>
                    <td>{h.scheduleDate.split("T")[0]}</td>
                    <td>{h.treatments.join(", ")}</td>
                    <td>{h.fromTime} - {h.toTime}</td>
                    <td>{h.remarks}</td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={4}>No medical history found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PatientProfile;
