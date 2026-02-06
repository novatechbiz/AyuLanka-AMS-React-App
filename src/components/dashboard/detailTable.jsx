const DetailTable = ({ data }) => (
    <div className="card p-3 mt-4">
      <h5>Appointment Details</h5>
  
      <table className="table table-striped table-bordered">
        <thead>
          <tr>
            <th>Customer Name</th>
            <th>Mobile No</th>
            <th>Treatments</th>
            <th>Employee</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx}>
              <td>{row.customerName}</td>
              <td>{row.contactNo}</td>
              <td>{row.treatments.join(', ')}</td>
              <td>{row.employeeName}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  export default DetailTable;