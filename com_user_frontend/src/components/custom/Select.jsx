import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import "../../styles/componentStyles/Select.css";

export default function Select({
  label,
  id,
  options,
  placeholder,
  value,
  onChange,
  disabled,
  name,
  ...props
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggle = () => {
    if (!disabled) setIsOpen(!isOpen);
  };

  const handleSelect = (optionValue) => {
    if (onChange) {
      onChange({ target: { name, value: optionValue } });
    }
    setIsOpen(false);
  };

  const selectedOption = options?.find(
    (opt) => String(opt.id) === String(value),
  );

  return (
    <div className="form-group" ref={containerRef}>
      {label && (
        <label htmlFor={id} className="form-label">
          {label}
        </label>
      )}
      <div className="custom-select-container">
        <button
          type="button"
          className={`custom-select-trigger ${isOpen ? "open" : ""} ${disabled ? "disabled" : ""} ${!selectedOption ? "placeholder" : ""}`}
          onClick={handleToggle}
          disabled={disabled}
          id={id}
        >
          <span className="selected-value">
            {selectedOption ? selectedOption.name : placeholder}
          </span>
          <ChevronDown size={18} className="custom-select-arrow" />
        </button>

        {isOpen && (
          <div className="custom-select-dropdown">
            <ul className="custom-select-options">
              {placeholder && (
                <li
                  className={`custom-select-option placeholder ${!value ? "selected" : ""}`}
                  onClick={() => handleSelect("")}
                >
                  {placeholder}
                </li>
              )}
              {options?.map((option) => (
                <li
                  key={option.id}
                  className={`custom-select-option ${String(option.id) === String(value) ? "selected" : ""}`}
                  onClick={() => handleSelect(option.id)}
                >
                  {option.name}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
