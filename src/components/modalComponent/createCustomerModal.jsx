const CreateCustomerModal = ({
  show,
  customerName,
  setCustomerName,
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
              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={onClose}
              />
            </div>

            <div className="modal-body">
              {/* Customer Name */}
              <div className="mb-3">
                <label className="form-label">
                  Customer Name <span className="text-danger">*</span>
                </label>
                <input
                  className="form-control"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Enter customer name"
                />
              </div>

              {/* Phone */}
              <div className="mb-3">
                <label className="form-label">
                  Contact Number <span className="text-danger">*</span>
                </label>
                <input
                  className="form-control"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter contact number"
                />
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </button>

              <button
                className="btn btn-success"
                disabled={!customerName || !phone || loading}
                onClick={onCreate}
              >
                {loading ? "Creating..." : "Create Customer"}
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Backdrop */}
      <div className="modal-backdrop fade show"></div>
    </>
  );
};

export default CreateCustomerModal;
