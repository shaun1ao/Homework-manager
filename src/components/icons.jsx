function Icon({ size = 20, children, ...props }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

export function IconPlus(props) {
  return (
    <Icon {...props}>
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </Icon>
  );
}

export function IconArrowLeft(props) {
  return (
    <Icon {...props}>
      <path d="M19 12H5M5 12l7-7M5 12l7 7" />
    </Icon>
  );
}

export function IconTrash(props) {
  return (
    <Icon {...props}>
      <path d="M4 7h16M9 7V4h6v3M6 7l1 13a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-13" />
      <line x1="10" y1="11" x2="10" y2="17" />
      <line x1="14" y1="11" x2="14" y2="17" />
    </Icon>
  );
}

export function IconCalendar(props) {
  return (
    <Icon {...props}>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <line x1="3" y1="10" x2="21" y2="10" />
      <line x1="8" y1="3" x2="8" y2="7" />
      <line x1="16" y1="3" x2="16" y2="7" />
    </Icon>
  );
}

export function IconUsers(props) {
  return (
    <Icon {...props}>
      <circle cx="9" cy="8" r="3.25" />
      <path d="M3 20c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5" />
      <circle cx="17.5" cy="8.5" r="2.25" />
      <path d="M15.7 12.8c2.2.5 4 2.3 4.3 4.7" />
    </Icon>
  );
}

export function IconLogOut(props) {
  return (
    <Icon {...props}>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </Icon>
  );
}

export function IconChevronRight(props) {
  return (
    <Icon {...props}>
      <path d="M9 6l6 6-6 6" />
    </Icon>
  );
}

export function IconClipboard(props) {
  return (
    <Icon {...props}>
      <rect x="6" y="4" width="12" height="16" rx="2" />
      <rect x="9" y="2.25" width="6" height="3.5" rx="1" />
      <line x1="9" y1="10.5" x2="15" y2="10.5" />
      <line x1="9" y1="14.5" x2="15" y2="14.5" />
    </Icon>
  );
}

export function IconAcademicCap(props) {
  return (
    <Icon {...props}>
      <path d="M12 3 2 8l10 5 10-5-10-5z" />
      <path d="M6 10.5V16c0 1.5 2.7 3 6 3s6-1.5 6-3v-5.5" />
      <path d="M22 8v6" />
    </Icon>
  );
}

export function IconSettings(props) {
  return (
    <Icon {...props}>
      <line x1="4" y1="6" x2="20" y2="6" />
      <circle cx="9" cy="6" r="2" />
      <line x1="4" y1="12" x2="20" y2="12" />
      <circle cx="15" cy="12" r="2" />
      <line x1="4" y1="18" x2="20" y2="18" />
      <circle cx="7" cy="18" r="2" />
    </Icon>
  );
}

export function IconAlertCircle(props) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="9" />
      <line x1="12" y1="7.75" x2="12" y2="13" />
      <line x1="12" y1="16.25" x2="12" y2="16.35" />
    </Icon>
  );
}

export function IconInbox(props) {
  return (
    <Icon {...props}>
      <path d="M3 7l2-3h14l2 3" />
      <path d="M3 7v11a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7" />
      <path d="M3 7h18" />
      <path d="M9 7v3a3 3 0 0 0 6 0V7" />
    </Icon>
  );
}

export function IconUserPlus(props) {
  return (
    <Icon {...props}>
      <circle cx="9" cy="8" r="3.25" />
      <path d="M3 20c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5" />
      <line x1="18" y1="7" x2="18" y2="13" />
      <line x1="15" y1="10" x2="21" y2="10" />
    </Icon>
  );
}

export function IconLock(props) {
  return (
    <Icon {...props}>
      <rect x="5" y="10.5" width="14" height="9.5" rx="2" />
      <path d="M8 10.5V7a4 4 0 0 1 8 0v3.5" />
    </Icon>
  );
}
