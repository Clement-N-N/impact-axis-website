import { Link } from "@/i18n/navigation";

/**
 * Links typed into the Studio can point at a page on this site ("/what-we-do")
 * or another website. Site pages go through the locale-aware Link so French
 * readers stay in French; other sites open in a new tab.
 */
export function SmartLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
}) {
  if (href.startsWith("/") && !href.startsWith("//")) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }
  const external = /^https?:\/\//.test(href);
  return (
    <a
      href={href}
      className={className}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {children}
    </a>
  );
}
