import { Link } from "react-router-dom";
import { ChevronLeft, UserPlus } from "lucide-react";

export default function UsersListAdd({ handleAddUser }) {
  return (
    <div className="page-header slide-in">
      <div className="header-main">
        <Link to="/dashboard" className="back-link">
          <ChevronLeft size={18} />
          Back
        </Link>
        <button onClick={handleAddUser} className="btn btn-primary">
          <UserPlus size={18} />
          Add User
        </button>
      </div>
    </div>
  );
}
