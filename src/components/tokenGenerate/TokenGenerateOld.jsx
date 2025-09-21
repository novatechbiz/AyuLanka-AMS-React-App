// import React, { useState } from "react";
// import { Modal } from "react-bootstrap";

// const TokenGenerate = () => {
//     const [selectedToken, setSelectedToken] = useState(null);
//     const [showModal, setShowModal] = useState(false);

//     // Read values from env
//     const rows = Number(process.env.REACT_APP_TOTAL_ROWS) || 15;
//     const cols = Number(process.env.REACT_APP_TOKENS_PER_ROW) || 10;
//     const totalTokens = rows * cols;

//     const handleTokenClick = (tokenNumber) => {
//         setSelectedToken(tokenNumber);
//         setShowModal(true);
//     };

//     const renderTokens = () => {
//         const tokenLayout = [];
//         let tokenNumber = 1;

//         for (let r = 0; r < rows; r++) {
//             tokenLayout.push(
//                 <div className="row mb-2" key={r}>
//                     {Array.from({ length: cols }, (_, c) => {
//                         if (tokenNumber > totalTokens) return null;
//                         const current = tokenNumber++;
//                         return (
//                             <div
//                                 className="col d-flex justify-content-center"
//                                 key={current}
//                             >
//                                 <button
//                                     className="btn btn-success w-100"
//                                     onClick={() => handleTokenClick(current)}
//                                 >
//                                     {current}
//                                 </button>
//                             </div>
//                         );
//                     })}
//                 </div>
//             );
//         }
//         return tokenLayout;
//     };

//     return (
//         <div className="p-4">
//             <h2 className="text-xl font-bold mb-4">
//                 Generate Tokens
//             </h2>
//             {renderTokens()}

//             <Modal
//                 isOpen={modalIsOpen}
//                 onRequestClose={closeModalAndReset}
//                 className="Modal custom-modal"
//                 closeTimeoutMS={300}
//                 overlayClassName="Overlay"
//                 contentLabel="Create Appointment"
//             >
//                 <div className="modal-dialog modal-lg">
//                     <div className="modal-content custom-modal-content">
//                         <div className="modal-header custom-modal-header">
//                             <div className="container-fluid">
//                                 <div className="row">
//                                     <div className="col-10">
//                                         <h5 className="modal-title-appointment custom-modal-title-appointment">Create Appointment at <span style={{ color: 'green', fontWeight: 'bold' }}>{selectedResource.name || ''}</span></h5>
//                                     </div>
//                                     <div className="col-2 text-right">
//                                         <button type="button" className="close custom-close" onClick={closeModalAndReset}>
//                                             <span>&times;</span>
//                                         </button>
//                                     </div>
//                                 </div>
//                                 <div className='row'>
//                                     <div className='col-md-4 col-sm-4'>
//                                         <button onClick={openDayOffsModal} className="btn btn-warning">Day Offs</button>
//                                     </div>
//                                     <div className='col-md-4 col-sm-4'>
//                                         <button onClick={openLeavesModal} className="btn btn-warning">Leaves</button>
//                                     </div>
//                                     <div className='col-md-4 col-sm-4'>
//                                         <button onClick={openShiftsModal} className="btn btn-warning">Shifts</button>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>

