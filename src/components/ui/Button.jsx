import { Link } from "react-router-dom";

function getButtonClassName(variant, size, className) {
  return ["button", variant !== "primary" ? `button-${variant}` : "", size !== "md" ? `button-${size}` : "", className]
    .filter(Boolean)
    .join(" ");
}

export default function Button({
  children,
  className = "",
  disabled = false,
  onClick,
  size = "md",
  to,
  type = "button",
  variant = "primary"
}) {
  const resolvedClassName = getButtonClassName(variant, size, className);

  if (to) {
    return (
      <Link className={resolvedClassName} onClick={onClick} to={to}>
        {children}
      </Link>
    );
  }

  return (
    <button className={resolvedClassName} disabled={disabled} onClick={onClick} type={type}>
      {children}
    </button>
  );
}
