import { useRef, useState, useEffect } from "react";
import { MoreVertical } from "lucide-react";
import "../../styles/ThreeDotMenu.css";

export default function ThreeDotMenu({ options }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleMenu = (e) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (e, onClick) => {
    e.stopPropagation();
    onClick();
    setIsOpen(false);
  };

  return (
    <div className="three-dot-menu-container" ref={menuRef}>
      <button
        className="three-dot-btn"
        onClick={toggleMenu}
        aria-label="More options"
      >
        <MoreVertical size={20} />
      </button>

      {isOpen && (
        <div className="menu-dropdown fade-in">
          {options.map((option, index) => (
            <button
              key={index}
              className={`menu-item ${option.className || ""}`}
              onClick={(e) => handleOptionClick(e, option.onClick)}
            >
              {option.icon && <span className="menu-icon">{option.icon}</span>}
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