//                         <NotificationComponent
//                             message={notification.message}
//                             type={notification.type}
//                             onClose={() => setNotification({ message: '', type: '' })}
//                         />
//                         <form onSubmit={handleSubmit} className="modal-appoinment-body modal-body custom-modal-body">
//                             <div className="container-fluid">
//                                 <div className="row">
//                                     <div className="col-md-6 form-group">
//                                         <label htmlFor="customerName">Customer Name <span className="text-danger">*</span></label>
//                                         <input
//                                             className={`form-control ${formErrors.customerName ? 'is-invalid' : ''}`}
//                                             type="text"
//                                             id="customerName"
//                                             name="customerName"
//                                             value={appointmentData.customerName}
//                                             onChange={handleInputChange} required
//                                         />
//                                     </div>
//                                     <div className="col-md-6 form-group">
//                                         <label htmlFor="contactNo">Contact Number <span className="text-danger">*</span></label>
//                                         <input className={`form-control ${formErrors.contactNo ? 'is-invalid' : ''}`} type="text" id="contactNo" name="contactNo" value={appointmentData.contactNo} onChange={handleInputChange} required />
//                                     </div>
//                                 </div>
//                                 <div className="row">
//                                     <div className="col-md-12 col-sm-12 form-group">
//                                         <label htmlFor="treatmentTypeId">Treatment Type(s) <span className="text-danger">*</span></label>
//                                         <Autocomplete
//                                             multiple
//                                             options={treatmentTypes}
//                                             getOptionLabel={(option) =>
//                                                 option.treatmentShortCode
//                                                     ? `${option.name} - ${option.treatmentShortCode}`
//                                                     : option.name
//                                             } // Adjust based on your data structure
//                                             value={treatmentTypes.filter(type => appointmentData.treatmentTypeId.includes(type.id))} // Selected values
//                                             onChange={(event, value) => handleMultipleTreatmentTypeChange(event, value)} // Pass the selected values directly
//                                             renderInput={(params) => (
//                                                 <TextField
//                                                     {...params}
//                                                     variant="outlined"
//                                                     error={!!formErrors.treatmentTypeId}
//                                                     required
//                                                 />
//                                             )}
//                                         />
//                                     </div>
//                                     {/* <div className="col-md-6 col-sm-6 form-group">
//                             <label htmlFor="scheduleDate">Schedule Date <span className="text-danger">*</span></label><br/>
//                             <DatePicker className={`form-control ${formErrors.scheduleDate ? 'is-invalid' : ''}`} selected={appointmentData.scheduleDate} onChange={(date) => handleDateChange('scheduleDate', date)} dateFormat="MMMM d, yyyy" />
//                         </div> */}
//                                 </div>
//                                 <div className='row'>
//                                     <div className="col-md-6 col-sm-6 form-group">
//                                         <label htmlFor="scheduleDate">Schedule Date <span className="text-danger">*</span></label><br />
//                                         <DatePicker className={`form-control ${formErrors.scheduleDate ? 'is-invalid' : ''}`} selected={appointmentData.scheduleDate} onChange={(date) => handleDateChange('scheduleDate', date)} dateFormat="MMMM d, yyyy" />
//                                     </div>
//                                     <div className="col-md-3 col-sm-3 form-group">
//                                         <label htmlFor="startTime">Start Time <span className="text-danger">*</span></label><br />
//                                         <DatePicker
//                                             className="form-control"
//                                             selected={startTime}
//                                             onChange={(date) => handleTimeChange(date, 'startTime')}
//                                             showTimeSelect
//                                             showTimeSelectOnly
//                                             timeIntervals={15}
//                                             timeCaption="Time"
//                                             dateFormat="h:mm aa"
//                                         />
//                                     </div>
//                                     <div className="col-md-3 col-sm-3 form-group">
//                                         <label htmlFor="endTime">End Time <span className="text-danger">*</span></label><br />
//                                         <DatePicker
//                                             className="form-control"
//                                             selected={endTime}
//                                             onChange={(date) => handleTimeChange(date, 'endTime')}
//                                             showTimeSelect
//                                             showTimeSelectOnly
//                                             timeIntervals={15}
//                                             timeCaption="Time"
//                                             dateFormat="h:mm aa"
//                                         />
//                                     </div>
//                                 </div>
//                                 <div className="row">
//                                     <div className="col-md-6 form-group">
//                                         <label htmlFor="employeeId">Employee</label>
//                                         <select className={`form-control ${formErrors.employeeId ? 'is-invalid' : ''}`} id="employeeId" name="employeeId" value={appointmentData.employeeId} onChange={handleInputChange} required>
//                                             <option value="">Select an Employee</option>
//                                             {employees.map(emp => <option key={emp.id} value={emp.id}>{emp.employeeNumber} - {emp.callingName}</option>)}
//                                         </select>
//                                     </div>
//                                     <div className="col-md-3 col-sm-3 form-group">
//                                         <label htmlFor="actualStartTime">Actual Start Time</label><br />
//                                         <DatePicker
//                                             className="form-control"
//                                             selected={actualStartTime}
//                                             onChange={(date) => handleActualTimeChange(date, 'actualStartTime')}
//                                             showTimeSelect
//                                             showTimeSelectOnly
//                                             timeIntervals={15}
//                                             timeCaption="Time"
//                                             dateFormat="h:mm aa"
//                                         />
//                                     </div>
//                                     <div className="col-md-3 col-sm-3 form-group">
//                                         <label htmlFor="actualEndTime">Actual End Time</label><br />
//                                         <DatePicker
//                                             className="form-control"
//                                             selected={actualEndTime}
//                                             onChange={(date) => handleActualTimeChange(date, 'actualEndTime')}
//                                             showTimeSelect
//                                             showTimeSelectOnly
//                                             timeIntervals={15}
//                                             timeCaption="Time"
//                                             dateFormat="h:mm aa"
//                                         />
//                                     </div>
//                                 </div>
//                                 <div className="row">
//                                     <div className="col-md-6 form-group">
//                                         <label htmlFor="secondaryEmployeeId">Secondary Employee</label>
//                                         <select className={`form-control ${formErrors.secondaryEmployeeId ? 'is-invalid' : ''}`} id="secondaryEmployeeId" name="secondaryEmployeeId" value={appointmentData.secondaryEmployeeId} onChange={handleInputChange}>
//                                             <option value="">Select an Employee</option>
//                                             {employees.map(emp => <option key={emp.id} value={emp.id}>{emp.employeeNumber} - {emp.callingName}</option>)}
//                                         </select>
//                                     </div>
//                                     <div className="col-md-3 col-sm-3 form-group">
//                                         <label htmlFor="actualSecondStartTime">Actual Start Time</label><br />
//                                         <DatePicker
//                                             className="form-control"
//                                             selected={actualSecondStartTime}
//                                             onChange={(date) => handleActualSecondTimeChange(date, 'actualSecondStartTime')}
//                                             showTimeSelect
//                                             showTimeSelectOnly
//                                             timeIntervals={15}
//                                             timeCaption="Time"
//                                             dateFormat="h:mm aa"
//                                         />
//                                     </div>
//                                     <div className="col-md-3 col-sm-3 form-group">
//                                         <label htmlFor="actualSecondEndTime">Actual End Time</label><br />
//                                         <DatePicker
//                                             className="form-control"
//                                             selected={actualSecondEndTime}
//                                             onChange={(date) => handleActualSecondTimeChange(date, 'actualSecondEndTime')}
//                                             showTimeSelect
//                                             showTimeSelectOnly
//                                             timeIntervals={15}
//                                             timeCaption="Time"
//                                             dateFormat="h:mm aa"
//                                         />
//                                     </div>
//                                 </div>
//                                 <div className="row">
//                                     <div className="col-md-6 form-group">
//                                         <label htmlFor="doctorEmployeeId">Doctor</label>
//                                         <select className={`form-control ${formErrors.doctorEmployeeId ? 'is-invalid' : ''}`} id="doctorEmployeeId" name="doctorEmployeeId" value={appointmentData.doctorEmployeeId} onChange={handleInputChange}>
//                                             <option value="">Select a Doctor</option>
//                                             {doctors.map(emp => <option key={emp.id} value={emp.id}>{emp.employeeNumber} - {emp.callingName}</option>)}
//                                         </select>
//                                     </div>
//                                     <div className="col-md-6 form-group">
//                                         <label htmlFor="tokenNo">Token Number</label>
//                                         <input className="form-control" type="text" id="tokenNo" name="tokenNo" value={appointmentData.tokenNo} onChange={handleInputChange} />
//                                     </div>

//                                 </div>
//                                 {/* New Remark Field */}
//                                 <div className="row">
//                                     <div className="col-md-12 form-group">
//                                         <label htmlFor="remarks">Remarks</label>
//                                         <textarea
//                                             className="form-control"
//                                             id="remarks"
//                                             name="remarks"
//                                             value={appointmentData.remarks}
//                                             onChange={handleInputChange}
//                                             rows="2"  // Number of visible rows in textarea
//                                             placeholder="Enter any remarks or additional information"
//                                         />
//                                     </div>
//                                 </div>
//                                 <div className="custom-modal-footer row">
//                                     {/* <div className="col-6 p-2">
//                             <button className="btn btn-danger" onClick={closeModal}>Delete</button>
//                         </div> */}
//                                     <div className="col-6 p-2">
//                                         <button onClick={closeModal} className="btn btn-danger">Delete</button>
//                                     </div>
//                                     <div className="col-6 p-2">
//                                         <button onClick={handleSubmit} className="btn btn-success">Save</button>
//                                     </div>
//                                 </div>
//                             </div>
//                         </form>

//                     </div>
//                 </div>
//             </Modal>
//         </div>
//     );
// };

// export default TokenGenerate;
