import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { companyService } from "../../services/companyService";
import { locationService } from "../../services/locationService";
import Modal from "../common/Modal";
import Input from "../custom/Input";
import Select from "../custom/Select";
import Button from "../custom/Button";

export default function CreateCompanyModal({
  isModalOpen,
  setIsModalOpen,
  fetchCompanies,
  companyToEdit = null,
}) {
  const [formData, setFormData] = useState({
    name: "",
    country: "",
    state: "",
    city: "",
  });

  const [countries, setCountries] = useState([]);
  const [availableStates, setAvailableStates] = useState([]);
  const [availableCities, setAvailableCities] = useState([]);

  useEffect(() => {
    fetchCountries();
  }, []);

  const fetchCountries = async () => {
    try {
      const response = await locationService.getCountries();
      if (response.success) {
        setCountries(response.data);
      }
    } catch (err) {
      console.error("Error fetching countries:", err);
    }
  };

  useEffect(() => {
    if (isModalOpen) {
      if (companyToEdit) {
        loadEditData();
      } else {
        resetForm();
      }
    }
  }, [isModalOpen, companyToEdit, countries]);

  const loadEditData = async () => {
    try {
      const addressParts = companyToEdit.address
        .split(",")
        .map((part) => part.trim());
      const city = addressParts[0] || "";
      const state = addressParts[1] || "";
      const country = addressParts[2] || "";

      const countryObj = countries.find((c) => c.name === country);
      const countryId = countryObj ? countryObj.id : "";

      let stateId = "";
      let cityId = "";

      if (countryId) {
        const statesResponse = await locationService.getStates(countryId);
        const states = statesResponse.data || [];
        setAvailableStates(states);

        const stateObj = states.find((s) => s.name === state);
        stateId = stateObj ? stateObj.id : "";

        if (stateId) {
          const citiesResponse = await locationService.getCities(stateId);
          const cities = citiesResponse.data || [];
          setAvailableCities(cities);

          const cityObj = cities.find((c) => c.name === city);
          cityId = cityObj ? cityObj.id : "";
        }
      }

      setFormData({
        name: companyToEdit.name,
        country: countryId,
        state: stateId,
        city: cityId,
      });
    } catch (err) {
      console.error("Error loading edit data:", err);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: "",
      country: "",
      state: "",
      city: "",
    });
    setAvailableStates([]);
    setAvailableCities([]);
  };

  const handleFormChange = async (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "country") {
      if (value) {
        const response = await locationService.getStates(value);
        setAvailableStates(response.data || []);
      } else {
        setAvailableStates([]);
      }
      setAvailableCities([]);
      setFormData((prev) => ({ ...prev, state: "", city: "" }));
    } else if (name === "state") {
      if (value) {
        const response = await locationService.getCities(value);
        setAvailableCities(response.data || []);
      } else {
        setAvailableCities([]);
      }
      setFormData((prev) => ({ ...prev, city: "" }));
    }
  };

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const countryName =
      countries.find((c) => c.id === formData.country)?.name || "";
    const stateName =
      availableStates.find((s) => s.id === formData.state)?.name || "";
    const cityName =
      availableCities.find((c) => c.id === formData.city)?.name || "";

    const address = `${cityName}, ${stateName}, ${countryName}`;
    const companyData = {
      name: formData.name.trim(),
      address: address,
    };

    try {
      if (companyToEdit) {
        await companyService.updateCompany(companyToEdit.id, companyData);
        toast.success("Company updated successfully!");
      } else {
        await companyService.createCompany(companyData);
        toast.success("Company created successfully!");
      }

      handleCloseModal();
      fetchCompanies();
    } catch (err) {
      console.error("Error saving company:", err);
    } finally {
      setLoading(false);
    }
  };

  const isFormInvalid =
    !formData.name || !formData.country || !formData.state || !formData.city;

  const isFormDirty =
    !companyToEdit ||
    (() => {
      const addressParts = companyToEdit.address
        .split(",")
        .map((part) => part.trim());
      const city = addressParts[0] || "";
      const state = addressParts[1] || "";
      const country = addressParts[2] || "";

      const countryObj = countries.find((c) => c.name === country);
      const countryId = countryObj ? countryObj.id : "";

      const cityId = "";

      return (
        formData.name !== (companyToEdit.name || "") ||
        formData.country !== countryId ||
        formData.state !== stateId ||
        formData.city !== cityId
      );
    })();

  return (
    <Modal
      isOpen={isModalOpen}
      onClose={handleCloseModal}
      title={companyToEdit ? "Edit Company" : "Create New Company"}
    >
      <form onSubmit={handleSubmit} className="company-form">
        <Input
          label="Company Name"
          id="name"
          name="name"
          type="text"
          placeholder="Enter company name"
          value={formData.name}
          onChange={handleFormChange}
          required
          maxLength={25}
        />

        <Select
          label="Country"
          id="country"
          name="country"
          placeholder="Select a country"
          options={countries}
          value={formData.country}
          onChange={handleFormChange}
          required
        />

        <Select
          label="State"
          id="state"
          name="state"
          placeholder="Select a state"
          options={availableStates}
          value={formData.state}
          onChange={handleFormChange}
          disabled={!formData.country}
          required
        />

        <Select
          label="City"
          id="city"
          name="city"
          placeholder="Select a city"
          options={availableCities}
          value={formData.city}
          onChange={handleFormChange}
          disabled={!formData.state}
          required
        />

        <div className="form-actions">
          <Button
            type="button"
            variant="secondary"
            onClick={handleCloseModal}
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
            {loading
              ? "Saving..."
              : companyToEdit
                ? "Update Company"
                : "Create Company"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
