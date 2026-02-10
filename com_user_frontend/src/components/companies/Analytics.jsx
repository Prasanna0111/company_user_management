import { Plus, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Analytics({ stats, handleCreateCompany }) {
  const navigate = useNavigate();
  return (
    <>
      {" "}
      <div className="section-header">
        <h2 className="analytics-heading">Overview</h2>
        <div className="header-actions">
          <button
            onClick={() => navigate("/users")}
            className="btn btn-outline"
          >
            <Users size={18} />
            View All Users
          </button>
          <button className="btn btn-primary" onClick={handleCreateCompany}>
            <Plus size={18} />
            Create Company
          </button>
        </div>
      </div>
      <div className="dashboard-stats fade-in">
        <div className="stat-card">
          <h3>Total Companies</h3>
          <span className="stat-value">{stats.totalCompanies}</span>
        </div>
        <div className="stat-card">
          <h3>Total Users</h3>
          <span className="stat-value">{stats.totalUsers}</span>
        </div>
        <div className="stat-card">
          <h3>Active Users</h3>
          <span className="stat-value" style={{ color: "var(--success)" }}>
            {stats.activeUsers}
          </span>
        </div>
        <div className="stat-card">
          <h3>Unassigned Users</h3>
          <span className="stat-value" style={{ color: "var(--warning)" }}>
            {stats.unassignedUsers}
          </span>
        </div>
      </div>
    </>
  );
}
