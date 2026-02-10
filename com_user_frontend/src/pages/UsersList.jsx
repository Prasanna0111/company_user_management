import { useState, useEffect } from "react";
import "../styles/pageStyles/UsersList.css";
import Header from "../components/common/Header";
import Table from "../components/common/Table";
import { userService } from "../services/userService";
import { toast } from "react-toastify";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Edit2,
  Trash2,
  ArrowLeftRight,
} from "lucide-react";
import UserModal from "../components/users/UserModal";
import ConfirmationModal from "../components/common/ConfirmationModal";
import MigrateUserModal from "../components/users/MigrateUserModal";
import { formatRelativeTime, formatDate } from "../utils/dateUtils";
import Avatar from "../components/common/Avatar";
import useDebounce from "../hooks/useDebounce";
import UsersListAdd from "../components/users/UsersListAdd";

export default function UsersList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
  });
  const [filters, setFilters] = useState({});
  const [globalFilter, setGlobalFilter] = useState("all");
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [sort, setSort] = useState({ key: "updated_at", order: "DESC" });

  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isMigrateModalOpen, setIsMigrateModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);
  const [userToMigrate, setUserToMigrate] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, user: null });

  useEffect(() => {
    fetchUsers();
  }, [pagination.page, filters, sort, debouncedSearch, globalFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await userService.getAllUsers({
        search: debouncedSearch.trim(),
        ...filters,
        globalFilter,
        sortBy: sort.key,
        sortOrder: sort.order,
        page: pagination.page,
        limit: pagination.limit,
      });

      if (response.success) {
        setUsers(response.data);
        setPagination((prev) => ({
          ...prev,
          total: response.pagination.total,
        }));
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
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

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPagination((prev) => ({ ...prev, page: 1 }));
    fetchUsers();
  };

  const handleAddUser = () => {
    setUserToEdit(null);
    setIsUserModalOpen(true);
  };

  const handleEditUser = (user) => {
    setUserToEdit(user);
    setIsUserModalOpen(true);
  };

  const handleDeleteUser = (user) => {
    setDeleteModal({ isOpen: true, user });
  };

  const handleMigrateUser = (user) => {
    setUserToMigrate(user);
    setIsMigrateModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    const { user } = deleteModal;
    if (!user) return;

    try {
      await userService.deleteUser(user.id);
      toast.success("User deleted successfully");
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
    setDeleteModal({ isOpen: false, user: null });
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
      key: "first_name",
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
    {
      key: "company_name",
      label: "Company",
      sortable: true,
      render: (val) => val || <span className="text-muted">Unassigned</span>,
    },
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
            title="Delete User"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  const totalPages = Math.ceil(pagination.total / pagination.limit);

  return (
    <div className="users-list-page">
      <Header />

      <main className="main-content">
        <div className="container">
          <UsersListAdd handleAddUser={handleAddUser} />
          <div className="list-controls fade-in">
            <form className="search-box" onSubmit={handleSearchSubmit}>
              <Search size={20} className="search-icon" />
              <input
                type="text"
                className="input"
                placeholder="Search by name or email..."
                value={search}
                onChange={handleSearchChange}
              />
            </form>

            <div className="global-sort">
              <span className="label">Filter By:</span>
              <select
                value={globalFilter}
                onChange={(e) => {
                  setGlobalFilter(e.target.value);
                  setPagination((prev) => ({ ...prev, page: 1 }));
                }}
                className="input"
                style={{ width: "auto" }}
              >
                <option value="all">All Users</option>
                <option value="unassigned">Unassigned</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div className="global-sort">
              <span className="label">Sort By:</span>
              <select
                value={`${sort.key}-${sort.order}`}
                onChange={(e) => {
                  const [key, order] = e.target.value.split("-");
                  setSort({ key, order });
                }}
                className="input"
                style={{ width: "auto" }}
              >
                <option value="updated_at-DESC">Most Recent</option>
                <option value="updated_at-ASC">Oldest</option>
                <option value="first_name-ASC">Name (A-Z)</option>
                <option value="first_name-DESC">Name (Z-A)</option>
              </select>
            </div>
          </div>

          <div className="table-section fade-in">
            <Table
              columns={columns}
              data={users}
              onSort={handleSort}
              currentSort={sort}
              onFilterChange={handleFilterChange}
              filters={filters}
              loading={loading}
            />
          </div>

          {pagination.total > 0 && (
            <div className="pagination fade-in">
              <div className="pagination-info">
                Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                {Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
                of {pagination.total} users
              </div>
              <div className="pagination-controls">
                <button
                  className="btn btn-secondary btn-sm"
                  disabled={pagination.page === 1}
                  onClick={() =>
                    setPagination((prev) => ({ ...prev, page: prev.page - 1 }))
                  }
                >
                  <ChevronLeft size={16} /> Previous
                </button>
                <div className="page-numbers">
                  {[...Array(totalPages)].map((_, i) => (
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
                  disabled={pagination.page === totalPages}
                  onClick={() =>
                    setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
                  }
                >
                  Next <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      <UserModal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        onSuccess={fetchUsers}
        user={userToEdit}
        companyId={userToEdit?.company_id}
      />

      <MigrateUserModal
        isOpen={isMigrateModalOpen}
        onClose={() => setIsMigrateModalOpen(false)}
        user={userToMigrate}
        currentCompanyId={userToMigrate?.company_id}
        onUserMigrated={fetchUsers}
      />

      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, user: null })}
        onConfirm={handleConfirmDelete}
        title="Delete User"
        message={`Are you sure you want to delete ${deleteModal.user?.first_name} ${deleteModal.user?.last_name}?`}
        confirmText="Delete User"
      />
    </div>
  );
}
