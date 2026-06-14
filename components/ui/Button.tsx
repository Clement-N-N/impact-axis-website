import clsx from "clsx";
import { cva, type VariantProps } from "class-variance-authority";
import { Link } from "@/i18n/navigation";

const buttonStyles = cva(
  "inline-flex items-center gap-3 text-sm font-medium transition-colors",
  {
    variants: {
      variant: {
        primary: "bg-impact-yellow text-black py-1 pr-6",
        dark: "bg-black text-white py-1 pr-6",
        text: "text-black underline-offset-4 hover:underline px-6 py-1",
      },
    },
    defaultVariants: { variant: "primary" },
  }
);

const iconBoxStyles = "flex h-10 w-10 shrink-0 items-center justify-center";

type ButtonProps = VariantProps<typeof buttonStyles> & {
  children: React.ReactNode;
  icon?: React.ReactNode;
  href?: string;
  className?: string;
  onClick?: () => void;
};

export function Button({ children, icon, href, variant, className, onClick }: ButtonProps) {
  const content = (
    <>
      {icon && <span className={iconBoxStyles}>{icon}</span>}
      <span className={clsx(!icon && "px-6")}>{children}</span>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={clsx(buttonStyles({ variant }), className)}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={clsx(buttonStyles({ variant }), className)}>
      {content}
    </button>
  );
}
