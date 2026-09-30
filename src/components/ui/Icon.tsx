import { cn } from "@/lib/utils";

/* A hand-built icon set so the whole site shares one stroke weight and
   corner radius. 24x24 grid, 1.7 stroke, round caps. */
const paths: Record<string, React.ReactNode> = {
  shingle: (
    <>
      <path d="M2 9.5 12 3.5l10 6" />
      <path d="M4 9.5v11h16v-11" />
      <path d="M4 13.5h16M4 17h16" />
      <path d="M8 13.5v3.5M12 13.5v3.5M16 13.5v3.5" />
    </>
  ),
  storm: (
    <>
      <path d="M7 16.5a4.5 4.5 0 0 1 .6-8.96 6 6 0 0 1 11.2 1.7A3.9 3.9 0 0 1 18 16.5" />
      <path d="m13 12-3 4.5h3.5L11 22" />
    </>
  ),
  wrench: (
    <>
      <path d="M14.7 6.3a4 4 0 0 0 5.3 5.3l-8 8a2.8 2.8 0 0 1-4-4z" />
      <path d="m14.7 6.3 2.4-2.4a1 1 0 0 1 1.5 0l1.5 1.5a1 1 0 0 1 0 1.5L17.7 9.3" />
    </>
  ),
  building: (
    <>
      <path d="M3 21h18" />
      <path d="M5 21V6l7-3 7 3v15" />
      <path d="M9 10h2M13 10h2M9 14h2M13 14h2" />
      <path d="M10.5 21v-3.5h3V21" />
    </>
  ),
  gutter: (
    <>
      <path d="M3 7.5 12 3l9 4.5" />
      <path d="M3 7.5v3h18v-3" />
      <path d="M6 10.5V19a2 2 0 0 0 2 2" />
      <path d="M12 13.5v1.5M15.5 13.5v1.5M18.5 13.5v1.5" />
    </>
  ),
  metal: (
    <>
      <path d="M4 20 12 4l8 16" />
      <path d="M8.6 11H15.4M6.9 14.5h10.2" />
      <path d="M12 4v16" />
    </>
  ),
  search: (
    <>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="m15.5 15.5 5 5" />
    </>
  ),
  foundation: (
    <>
      <path d="M3 10.5 12 4l9 6.5" />
      <path d="M5 9v6.5h14V9" />
      <path d="M3 15.5h18" />
      <path d="M6.5 15.5V21M12 15.5V21M17.5 15.5V21" />
    </>
  ),
  crawl: (
    <>
      <path d="M3 10 12 3.5 21 10" />
      <path d="M5 8.6V14h14V8.6" />
      <path d="M3 14h18M3 20.5h18" />
      <path d="M5 14v6.5M19 14v6.5" />
      <path d="M9 17.5h.01M12 17.5h.01M15 17.5h.01" />
    </>
  ),
  siding: (
    <>
      <path d="M4 20.5V9l8-5.5L20 9v11.5z" />
      <path d="M4 12h16M4 15h16M4 18h16" />
    </>
  ),
  crack: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="1.5" />
      <path d="m12 3.5-1.5 4 2.5 3-2 3.5 2 3-1 3.5" />
    </>
  ),
  phone: (
    <path d="M6.6 3.5h2.8l1.4 3.5-1.8 1.4a12 12 0 0 0 5.6 5.6l1.4-1.8 3.5 1.4v2.8a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.6 5.7a2 2 0 0 1 2-2.2Z" />
  ),
  arrowRight: (
    <>
      <path d="M4 12h15" />
      <path d="m13 6 6 6-6 6" />
    </>
  ),
  arrowUpRight: (
    <>
      <path d="M7 17 17 7" />
      <path d="M8 7h9v9" />
    </>
  ),
  check: <path d="m4.5 12.5 5 5 10-11" />,
  star: (
    <path d="m12 3.5 2.6 5.7 6.2.7-4.6 4.2 1.3 6.1L12 17.2l-5.5 3 1.3-6.1L3.2 9.9l6.2-.7z" />
  ),
  shield: (
    <>
      <path d="M12 3 5 5.8v5.6c0 4.3 2.9 8.2 7 9.6 4.1-1.4 7-5.3 7-9.6V5.8z" />
      <path d="m9 12 2.2 2.2L15.5 10" />
    </>
  ),
  calendar: (
    <>
      <rect x="3.5" y="5" width="17" height="15.5" rx="2.5" />
      <path d="M3.5 10h17M8 3v4M16 3v4" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.6" />
    </>
  ),
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  close: <path d="M6 6 18 18M18 6 6 18" />,
  chevronDown: <path d="m6 9.5 6 6 6-6" />,
  chevronRight: <path d="m9.5 6 6 6-6 6" />,
  calculator: (
    <>
      <rect x="4.5" y="3" width="15" height="18" rx="2.5" />
      <path d="M8 7.5h8" />
      <path d="M8.5 12h.01M12 12h.01M15.5 12h.01M8.5 16h.01M12 16h.01M15.5 16h.01" />
    </>
  ),
  ruler: (
    <>
      <rect x="2.5" y="8" width="19" height="8" rx="2" transform="rotate(-12 12 12)" />
      <path d="M7 9.4v2.2M10.4 8.7v3.2M13.8 8v2.2M17.2 7.3v3.2" />
    </>
  ),
  satellite: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 3a9 9 0 0 1 9 9M12 6.5a5.5 5.5 0 0 1 5.5 5.5" />
      <path d="M3 12a9 9 0 0 0 9 9M6.5 12a5.5 5.5 0 0 0 5.5 5.5" />
    </>
  ),
  sparkle: (
    <>
      <path d="M12 3.5 13.6 9 19 10.6 13.6 12.2 12 17.6 10.4 12.2 5 10.6 10.4 9z" />
      <path d="M18.5 16.5 19.2 18.8 21.5 19.5 19.2 20.2 18.5 22.5 17.8 20.2 15.5 19.5 17.8 18.8z" />
    </>
  ),
  quote: (
    <path d="M9.5 6C6.5 7.4 5 10 5 13.2V18h5.6v-5.6H8.2c0-2.3.8-3.9 2.4-4.8zm9 0c-3 1.4-4.5 4-4.5 7.2V18h5.6v-5.6h-2.4c0-2.3.8-3.9 2.4-4.8z" />
  ),
  play: <path d="M8 5.5v13l11-6.5z" />,
  mail: (
    <>
      <rect x="3" y="5.5" width="18" height="13" rx="2.5" />
      <path d="m4 8 8 5 8-5" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3.5 20a5.5 5.5 0 0 1 11 0" />
      <path d="M16 5.2a3.2 3.2 0 0 1 0 5.6M17.5 20a5.5 5.5 0 0 0-2-4.3" />
    </>
  ),
  leaf: (
    <>
      <path d="M20 4C10 4 4 8.5 4 15a5 5 0 0 0 5 5c6.5 0 11-6 11-16Z" />
      <path d="M4 20C7 14.5 11 11 16 9" />
    </>
  ),
  drop: <path d="M12 3.5c3.5 4 5.5 6.8 5.5 9.5a5.5 5.5 0 0 1-11 0c0-2.7 2-5.5 5.5-9.5Z" />,
  fire: (
    <path d="M12 3s1 2.5-.5 4.5S8 10 8 13a4 4 0 0 0 8 0c0-1.5-.6-2.6-1.4-3.4.4 1.4-.3 2.4-1.1 2.4-1 0-1.5-.9-1.5-2 0-2 2-3.4 2-5.5C14 3.9 12 3 12 3Z" />
  ),
  facebook: (
    <path d="M14.5 8.5V6.8c0-.8.3-1.3 1.3-1.3h1.4V2.6c-.5-.1-1.4-.2-2.4-.2-2.4 0-4 1.4-4 4.1v2H8v3h2.8v8h3.4v-8h2.6l.4-3z" />
  ),
  instagram: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="3.8" />
      <circle cx="17" cy="7" r="1" fill="currentColor" stroke="none" />
    </>
  ),
  youtube: (
    <>
      <rect x="2.5" y="6" width="19" height="12" rx="4" />
      <path d="m10.5 9.5 5 2.5-5 2.5z" />
    </>
  ),
  badge: (
    <>
      <circle cx="12" cy="9.5" r="5.5" />
      <path d="m9 14.5-1 7 4-2 4 2-1-7" />
      <path d="m10.2 9.4 1.3 1.3 2.4-2.6" />
    </>
  ),
  document: (
    <>
      <path d="M6 3.5h7l5 5v12a1.5 1.5 0 0 1-1.5 1.5h-10A1.5 1.5 0 0 1 5 20.5v-15A1.5 1.5 0 0 1 6.5 3.5Z" />
      <path d="M13 3.5v5h5" />
      <path d="M8.5 13h7M8.5 16.5h5" />
    </>
  ),
  wallet: (
    <>
      <rect x="3" y="6" width="18" height="13" rx="2.5" />
      <path d="M3 10h18" />
      <circle cx="16.5" cy="14.5" r="1.2" fill="currentColor" stroke="none" />
    </>
  ),
  alert: (
    <>
      <path d="M12 8.5v4.5" />
      <path d="M12 16.5h.01" />
      <circle cx="12" cy="12" r="9" />
    </>
  ),
  bolt: <path d="M13.5 2.5 5 13.5h6l-.5 8L19 10.5h-6z" />,
  loop: (
    <>
      <path d="M4 12a8 8 0 0 1 13.7-5.6L20 8.5" />
      <path d="M20 4v4.5h-4.5" />
      <path d="M20 12a8 8 0 0 1-13.7 5.6L4 15.5" />
      <path d="M4 20v-4.5h4.5" />
    </>
  ),
  message: (
    <>
      <path d="M20.5 12.5c0 3.9-3.8 7-8.5 7a10 10 0 0 1-2.6-.34L4 21l1.3-3.6A6.6 6.6 0 0 1 3.5 12.5c0-3.9 3.8-7 8.5-7s8.5 3.1 8.5 7Z" />
      <path d="M8.5 12h.01M12 12h.01M15.5 12h.01" />
    </>
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="12" cy="12" r="0.8" fill="currentColor" stroke="none" />
    </>
  ),
};

export type IconKey = keyof typeof paths;

export function Icon({
  name,
  className,
  filled = false,
}: {
  name: IconKey;
  className?: string;
  filled?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke={filled ? "none" : "currentColor"}
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={cn("size-6 shrink-0", className)}
    >
      {paths[name]}
    </svg>
  );
}
