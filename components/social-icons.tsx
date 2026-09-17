export function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect x="0" y="0" width="24" height="24" rx="6" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="12" cy="12" r="5.5" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="19" cy="5" r="1.3" fill="currentColor" />
    </svg>
  );
}

export function EmailIcon({ className }: { className?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect x="0" y="2" width="24" height="18" rx="2" stroke="currentColor" strokeWidth="1.4" />
      <path d="M1 4L12 13L23 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M12 0C5.4 0 0 5.4 0 12c0 2.1.6 4.1 1.6 5.9L0 24l6.3-1.6C8 23.4 10 24 12 24c6.6 0 12-5.4 12-12S18.6 0 12 0z"
        stroke="currentColor"
        strokeWidth="1.3"
      />
      <path
        d="M7.5 7.2c.3-.6.6-.6.9-.6h.7c.2 0 .5 0 .7.5s.8 1.9.8 2.1c0 .2 0 .3-.1.5-.1.2-.2.3-.3.5-.2.2-.3.3-.1.6.2.3.9 1.5 1.9 2.4 1.3 1.2 2.4 1.5 2.7 1.7.3.2.5.1.6-.1.2-.2.7-.8.9-1.1.2-.3.4-.2.6-.1.2.1 1.5.7 1.8.9.3.1.4.2.5.3.1.2.1.9-.2 1.7-.3.8-1.6 1.5-2.3 1.6-.6.1-1.3.1-2.1-.1-.5-.1-1.1-.3-1.9-.7-3.3-1.4-5.4-4.8-5.6-5-.2-.2-1.3-1.7-1.3-3.3s.8-2.3 1.1-2.6z"
        fill="currentColor"
      />
    </svg>
  );
}
