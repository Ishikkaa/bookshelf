import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { MdEdit, MdDelete, MdCheck, MdClose } from "react-icons/md";
import { toast, ToastContainer } from "react-toastify";
import {getUserById, addAddress, updateAddress, deleteAddress} from "../../store/features/UserSlice";

const UserProfile = () => {
  const { userId } = useParams();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [editedAddress, setEditedAddress] = useState(null);
  const [showAddAddressForm, setShowAddAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    addressLine: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
    addressType: "",
  });
  const isAddressValid = (address) => {
    return (
      address.addressLine &&
      address.city &&
      address.state &&
      address.country &&
      address.postalCode &&
      address.addressType
    );
  };
  const { successMessage, errorMessage } = useSelector(
    (state) => state.user
  );

  useEffect(() => {
    if (successMessage) toast.success(successMessage);
    if (errorMessage) toast.error(errorMessage);
  }, [successMessage, errorMessage]);

  useEffect(() => {
    dispatch(getUserById(userId));
  }, [dispatch, userId]);

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setNewAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditClick = (address) => {
    setEditingAddressId(address.id);
    setEditedAddress({ ...address });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleAddAddress = async () => {
    try {
      await dispatch(
        addAddress({
          userId,
          address: newAddress,
        })
      ).unwrap();
      await dispatch(getUserById(userId));
      setNewAddress({
        addressLine: "",
        city: "",
        state: "",
        country: "",
        postalCode: "",
        addressType: "",
      });
      setShowAddAddressForm(false);
    } catch (error) {
      toast.error("Failed to add address");
    }
  };

  const handleUpdateAddress = () => {
    dispatch(updateAddress({ id: editingAddressId, address: editedAddress }));
    setEditingAddressId(null);
    setEditedAddress(null);
  };

  const cancelEdit = () => {
    setEditingAddressId(null);
    setEditedAddress(null);
  };

  if (errorMessage) return <p className="profile-error">{errorMessage}</p>;
  if (!user) return null;

  return (
    <div className="user-profile-page">
      <ToastContainer/>
      <form className="profile-form-wide">
        <h2 className="form-title">User Dashboard</h2>

        {/* USER DETAILS */}
        <div className="form-grid-2">
          <div className="form-group editable-field">
            <label>Full Name</label>
            <div className="input-icon-wrapper">
              <input value={`${user.firstName} ${user.lastName}`} disabled />
            </div>
          </div>

          <div className="form-group editable-field">
            <label>Email</label>
            <div className="input-icon-wrapper">
              <input value={user.email} disabled />
            </div>
          </div>
        </div>

        {/* ADDRESSES HEADER */}
        <div className="addresses-header">
          <h3 className="section-title">
            Addresses
            <button
              type="button"
              className="add-address-btn"
              disabled={showAddAddressForm}
              onClick={() => setShowAddAddressForm(true)}
            >
              +
            </button>
          </h3>
        </div>

        {/* ADDRESS GRID (SINGLE GRID) */}
        <div className="address-grid">

          {/* EXISTING ADDRESSES */}
          {user.addressList?.map((address, index) => (
            <div className="address-form-card" key={address.id || index}>
              <div className="address-header-row">
                <h4 className="address-header">
                  Address {index + 1} · {address.addressType}
                </h4>
                <div className="address-actions">
                  {editingAddressId === address.id ? (
                    <>
                      <button
                        type="button"
                        className="icon-btn edit-btn"
                        disabled={!isAddressValid(editedAddress)}
                        onClick={handleUpdateAddress}
                        title="Save"
                      >
                        <MdCheck />
                      </button>

                      <button
                        type="button"
                        className="icon-btn delete-btn"
                        onClick={cancelEdit}
                        title="Cancel"
                      >
                        <MdClose />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        className="icon-btn edit-btn"
                        onClick={() => handleEditClick(address)}
                      >
                        <MdEdit />
                      </button>
                      <button
                        type="button"
                        className="icon-btn delete-btn"
                        onClick={() => dispatch(deleteAddress({ id: address.id }))}
                      >
                        <MdDelete />
                      </button>
                    </>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label>Address Line</label>
                <input
                  name="addressLine"
                  value={
                    editingAddressId === address.id
                      ? editedAddress.addressLine
                      : address.addressLine
                  }
                  disabled={editingAddressId !== address.id}
                  onChange={handleEditChange}
                />
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>City</label>
                  <input
                  name="city"
                  value={
                    editingAddressId === address.id
                      ? editedAddress.city
                      : address.city
                  }
                  disabled={editingAddressId !== address.id}
                  onChange={handleEditChange}
                />
                </div>
                <div className="form-group">
                  <label>State</label>
                  <input
                  name="state"
                  value={
                    editingAddressId === address.id
                      ? editedAddress.state
                      : address.state
                  }
                  disabled={editingAddressId !== address.id}
                  onChange={handleEditChange}
                />
                </div>
                <div className="form-group">
                  <label>Country</label>
                  <input
                  name="country"
                  value={
                    editingAddressId === address.id
                      ? editedAddress.country
                      : address.country
                  }
                  disabled={editingAddressId !== address.id}
                  onChange={handleEditChange}
                />
                </div>
                <div className="form-group">
                  <label>Postal Code</label>
                  <input
                  name="postalCode"
                  value={
                    editingAddressId === address.id
                      ? editedAddress.postalCode
                      : address.postalCode
                  }
                  disabled={editingAddressId !== address.id}
                  onChange={handleEditChange}
                />
                </div>
              </div>

              <div className="form-group">
                <label>Address Type</label>
                {editingAddressId === address.id ? (
                  <select
                    name="addressType"
                    value={editedAddress.addressType}
                    onChange={handleEditChange}
                  >
                    <option value="">Select</option>
                    <option value="HOME">Home</option>
                    <option value="OFFICE">Office</option>
                    <option value="SHIPPING">Shipping</option>
                  </select>
                ) : (
                  <input value={address.addressType} disabled />
                )}
              </div>
            </div>
          ))}

          {/* NEW ADDRESS FORM */}
          {showAddAddressForm && (
            <div className="address-form-card new-address-card">
              <h4 className="address-header">Add New Address</h4>

              <div className="form-group">
                <label>Address Line</label>
                <input
                  name="addressLine"
                  value={newAddress.addressLine}
                  onChange={handleAddressChange}
                />
              </div>

              <div className="form-grid-2 spaced-grid">
                <div className="form-group">
                  <label>City</label>
                  <input name="city" value={newAddress.city} onChange={handleAddressChange} />
                </div>
                <div className="form-group">
                  <label>State</label>
                  <input name="state" value={newAddress.state} onChange={handleAddressChange} />
                </div>
                <div className="form-group">
                  <label>Country</label>
                  <input name="country" value={newAddress.country} onChange={handleAddressChange} />
                </div>
                <div className="form-group">
                  <label>Postal Code</label>
                  <input name="postalCode" value={newAddress.postalCode} onChange={handleAddressChange} />
                </div>
              </div>

              <div className="form-group">
                <label>Address Type</label>
                <select name="addressType" value={newAddress.addressType} onChange={handleAddressChange}>
                  <option value="">Select</option>
                  <option value="HOME">Home</option>
                  <option value="OFFICE">Office</option>
                  <option value="SHIPPING">Shipping</option>
                </select>
              </div>

              <div className="address-actions-row">
                <button
                  type="button"
                  className="address-btn secondary"
                  onClick={() => setShowAddAddressForm(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="address-btn primary"
                  onClick={handleAddAddress}
                  disabled={
                    !newAddress.addressLine ||
                    !newAddress.city ||
                    !newAddress.state ||
                    !newAddress.country ||
                    !newAddress.postalCode ||
                    !newAddress.addressType
                  }
                >
                  Save Address
                </button>
              </div>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default UserProfile;
