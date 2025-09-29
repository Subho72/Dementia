export function CognitiveLogo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <div className={`${className} relative`}>
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        {/* Brain outline */}
        <path
          d="M20 4C14.5 4 10 8.5 10 14C10 16 10.5 17.8 11.4 19.3C10.6 20.8 10 22.5 10 24.5C10 30 14.5 34.5 20 34.5C25.5 34.5 30 30 30 24.5C30 22.5 29.4 20.8 28.6 19.3C29.5 17.8 30 16 30 14C30 8.5 25.5 4 20 4Z"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
        />
        {/* Neural connections */}
        <circle cx="16" cy="12" r="1.5" fill="currentColor" />
        <circle cx="24" cy="12" r="1.5" fill="currentColor" />
        <circle cx="20" cy="16" r="1.5" fill="currentColor" />
        <circle cx="14" cy="20" r="1.5" fill="currentColor" />
        <circle cx="26" cy="20" r="1.5" fill="currentColor" />
        <circle cx="20" cy="24" r="1.5" fill="currentColor" />

        {/* Connection lines */}
        <path
          d="M16 12L20 16M24 12L20 16M20 16L14 20M20 16L26 20M14 20L20 24M26 20L20 24"
          stroke="currentColor"
          strokeWidth="1"
          opacity="0.6"
        />
      </svg>
    </div>
  )
}
