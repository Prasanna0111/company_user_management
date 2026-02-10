import { useState, useEffect } from "react";
import "../styles/pageStyles/CompanyDetails.css";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Pencil,
  Trash2,
  Edit2,
  ArrowLeftRight,
  Plus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "react-toastify";
import { userService } from "../services/userService";
import { companyService } from "../services/companyService";
import Header from "../components/common/Header";
import LoadingSpinner from "../components/common/LoadingSpinner";
import Button from "../components/custom/Button";
import Table from "../components/common/Table";
import UserModal from "../components/users/UserModal";
import MigrateUserModal from "../components/users/MigrateUserModal";
import CreateCompanyModal from "../components/companies/CreateCompanyModal";
import ConfirmationModal from "../components/common/ConfirmationModal";
import { formatRelativeTime, formatDate } from "../utils/dateUtils";
import Avatar from "../components/common/Avatar";
import CompanyCardBig from "../components/companies/CompanyCardBig";

export default function CompanyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [company, setCompany] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tableLoading, setTableLoading] = useState(false);
  const [error, setError] = useState(null);

  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isMigrateModalOpen, setIsMigrateModalOpen] = useState(false);
  const [isEditCompanyModalOpen, setIsEditCompanyModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    type: null,
    data: null,
  });

  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState({ key: "created_at", order: "DESC" });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
  });

  useEffect(() => {
    fetchCompanyData();
  }, [id]);

  useEffect(() => {
    fetchUsers();
  }, [id, filters, sort, pagination.page]);

  const fetchCompanyData = async () => {
    try {
      setLoading(true);
      const data = await companyService.getCompanyById(id);
      setCompany(data?.data);
      setError(null);
    } catch (err) {
      setError("Failed to load company details.");
      console.error("Error fetching company:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setTableLoading(true);
      const data = await userService.getAllUsers({
        companyId: id,
        ...filters,
        sortBy: sort.key,
        sortOrder: sort.order,
        page: pagination.page,
        limit: pagination.limit,
      });
      if (data.success) {
        setUsers(data.data || []);
        setPagination((prev) => ({ ...prev, total: data.pagination.total }));
      }
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setTableLoading(false);
    }
  };

  const handleSort = (key) => {
    setSort((prev) => ({
      key,
      order: prev.key === key && prev.order === "ASC" ? "DESC" : "ASC",
    }));
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleEditCompany = () => {
    setIsEditCompanyModalOpen(true);
  };

  const handleDeleteCompany = () => {
    setDeleteModal({ isOpen: true, type: "company", data: company });
  };

  const handleDeleteUser = (user) => {
    setDeleteModal({ isOpen: true, type: "user", data: user });
  };

  const handleConfirmDelete = async () => {
    const { type, data } = deleteModal;
    if (!type || !data) return;

    try {
      if (type === "company") {
        await companyService.deleteCompany(data.id);
        navigate("/dashboard");
        toast.success("Company deleted successfully");
      } else if (type === "user") {
        await userService.unassignUser(data.id);
        toast.success(
          `${data.first_name} ${data.last_name} removed from company`,
        );
        fetchUsers();
        fetchCompanyData(id);
      }
    } catch (error) {
      console.error(`Error deleting ${type}:`, error);
    }
    setDeleteModal({ isOpen: false, type: null, data: null });
  };

  const companyMenuOptions = [
    {
      label: "Edit Company",
      icon: <Pencil size={16} />,
      onClick: handleEditCompany,
    },
    {
      label: "Delete Company",
      icon: <Trash2 size={16} />,
      className: "danger",
      onClick: handleDeleteCompany,
    },
  ];

  const handleAddUser = () => {
    setSelectedUser(null);
    setIsUserModalOpen(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setIsUserModalOpen(true);
  };

  const handleMigrateUser = (user) => {
    setSelectedUser(user);
    setIsMigrateModalOpen(true);
  };

  const columns = [
    {
      key: "sno",
      label: "S.No",
      width: "60px",
      render: (val, row, index) =>
        (pagination.page - 1) * pagination.limit + index + 1,
    },
    {
      key: "name",
      label: "Name",
      sortable: true,
      render: (val, row) => (
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Avatar name={`${row.first_name} ${row.last_name}`} size="sm" />
          <span>{`${row.first_name} ${row.last_name}`}</span>
        </div>
      ),
    },
    { key: "email", label: "Email", sortable: true },
    { key: "designation", label: "Designation", sortable: true },
    {
      key: "dob",
      label: "DOB",
      sortable: true,
      render: (val) => formatDate(val),
    },
    {
      key: "active",
      label: "Status",
      sortable: true,
      filterType: "select",
      filterable: true,
      filterOptions: [
        { label: "Active", value: "true" },
        { label: "Inactive", value: "false" },
      ],
      render: (val) => (
        <span className={`status-badge ${val ? "active" : "inactive"}`}>
          {val ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      key: "created_at",
      label: "Added On",
      sortable: true,
      render: (val) => formatRelativeTime(val),
    },
    {
      key: "actions",
      label: "Actions",
      width: "120px",
      render: (val, row) => (
        <div className="action-buttons">
          <button
            className="btn-icon"
            onClick={() => handleEditUser(row)}
            title="Edit User"
          >
            <Edit2 size={16} />
          </button>
          <button
            className="btn-icon"
            onClick={() => handleMigrateUser(row)}
            title="Migrate User"
          >
            <ArrowLeftRight size={16} />
          </button>
          <button
            className="btn-icon text-danger"
            onClick={() => handleDeleteUser(row)}
            title="Remove from company"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="company-details-page">
        <Header />
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="company-details-page">
        <Header />
        <div className="error-state">
          <p>{error || "Company not found"}</p>
          <button className="btn btn-secondary" onClick={() => navigate(-1)}>
            Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="company-details-page">
      <Header />

      <main className="main-content">
        <div className="container">
          <Link to="/dashboard" className="back-link">
            <ChevronLeft size={18} />
            Back
          </Link>
          <CompanyCardBig
            company={company}
            companyMenuOptions={companyMenuOptions}
          />

          <div className="users-section-full fade-in">
            <div className="section-header-row">
              <h2>Users</h2>
              <Button variant="primary" size="sm" onClick={handleAddUser}>
                <Plus size={16} />
                Add User
              </Button>
            </div>
            <Table
              columns={columns}
              data={users}
              currentSort={sort}
              filters={filters}
              onSort={handleSort}
              onFilterChange={handleFilterChange}
              loading={tableLoading}
            />

            {pagination.total > pagination.limit && (
              <div className="pagination fade-in">
                <div className="pagination-info">
                  Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                  {Math.min(
                    pagination.page * pagination.limit,
                    pagination.total,
                  )}{" "}
                  of {pagination.total} users
                </div>
                <div className="pagination-controls">
                  <button
                    className="btn btn-secondary btn-sm"
                    disabled={pagination.page === 1}
                    onClick={() =>
                      setPagination((prev) => ({
                        ...prev,
                        page: prev.page - 1,
                      }))
                    }
                  >
                    <ChevronLeft size={16} /> Previous
                  </button>
                  <div className="page-numbers">
                    {[
                      ...Array(Math.ceil(pagination.total / pagination.limit)),
                    ].map((_, i) => (
                      <button
                        key={i + 1}
                        className={`page-num ${pagination.page === i + 1 ? "active" : ""}`}
                        onClick={() =>
                          setPagination((prev) => ({ ...prev, page: i + 1 }))
                        }
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                  <button
                    className="btn btn-secondary btn-sm"
                    disabled={
                      pagination.page ===
                      Math.ceil(pagination.total / pagination.limit)
                    }
                    onClick={() =>
                      setPagination((prev) => ({
                        ...prev,
                        page: prev.page + 1,
                      }))
                    }
                  >
                    Next <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <UserModal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        companyId={id}
        user={selectedUser}
        onSuccess={fetchUsers}
      />

      <MigrateUserModal
        isOpen={isMigrateModalOpen}
        onClose={() => setIsMigrateModalOpen(false)}
        user={selectedUser}
        currentCompanyId={id}
        onUserMigrated={fetchUsers}
        fetchCompanyData={fetchCompanyData}
      />

      <CreateCompanyModal
        isModalOpen={isEditCompanyModalOpen}
        setIsModalOpen={setIsEditCompanyModalOpen}
        fetchCompanies={fetchCompanyData}
        companyToEdit={company}
      />

      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() =>
          setDeleteModal({ isOpen: false, type: null, data: null })
        }
        onConfirm={handleConfirmDelete}
        title={
          deleteModal.type === "company" ? "Delete Company" : "Remove User"
        }
        message={
          deleteModal.type === "company"
            ? `Are you sure you want to delete ${deleteModal.data?.name}? This action cannot be undone.`
            : `Are you sure you want to remove ${deleteModal.data?.first_name} ${deleteModal.data?.last_name} from this company? They will still be available in the global users list.`
        }
        confirmText={
          deleteModal.type === "company" ? "Delete Company" : "Remove User"
        }
      />
    </div>
  );
}
