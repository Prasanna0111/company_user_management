import { useState, useEffect, useRef, useCallback } from "react";
import "../styles/pageStyles/Home.css";
import Header from "../components/common/Header";
import { companyService } from "../services/companyService";
import { userService } from "../services/userService";
import CompanyCard from "../components/companies/CompanyCard";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { Book } from "lucide-react";
import CompanySearch from "../components/companies/CompanySearch";
import ConfirmationModal from "../components/common/ConfirmationModal";
import { toast } from "react-toastify";
import Analytics from "../components/companies/Analytics";
import useDebounce from "../hooks/useDebounce";
import CreateCompanyModal from "../components/companies/CreateCompanyModal";

export default function Home() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const debouncedSearch = useDebounce(searchQuery, 500);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [companyToEdit, setCompanyToEdit] = useState(null);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    company: null,
  });

  const [stats, setStats] = useState({
    totalCompanies: 0,
    totalUsers: 0,
    activeUsers: 0,
    unassignedUsers: 0,
  });

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const observer = useRef();

  useEffect(() => {
    setPage(1);
    setCompanies([]);
    setHasMore(true);
  }, [debouncedSearch, sortBy]);

  useEffect(() => {
    fetchDashboardData(page === 1);
  }, [debouncedSearch, sortBy, page]);

  const lastCompanyRef = useCallback(
    (node) => {
      if (loading || loadingMore) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, loadingMore, hasMore],
  );

  const fetchDashboardData = async (isInitial = true) => {
    try {
      if (isInitial) {
        setLoading(true);
        setPage(1);
      } else {
        setLoadingMore(true);
      }

      const fetchPage = isInitial ? 1 : page;

      const [companiesData, usersData] = await Promise.all([
        companyService.getCompanies({
          searchText: debouncedSearch.trim(),
          sortBy,
          page: fetchPage,
          limit: 10,
        }),
        isInitial ? userService.getAllUsers() : Promise.resolve(null),
      ]);

      const fetchedCompanies = companiesData?.data || [];
      const totalCount = companiesData?.totalCount || 0;

      if (isInitial) {
        setCompanies(fetchedCompanies);
        const allUsersCount = usersData?.allUsersCount || 0;
        const allActiveUsersCount = usersData?.allActiveUsersCount || 0;
        const allUnassignedUsersCount = usersData?.allUnassignedUsersCount || 0;
        setStats({
          totalCompanies: totalCount,
          totalUsers: allUsersCount,
          activeUsers: allActiveUsersCount,
          unassignedUsers: allUnassignedUsersCount,
        });
        setHasMore(fetchedCompanies.length < totalCount);
      } else {
        setCompanies((prev) => [...prev, ...fetchedCompanies]);
        setHasMore(companies.length + fetchedCompanies.length < totalCount);
      }
    } catch (err) {
      setError("Failed to load dashboard data. Please try again.");
      console.error("Error fetching dashboard data:", err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSortChange = (e) => {
    const value = e.target.value;
    setSortBy(value);
  };

  const handleCreateCompany = () => {
    setCompanyToEdit(null);
    setIsModalOpen(true);
  };

  const handleEditCompany = (company) => {
    setCompanyToEdit(company);
    setIsModalOpen(true);
  };

  const handleDeleteCompany = (company) => {
    setDeleteModal({ isOpen: true, company });
  };

  const handleConfirmDelete = async () => {
    const { company } = deleteModal;
    if (!company) return;

    try {
      await companyService.deleteCompany(company.id);
      toast.success("Company deleted successfully");
      fetchDashboardData();
    } catch (error) {
      console.error("Error deleting company:", error);
      toast.error("Failed to delete company");
    }
    setDeleteModal({ isOpen: false, company: null });
  };

  return (
    <div className="home-page">
      <Header />

      <main className="main-content">
        <div className="container">
          <CompanySearch
            searchQuery={searchQuery}
            handleSearchChange={handleSearchChange}
          />
          <Analytics stats={stats} handleCreateCompany={handleCreateCompany} />
          <div className="section-header">
            <h2>Company List</h2>
            <div className="sort-controls">
              <select
                className="input"
                value={sortBy}
                onChange={handleSortChange}
                style={{ width: "auto", minWidth: "180px" }}
              >
                <option value="recent">Recently Added</option>
                <option value="oldest">Oldest First</option>
                <option value="nameasc">Name (A-Z)</option>
                <option value="namedesc">Name (Z-A)</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="loading-state">
              <LoadingSpinner />
              <p>Loading companies...</p>
            </div>
          ) : error ? (
            <div className="error-state">
              <p>{error}</p>
              <button
                className="btn btn-secondary"
                onClick={fetchDashboardData}
              >
                Retry
              </button>
            </div>
          ) : (
            <div className="companies-grid fade-in">
              {companies.length === 0 ? (
                <div className="empty-state">
                  <Book size={48} />
                  <h3>No companies found</h3>
                  <p>
                    {searchQuery
                      ? "Try adjusting your search query"
                      : "Get started by creating your first company"}
                  </p>
                </div>
              ) : (
                <>
                  {companies.map((company, index) => {
                    if (companies.length === index + 1) {
                      return (
                        <div ref={lastCompanyRef} key={company.id}>
                          <CompanyCard
                            company={company}
                            onEdit={handleEditCompany}
                            onDelete={handleDeleteCompany}
                          />
                        </div>
                      );
                    } else {
                      return (
                        <CompanyCard
                          key={company.id}
                          company={company}
                          onEdit={handleEditCompany}
                          onDelete={handleDeleteCompany}
                        />
                      );
                    }
                  })}
                  {loadingMore && <LoadingSpinner />}
                </>
              )}
            </div>
          )}
        </div>
      </main>

      <CreateCompanyModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        fetchCompanies={fetchDashboardData}
        companyToEdit={companyToEdit}
      />

      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, company: null })}
        onConfirm={handleConfirmDelete}
        title="Delete Company"
        message={`Are you sure you want to delete ${deleteModal.company?.name}? This action cannot be undone.`}
        confirmText="Delete Company"
      />
    </div>
  );
}
