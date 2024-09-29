// import React, { useState, useEffect } from 'react';
// //import { fetchEmployees, createAttendance, fetchAttendances, deleteAttendance } from "../../services/attendanceManagementApi.js"; // Adjust the path as necessary
// import ModalComponent from "../modalComponent/modalComponent.jsx";
// import { ConfirmationModal } from "../confirmationModal/confirmationModal.jsx";
// // import * as XLSX from 'xlsx';
// import "./manageAttendance.css";

// const ManageAttendance = () => {
//   const [employees, setEmployees] = useState([]);
//   const [attendances, setAttendances] = useState([]);
//   const [successModalOpen, setSuccessModalOpen] = useState(false);
//   const [errorModalOpen, setErrorModalOpen] = useState(false);
//   const [submitAttempted, setSubmitAttempted] = useState(false);
//   const [confirmModalOpen, setConfirmModalOpen] = useState(false);
//   const [attendanceToDelete, setAttendanceToDelete] = useState(null);

//   useEffect(() => {
//     fetchEmployeesData();
//     fetchAttendancesData();
//   }, []);

//   const fetchAttendancesData = () => {
//     fetchAttendances()
//       .then(data => setAttendances(data))
//       .catch(error => console.error("Error fetching attendances:", error));
//   };

//   const fetchEmployeesData = () => {
//     fetchEmployees()
//       .then(data => setEmployees(data))
//       .catch(error => console.error("Error fetching employees:", error));
//   };

//   const handleFileUpload = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       parseDatFile(file);
//     }
//   };

//   const parseDatFile = (file) => {
//     const reader = new FileReader();
//     reader.onload = (event) => {
//       const fileContent = event.target.result;
//       const parsedData = processDatFile(fileContent);
//       insertParsedData(parsedData);
//       convertToExcel(parsedData);
//     };
//     reader.readAsText(file);
//   };

//   const processDatFile = (fileContent) => {
//     const lines = fileContent.split('\n');
//     const parsedData = lines.map(line => {
//       const [employeeId, date, status] = line.split(',');
//       return { employeeId, date, status };
//     });
//     return parsedData;
//   };

//   const insertParsedData = (parsedData) => {
//     fetch('/api/attendance', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(parsedData),
//     })
//       .then(response => response.json())
//       .then(data => {
//         console.log('Success:', data);
//         fetchAttendancesData();
//       })
//       .catch((error) => {
//         console.error('Error:', error);
//       });
//   };

//   const convertToExcel = (parsedData) => {
//     const worksheet = XLSX.utils.json_to_sheet(parsedData);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");
//     XLSX.writeFile(workbook, 'attendance_data.xlsx');
//   };

//   const handleDeleteAttendance = (attendanceId) => {
//     setConfirmModalOpen(true);
//     setAttendanceToDelete(attendanceId);
//   };

//   const confirmDeleteAttendance = () => {
//     deleteAttendance(attendanceToDelete).then(() => {
//       setAttendances(prevAttendances => prevAttendances.filter(att => att.id !== attendanceToDelete));
//       setConfirmModalOpen(false);
//       setAttendanceToDelete(null);
//       setSuccessModalOpen(true);
//     }).catch(error => {
//       console.error("Error deleting attendance:", error);
//       setConfirmModalOpen(false);
//       setAttendanceToDelete(null);
//       setErrorModalOpen(true);
//     });
//   };

//   return (
//     <div className="container">
//       <div className="row">
//         <div className="col-md-4">
//           <h2 className="upload-header">Upload Attendance Data</h2>
//           <input type="file" onChange={handleFileUpload} />
//         </div>
//         <div className="col-md-8">
//           <h2 className="attendance-header">Uploaded Attendances</h2>
//           <div className="table-scrollable">
//             <table className="table table-striped">
//               <thead>
//                 <tr>
//                   <th>Employee</th>
//                   <th>Date</th>
//                   <th>Status</th>
//                   <th>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {attendances.map((attendance, index) => (
//                   <tr key={index}>
//                     <td>{attendance.employee ? attendance.employee.fullName : ''}</td>
//                     <td>{attendance.date}</td>
//                     <td>{attendance.status}</td>
//                     <td>
//                       <button className="btn btn-danger btn-sm" onClick={() => handleDeleteAttendance(attendance.id)}>Delete</button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//       <ModalComponent show={successModalOpen} onClose={() => setSuccessModalOpen(false)} type="success" />
//       <ModalComponent show={errorModalOpen} onClose={() => setErrorModalOpen(false)} type="error" />
//       <ConfirmationModal
//         isOpen={confirmModalOpen}
//         onClose={() => setConfirmModalOpen(false)}
//         onConfirm={confirmDeleteAttendance}
//         headerMessage="Confirm Deletion"
//         bodyMessage="Are you sure you want to delete this attendance record?"
//       />
//     </div>
//   );
// };

// export default ManageAttendance;
