type IconProps = React.SVGProps<SVGSVGElement>;

const defaults = {
  width: "1em",
  height: "1em",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg",
} as const;

export function PartnersIcon(props: IconProps) {
  return (
    <svg {...defaults} viewBox="0 0 32 32" {...props}>
      <circle cx="8.03081" cy="8.03081" r="8.03081" fill="currentColor" />
      <path
        d="M15.9397 8.03082C15.9397 3.59552 19.5352 0 23.9705 0V0C28.4058 0 32.0013 3.59552 32.0013 8.03081V8.03081C32.0013 12.4661 28.4058 16.0616 23.9705 16.0616H15.9397V8.03082Z"
        fill="currentColor"
      />
      <path
        d="M0 23.9692C0 19.5339 3.59552 15.9384 8.03081 15.9384H16.0616V23.9692C16.0616 28.4045 12.4661 32 8.03081 32V32C3.59552 32 0 28.4045 0 23.9692V23.9692Z"
        fill="currentColor"
      />
      <circle cx="23.9705" cy="23.9692" r="8.03081" fill="currentColor" />
    </svg>
  );
}

export function FundersIcon(props: IconProps) {
  return (
    <svg {...defaults} viewBox="0 0 33 32" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M32.1185 16.8057C32.1185 7.93637 24.9285 0.746399 16.0593 0.746399C7.18997 0.746399 0 7.93637 0 16.8057H32.1185Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M32.1193 30.2536C32.1193 21.3843 24.9292 14.1943 16.06 14.1943C7.1907 14.1943 0.000732422 21.3843 0.000732422 30.2536H32.1193Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function EcosystemIcon(props: IconProps) {
  return (
    <svg {...defaults} viewBox="0 0 32 32" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16 16H0V0C8.83656 7.72517e-07 16 7.16344 16 16ZM32 16V0C23.1635 0 16 7.16344 16 16H32ZM16 32H0V16C8.83656 16 16 23.1635 16 32ZM16 32H32V16C23.1635 16 16 23.1635 16 32Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function TalentedIcon(props: IconProps) {
  return (
    <svg {...defaults} viewBox="0 0 28 28" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7 0H0V14C0 21.7319 6.26801 28 14 28C21.7319 28 28 21.7319 28 14V0H21C17.134 0 14 3.13401 14 7C14 3.13401 10.866 0 7 0Z"
        fill="currentColor"
      />
    </svg>
  );
}
