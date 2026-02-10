import { MapPinHouse, Eye, Pencil, Trash2, Users } from "lucide-react";
import { Link } from "react-router-dom";
import ThreeDotMenu from "../common/ThreeDotMenu";
import Avatar from "../common/Avatar";

export default function CompanyCard({ company, onEdit, onDelete }) {
  const menuOptions = [
    {
      label: "Edit",
      icon: <Pencil size={16} />,
      onClick: () => onEdit(company),
    },
    {
      label: "Delete",
      icon: <Trash2 size={16} />,
      className: "danger",
      onClick: () => onDelete(company),
    },
  ];

  return (
    <div className="company-card glass glass-hover">
      <div className="company-header">
        <Avatar name={company.name} size="md" />

        <div className="company-info-header">
          <div className="company-name-row">
            <h3 className="company-name text-capitalize">{company.name}</h3>
            <div className="user-count-badge">
              <Users size={20} />
              <span>{company.user_count || 0}</span>
            </div>
          </div>
        </div>
        <div className="company-actions">
          <ThreeDotMenu options={menuOptions} />
        </div>
      </div>
      <div className="company-details">
        <div className="detail-item">
          <MapPinHouse />
          <span className="detail-text">{company.address}</span>
        </div>
      </div>
      <Link to={`/company/${company.id}`} className="btn btn-outline">
        <Eye size={16} />
        View
      </Link>
    </div>
  );
}
