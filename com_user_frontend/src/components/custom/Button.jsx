export default function Button({
  variant = "primary",
  children,
  disabled = false,
  ...props
}) {
  return (
    <button className={`btn btn-${variant}`} {...props} disabled={disabled}>
      {children}
    </button>
  );
}
