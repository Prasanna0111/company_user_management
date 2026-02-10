import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Modal from "../common/Modal";
import Input from "../custom/Input";
import Button from "../custom/Button";
import { userService } from "../../services/userService";
import { companyService } from "../../services/companyService";
import Select from "../custom/Select";

export default function UserModal({
  isOpen,
  onClose,
  companyId,
  user,
  onSuccess,
}) {
  const isEditMode = !!user;

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    designation: "",
    dob: "",
    active: true,
    company_id: companyId || "",
  });
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && !companyId && !isEditMode) {
      fetchCompanies();
    }
  }, [isOpen, companyId, isEditMode]);

  const fetchCompanies = async () => {
    try {
      const response = await companyService.getCompanies();
      if (response.success) {
        setCompanies(response.data);
      }
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  };

  useEffect(() => {
    if (isOpen) {
      if (isEditMode) {
        setFormData({
          first_name: user?.first_name || "",
          last_name: user?.last_name || "",
          email: user?.email || "",
          designation: user?.designation || "",
          dob: user?.dob ? user.dob.split("T")[0] : "",
          active: user?.active !== undefined ? user.active : true,
          company_id: user?.company_id || "",
        });
      } else {
        setFormData({
          first_name: "",
          last_name: "",
          email: "",
          designation: "",
          dob: "",
          active: true,
          company_id: companyId || "",
        });
      }
    }
  }, [isOpen, user, isEditMode, companyId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const sanitizedData = {
        ...formData,
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        email: formData.email.trim(),
        designation: formData.designation?.trim() || "",
      };

      if (isEditMode) {
        await userService.updateUser(user.id, {
          ...sanitizedData,
          company_id: sanitizedData.company_id || null,
        });
        toast.success("User updated successfully!");
      } else {
        const targetCompanyId = companyId || sanitizedData.company_id || null;

        if (targetCompanyId) {
          await companyService.addUserToCompany(targetCompanyId, {
            ...sanitizedData,
            company_id: targetCompanyId,
          });
        } else {
          await userService.createUser({
            ...sanitizedData,
            company_id: null,
          });
        }
        toast.success("User added successfully!");
      }
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      console.error("Error saving user:", error);
    } finally {
      setLoading(false);
    }
  };

  const getMaxDate = () => {
    const today = new Date();
    const eighteenYearsAgo = new Date(
      today.getFullYear() - 18,
      today.getMonth(),
      today.getDate(),
    );
    return eighteenYearsAgo.toISOString().split("T")[0];
  };

  const maxDate = getMaxDate();

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      );
  };

  const isFormInvalid =
    !formData.first_name.trim() ||
    !formData.last_name.trim() ||
    !formData.email.trim() ||
    !validateEmail(formData.email);

  const isFormDirty =
    !isEditMode ||
    (() => {
      const originalDob = user?.dob ? user.dob.split("T")[0] : "";
      return (
        formData.first_name !== (user?.first_name || "") ||
        formData.last_name !== (user?.last_name || "") ||
        formData.email !== (user?.email || "") ||
        formData.designation !== (user?.designation || "") ||
        formData.dob !== originalDob ||
        formData.active !== (user?.active ?? true) ||
        formData.company_id !== (user?.company_id || "")
      );
    })();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? "Edit User" : "Add New User"}
    >
      <form onSubmit={handleSubmit} className="company-form">
        <Input
          label="First Name"
          id="first_name"
          name="first_name"
          type="text"
          placeholder="Enter first name"
          value={formData.first_name}
          onChange={handleChange}
          required
          maxLength={25}
        />

        <Input
          label="Last Name"
          id="last_name"
          name="last_name"
          type="text"
          placeholder="Enter last name"
          value={formData.last_name}
          onChange={handleChange}
          required
          maxLength={15}
        />

        <Input
          label="Email"
          id="email"
          name="email"
          type="email"
          placeholder="Enter email address"
          value={formData.email}
          onChange={handleChange}
          required
          maxLength={75}
        />

        <Input
          label="Designation"
          id="designation"
          name="designation"
          type="text"
          placeholder="Enter designation (optional)"
          value={formData.designation}
          onChange={handleChange}
          maxLength={50}
        />

        <Input
          label="Date of Birth"
          id="dob"
          name="dob"
          type="date"
          value={formData.dob}
          onChange={handleChange}
          max={maxDate}
        />

        {!isEditMode && !companyId && (
          <Select
            label="Assign to Company"
            id="company_id"
            name="company_id"
            value={formData.company_id}
            onChange={handleChange}
            options={[
              { name: "Unassigned", id: "" },
              ...companies.map((c) => ({ name: c.name, id: c.id })),
            ]}
          />
        )}

        <div className="form-group">
          <label
            className="checkbox-label"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              name="active"
              checked={formData.active}
              onChange={handleChange}
              style={{ width: "16px", height: "16px" }}
            />
            <span>Active</span>
          </label>
        </div>

        <div className="form-actions">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant={
              loading || isFormInvalid || !isFormDirty ? "disabled" : "primary"
            }
            disabled={loading || isFormInvalid || !isFormDirty}
          >
            {loading ? "Saving..." : isEditMode ? "Update User" : "Add User"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
