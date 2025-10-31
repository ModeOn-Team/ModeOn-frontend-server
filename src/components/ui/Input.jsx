const Input = ({
  type = "text",
  placeholder,
  value,
  onChange,
  name,
  required = false,
  className = "",
  disabled = false,
}) => {
  return (
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      disabled={disabled}
      className={`w-full px-2 py-3 border-b text-base focus:outline-none transition-all
        ${
          disabled
            ? "bg-transparent border-gray-300 text-gray-400 cursor-not-allowed"
            : "bg-transparent border-gray-300 focus:border-blue-500"
        } ${className}`}
    />
  );
};

export default Input;
