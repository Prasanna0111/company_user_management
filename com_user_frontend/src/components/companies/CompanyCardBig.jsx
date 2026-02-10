import { MapPin } from "lucide-react";
import Avatar from "../common/Avatar";
import ThreeDotMenu from "../common/ThreeDotMenu";
import Button from "../custom/Button";
import CompanyMap from "./CompanyMap";
import { formatDate } from "../../utils/dateUtils";

export default function CompanyCardBig({ company, companyMenuOptions }) {
  function openInGoogleMaps(lat, lng) {
    window.open(`https://www.google.com/maps?q=${lat},${lng}`, "_blank");
  }
  return (
    <div className="company-header-section">
      <div className="company-info-card fade-in">
        <div className="info-card-header">
          <div className="company-logo">
            <Avatar name={company.name} size="lg" />
          </div>
          <div className="company-info">
            <h1 className="text-capitalize">{company.name}</h1>
            <p className="company-address">{company.address}</p>
          </div>
          <ThreeDotMenu options={companyMenuOptions} />
        </div>
        <div className="company-stats">
          <div className="stat-item">
            <span className="stat-label">Total Users</span>
            <span className="stat-value">{company.user_count || 0}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Date Added</span>
            <span className="stat-value">{formatDate(company.created_at)}</span>
          </div>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={() => openInGoogleMaps(company.latitude, company.longitude)}
        >
          <span>
            <MapPin />
          </span>
          Get Directions
        </Button>
      </div>

      <div className="company-map-card fade-in">
        <CompanyMap company={company} />
      </div>
    </div>
  );
}
