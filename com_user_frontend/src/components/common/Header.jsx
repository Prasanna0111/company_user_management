import "../../styles/componentStyles/Header.css";
import { Building2, User, LayoutDashboard } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const isLandingPage = location.pathname === "/";

  return (
    <header
      className={`header ${isLandingPage ? "header-bg-landing" : "header-bg-dashboard"}`}
    >
      <div className="container header-content">
        <div className="header-left">
          <div className="logo" onClick={() => navigate("/dashboard")}>
            <Building2 />
            <span className="logo-text">Company User Management</span>
          </div>
        </div>

        <div className="header-right">
          {isLandingPage ? (
            <Link to="/dashboard" className="btn btn-primary">
              <LayoutDashboard size={18} />
              Go to Dashboard
            </Link>
          ) : (
            <div className="user-info">
              <span className="user-name">Admin</span>
              <div className="user-avatar">
                <User />
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
