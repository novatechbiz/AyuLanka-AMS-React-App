const CreateCustomerModal = ({
    show,
    customerName,
    phone,
    setPhone,
    loading,
    onClose,
    onCreate
  }) => {
    if (!show) return null;
  
    return (
      <>
        <div className="modal fade show d-block" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
  
              <div className="modal-header bg-success text-white">
                <h5 className="modal-title">Create New Customer</h5>
                <button className="btn-close btn-close-white" onClick={onClose} />
              </div>
  
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Customer Name</label>
                  <input className="form-control" value={customerName} disabled />
                </div>
  
                <div className="mb-3">
                  <label className="form-label">
                    Contact Number <span className="text-danger">*</span>
                  </label>
                  <input
                    className="form-control"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>
  
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={onClose}>
                  Cancel
                </button>
                <button
                  className="btn btn-success"
                  disabled={!phone || loading}
                  onClick={onCreate}
                >
                  {loading ? "Creating..." : "Create Customer"}
                </button>
              </div>
  
            </div>
          </div>
        </div>
  
        <div className="modal-backdrop fade show"></div>
      </>
    );
  };
  
  export default CreateCustomerModal;
  