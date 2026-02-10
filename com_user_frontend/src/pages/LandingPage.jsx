import Header from "../components/common/Header";
import "../styles/pageStyles/LandingPage.css";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="landing-page">
      <Header />
      <div className="hero-section">
        <div className="hero-visual"></div>
        <div className="hero-content">
          <h1 className="hero-title">
            Manage Your Companies and Users with Ease
          </h1>
          <p className="hero-subtitle">
            Manage your company and user management with our powerful, intuitive
            dashboard
          </p>
          <div className="hero-actions">
            <Link to="/dashboard" className="btn btn-primary btn-lg">
              Get Started <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
