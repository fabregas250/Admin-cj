export default function Card({ children, className = '', title, action }) {
  return (
    <div className={`stat-card ${className}`}>
      {title && (
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </div>
  )
}
