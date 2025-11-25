export default function Input({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  ...rest
}) {
  return (
    <div className="field">
      {label && <label className="label">{label}</label>}
      <input
        className="input"
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        {...rest}
      />
    </div>
  );
}
