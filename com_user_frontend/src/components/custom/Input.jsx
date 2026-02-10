export default function Input({ label, id, ...props }) {
  return (
    <div className="form-group">
      {label && (
        <label htmlFor={id} className="form-label">
          {label}
        </label>
      )}
      <input id={id} className="input" {...props} />
    </div>
  );
}
