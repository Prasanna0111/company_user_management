import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Modal from "../common/Modal";
import Select from "../custom/Select";
import Button from "../custom/Button";
import { userService } from "../../services/userService";
import { companyService } from "../../services/companyService";

export default function MigrateUserModal({
  isOpen,
  onClose,
  user,
  currentCompanyId,
  currentCompanyName,
  onUserMigrated,
}) {
  const [companies, setCompanies] = useState([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchCompanies();
    }
  }, [isOpen]);

  const fetchCompanies = async () => {
    try {
      const response = await companyService.getCompaniesWithoutPagination();
      const otherCompanies =
        response.data?.filter((c) => c.id !== currentCompanyId) || [];
      setCompanies(otherCompanies);
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCompanyId) return;

    setLoading(true);
    try {
      await userService.migrateUser(user.id, selectedCompanyId);
      toast.success(`User migrated successfully!`);
      onUserMigrated();
      onClose();
      setSelectedCompanyId("");
    } catch (error) {
      console.error("Error migrating user:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Migrate User">
      <form onSubmit={handleSubmit} className="company-form">
        <div className="migrate-info">
          <p>
            <strong>User:</strong> {user?.first_name} {user?.last_name}
          </p>
          <p>
            <strong>Email:</strong> {user?.email}
          </p>
        </div>

        <Select
          label="Target Company"
          id="target_company"
          name="target_company"
          placeholder="Select a company"
          options={companies.map((c) => ({ id: c.id, name: c.name }))}
          value={selectedCompanyId}
          onChange={(e) => setSelectedCompanyId(e.target.value)}
          required
        />

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
            variant={loading || !selectedCompanyId ? "disabled" : "primary"}
            disabled={loading || !selectedCompanyId}
          >
            {loading ? "Migrating..." : "Migrate User"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
