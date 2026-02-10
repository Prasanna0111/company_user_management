import "../../styles/componentStyles/Avatar.css";

export default function Avatar({ name, size = "md", className = "" }) {
  const firstLetter = name ? name.charAt(0).toUpperCase() : "?";

  return (
    <div className={`avatar avatar-${size} ${className}`}>{firstLetter}</div>
  );
}
