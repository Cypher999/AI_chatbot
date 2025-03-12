export default function Button({
  variant = "default",
  outline = false,
  active = false, // New active state
  className,
  children,
  ...props
}) {
  const baseClasses =
    "relative flex items-center border border-1 rounded p-2 cursor-pointer transition";

  const variants = {
    default: "text-white hover:bg-gray-700 hover:text-teal-400",
    primary: "border-blue-600 bg-blue-600 text-white hover:bg-blue-700",
    secondary: "border-gray-500 bg-gray-500 text-white hover:bg-gray-600",
    success: "border-green-600 bg-green-600 text-white hover:bg-green-700",
    warning: "border-yellow-500 bg-yellow-500 text-black hover:bg-yellow-600",
    danger: "border-red-600 bg-red-600 text-white hover:bg-red-700",
  };

  const outlineVariants = {
    default: "border text-teal-400 hover:bg-gray-600 hover:text-white",
    primary: "border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white",
    secondary: "border-gray-500 text-gray-200 hover:bg-gray-500 hover:text-white",
    success: "border-green-600 text-green-600 hover:bg-green-600 hover:text-white",
    warning: "border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black",
    danger: "border-red-600 text-red-600 hover:bg-red-600 hover:text-white",
  };

  const activeVariants = {
    default: "bg-gray-700 text-teal-300",
    primary: "bg-blue-700 text-white",
    secondary: "bg-gray-600 text-white",
    success: "bg-green-700 text-white",
    warning: "bg-yellow-600 text-black",
    danger: "bg-red-700 text-white",
  };

  const activeOutlineVariants = {
    default: "border-gray-600 bg-gray-600 text-white",
    primary: "border-blue-700 bg-blue-700 text-white",
    secondary: "border-gray-600 bg-gray-600 text-white",
    success: "border-green-700 bg-green-700 text-white",
    warning: "border-yellow-600 bg-yellow-600 text-black",
    danger: "border-red-700 bg-red-700 text-white",
  };

  const selectedClass = outline
    ? outlineVariants[variant]
    : variants[variant];

  const activeClass = outline
    ? activeOutlineVariants[variant]
    : activeVariants[variant];

  return (
    <button
    className={`${baseClasses} ${selectedClass} ${
      active ? activeClass : ""
    } ${className}`}
    {...props}
    >
      {children}
    </button>
  );
}
