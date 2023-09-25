export default function Alert({ title, message, type="error" }) {
  const baseStyles = "p-4 mb-4 text-sm rounded-lg";
  const errorStyles = "text-red-800 bg-red-50";
  const successStyles = "text-green-800 bg-green-50";

  const alertStyles = type === "error" ? errorStyles : successStyles;

  return (
    <div className={`${baseStyles} ${alertStyles}`} role="alert">
      <span className="font-medium">{title}: </span> {message}
    </div>
  )
}