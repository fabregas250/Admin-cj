export default function Button({ 
  children, 
  variant = 'primary', 
  className = '', 
  disabled = false,
  ...props 
}) {
  const baseClasses = 'px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
  
  const variantClasses = {
    primary: 'bg-primary-500 text-white hover:bg-primary-600',
    secondary: 'bg-white text-text-primary border border-gray-300 hover:bg-gray-50',
    danger: 'bg-danger text-white hover:bg-red-600',
    success: 'bg-banking-success text-white hover:bg-green-600',
    outline: 'bg-transparent border-2 border-primary-500 text-primary-500 hover:bg-primary-50',
  }
  
  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}
