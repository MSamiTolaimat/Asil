/* أيقونات خطّية بسيطة (24×24) */
export default function Icon({ name }) {
  const common = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
    className: "icon",
  };
  switch (name) {
    case "wifi":
      return (
        <svg {...common}>
          <path d="M2 9a15 15 0 0 1 20 0M5 12.5a10 10 0 0 1 14 0M8.5 16a5 5 0 0 1 7 0" />
          <circle cx="12" cy="19.5" r="1" />
        </svg>
      );
    case "bolt":
      return (
        <svg {...common}>
          <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8z" />
        </svg>
      );
    case "growth":
      return (
        <svg {...common}>
          <path d="M3 20h5v-5h5v-5h5V5h3" />
        </svg>
      );
    case "mind":
      return (
        <svg {...common}>
          <path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z" />
        </svg>
      );
    case "sport":
      return (
        <svg {...common}>
          <path d="M6 7v10M3 9.5v5M18 7v10M21 9.5v5M6 12h12" />
        </svg>
      );
    case "feather":
      return (
        <svg {...common}>
          <path d="M20 4c-8 0-14 5-14 12v4M20 4c0 8-5 12-12 12M6 20l8-8" />
        </svg>
      );
    case "nest":
      return (
        <svg {...common}>
          <path d="M3 12c1 6 17 6 18 0H3z" />
          <ellipse cx="12" cy="8.5" rx="3" ry="3.8" />
        </svg>
      );
    case "branch":
      return (
        <svg {...common}>
          <path d="M3 19c7 0 12-4 18-11M10 16l2-6M15 12.5l4 .5" />
        </svg>
      );
    case "summit":
      return (
        <svg {...common}>
          <path d="M2 20 9 7l4 7 3-4 6 10z" />
        </svg>
      );
    case "shield":
      return (
        <svg {...common}>
          <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      );
    case "arrow-down":
      return (
        <svg {...common}>
          <path d="M12 5v14M6 13l6 6 6-6" />
        </svg>
      );
    case "menu":
      return (
        <svg {...common}>
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      );
    case "close":
      return (
        <svg {...common}>
          <path d="M6 6l12 12M18 6 6 18" />
        </svg>
      );
    case "moon":
      return (
        <svg {...common}>
          <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" />
          <path d="M17 4v3M15.5 5.5h3" />
        </svg>
      );
    case "heart":
      return (
        <svg {...common}>
          <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" />
        </svg>
      );
    case "compass":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="m15.5 8.5-2 5-5 2 2-5z" />
        </svg>
      );
    case "arrow-left":
      return (
        <svg {...common}>
          <path d="M19 12H5M11 6l-6 6 6 6" />
        </svg>
      );
    case "image":
      return (
        <svg {...common}>
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <circle cx="9" cy="10" r="1.6" />
          <path d="m4 18 5-5 4 4 3-3 4 4" />
        </svg>
      );
    case "instagram":
      return (
        <svg {...common}>
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
        </svg>
      );
    case "facebook":
      return (
        <svg {...common}>
          <path d="M14 21v-8h2.7l.4-3H14V8.1c0-.9.3-1.6 1.7-1.6h1.7V3.8c-.3 0-1.4-.1-2.6-.1-2.6 0-4.4 1.6-4.4 4.5V10H8v3h2.4v8" />
        </svg>
      );
    case "whatsapp":
      return (
        <svg {...common}>
          <path d="M20.5 11.5a8.5 8.5 0 0 1-12.6 7.4L3.5 20l1.2-4.2A8.5 8.5 0 1 1 20.5 11.5Z" />
          <path d="M8.2 7.8c.3-.3.7-.2.9.1l1 1.5c.2.3.2.6 0 .8l-.6.7c.5 1 1.3 1.8 2.4 2.3l.7-.6c.2-.2.5-.2.8 0l1.5.9c.3.2.4.6.1.9l-.5.6c-.4.5-1.1.7-1.7.5-2.7-.8-4.8-2.8-5.7-5.5-.2-.7 0-1.4.5-1.8l.6-.4Z" />
        </svg>
      );
    default:
      return null;
  }
}
