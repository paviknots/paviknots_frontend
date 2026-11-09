import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiChevronDown, FiX } from "react-icons/fi";
import {
  getAddresses,
  createAddress,
  setDefaultAddress,
} from "../../../api/address.api";

import "./CheckoutAddresses.css";

const CheckoutAddresses = () => {
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [visibleAddressCount, setVisibleAddressCount] = useState(4);

  // Separate error states for the main page and the modal form
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");

  const [form, setForm] = useState({
    name: "",
    phone: "",
    pincode: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    country: "India",
  });

  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await getAddresses();
      const data = response.data || [];
      setAddresses(data);
      if (data.length > 0) {
        setSelectedAddressId(data[0].id);
      }
      const defaultAddress = data.find((address) => address.isDefault === true);
      setSelectedAddressId(defaultAddress?.id);
    } catch (error) {
      console.error("Failed to load addresses:", error);
      setError(
        error.response?.data?.message || "Unable to load your addresses.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setSaving(true);
      setFormError("");

      const response = await createAddress(form);
      const newAddress = response.data;

      if (newAddress) {
        setAddresses((previous) => [...previous, newAddress]);
        setSelectedAddressId(newAddress.id);
      } else {
        await loadAddresses();
      }

      setForm({
        name: "",
        phone: "",
        pincode: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        country: "India",
      });
      setShowForm(false);
    } catch (error) {
      console.error("Failed to create address:", error);

      const response = error.response?.data;

      if (response?.errors?.length) {
        setFormError(response.errors[0].message);
      } else {
        setFormError(response?.message || "Unable to save the address.");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleContinue = async () => {
    if (!selectedAddressId) {
      setError("Please select a delivery address.");
      return;
    }

    try {
      setError("");
      await setDefaultAddress(selectedAddressId);
      navigate("/checkout");
    } catch (error) {
      console.error("Failed to update default address:", error);

      setError(
        error.response?.data?.message ||
          "Unable to update your delivery address.",
      );
    }
  };

  const openModal = () => {
    setFormError("");
    setShowForm(true);
  };

  const closeModal = () => {
    setFormError("");
    setShowForm(false);
  };

  if (loading) {
    return <main className="AddressSelection-loading">Loading...</main>;
  }

  return (
    <main className="AddressSelection">
      <div className="AddressSelection-container">
        <h1 className="AddressSelection-title">
          Delivery addresses ({addresses.length})
        </h1>

        {error && <div className="AddressSelection-error">{error}</div>}

        <div className="AddressSelection-list">
          {addresses.slice(0, visibleAddressCount).map((address) => {
            const isSelected = selectedAddressId === address.id;

            const addressString = [
              address.addressLine1,
              address.addressLine2,
              address.city,
              address.state,
              address.pincode,
              address.country || "India",
            ]
              .filter(Boolean)
              .join(", ");

            return (
              <div
                key={address.id}
                className={`AddressSelection-item ${isSelected ? "AddressSelection-itemSelected" : ""}`}
                onClick={() => setSelectedAddressId(address.id)}
              >
                <div className="AddressSelection-radioWrapper">
                  <div
                    className={`AddressSelection-radio ${isSelected ? "AddressSelection-radioActive" : ""}`}
                  >
                    {isSelected && (
                      <div className="AddressSelection-radioDot" />
                    )}
                  </div>
                </div>

                <div className="AddressSelection-details">
                  <strong className="AddressSelection-name">
                    {address.name}
                  </strong>
                  <p className="AddressSelection-text">{addressString}</p>
                  <p className="AddressSelection-text">
                    Phone number: {address.phone}
                  </p>

                  <div className="AddressSelection-inlineLinks">
                    <button type="button" onClick={(e) => e.stopPropagation()}>
                      Edit address
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="AddressSelection-actions">
          {addresses.length > visibleAddressCount && (
            <button
              type="button"
              className="AddressSelection-linkBtn AddressSelection-linkDropdown"
              onClick={() => setVisibleAddressCount((previous) => previous + 5)}
            >
              Show more addresses ({addresses.length - visibleAddressCount}{" "}
              remaining)
              <FiChevronDown size={14} />
            </button>
          )}

          <button
            type="button"
            className="AddressSelection-linkBtn"
            onClick={openModal}
          >
            Add a new delivery address
          </button>
        </div>

        <div className="AddressSelection-footer">
          <button
            type="button"
            className="AddressSelection-submitBtn"
            onClick={handleContinue}
          >
            Deliver to this address
          </button>
        </div>
      </div>

      {showForm && (
        <div className="AddressModal-overlay" onClick={closeModal}>
          <div className="AddressModal" onClick={(e) => e.stopPropagation()}>
            <div className="AddressModal-header">
              <h3>Add an address</h3>
              <button
                type="button"
                onClick={closeModal}
                className="AddressModal-close"
              >
                <FiX size={20} />
              </button>
            </div>

            <div className="AddressModal-body">
              <h2 className="AddressModal-title">
                Enter a new delivery address
              </h2>

              {formError && (
                <div className="AddressSelection-error">{formError}</div>
              )}

              <form onSubmit={handleSubmit} className="AddressModal-form">
                <div className="AddressModal-field">
                  <label>Country/Region</label>
                  <select
                    name="country"
                    value={form.country}
                    onChange={handleChange}
                  >
                    <option value="India">India</option>
                  </select>
                </div>

                <div className="AddressModal-field">
                  <label>Full name (First and Last name)</label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="AddressModal-field">
                  <label>Mobile number</label>
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    required
                  />
                  <span className="AddressModal-hint">
                    May be used to assist delivery
                  </span>
                </div>

                <div className="AddressModal-field">
                  <label>Pincode</label>
                  <input
                    name="pincode"
                    value={form.pincode}
                    onChange={handleChange}
                    placeholder="6 digits [0-9] PIN code"
                    required
                  />
                </div>

                <div className="AddressModal-field">
                  <label>Flat, House no., Building, Company, Apartment</label>
                  <input
                    name="addressLine1"
                    value={form.addressLine1}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="AddressModal-field">
                  <label>Area, Street, Sector, Village</label>
                  <input
                    name="addressLine2"
                    value={form.addressLine2}
                    onChange={handleChange}
                  />
                </div>

                <div className="AddressModal-row">
                  <div className="AddressModal-field">
                    <label>City</label>
                    <input
                      name="city"
                      value={form.city}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="AddressModal-field">
                    <label>State</label>
                    <input
                      name="state"
                      value={form.state}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="AddressModal-footer">
                  <button
                    type="submit"
                    className="AddressModal-submitBtn"
                    disabled={saving}
                  >
                    {saving ? "Adding..." : "Add address"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default CheckoutAddresses;
