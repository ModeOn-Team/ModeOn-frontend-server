const Button = ({
  children,
  onClick,
  type = "button",
  variant = "primary",
  disabled = false,
  className = "",
  icon = null,
  iconOnly = false,
}) => {
  let baseStyles =
    "py-3 px-5 rounded-sm font-semibold text-base transition-all duration-200 flex items-center justify-center";

  if (iconOnly) {
    baseStyles =
      "bg-transparent p-0 m-0 w-auto h-auto rounded-none flex items-center justify-center";
  }

  const variants = {
    primary:
      "bg-gradient-to-r from-red-500 via-red-500 to-red-500 text-white hover:shadow-lg transform hover:scale-[1.02] disabled:opacity-50",
    secondary:
      "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:shadow-md transform hover:scale-[1.02]",
    dark: "bg-gray-900 text-white hover:bg-gray-800 hover:shadow-md transform hover:scale-[1.02]",
    textRed:
      "bg-transparent text-red-300 hover:text-red-500 hover:underline transform hover:scale-[1.02] disabled:text-red-400 disabled:cursor-not-allowed",
    iconButton:
      "bg-transparent p-0 w-auto h-auto rounded-none flex items-center justify-center opacity-50 hover:opacity-100 transition-opacity duration-200",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {icon && <span className="mr-3">{icon}</span>}
      {children}
    </button>
  );
};

export default Button;
