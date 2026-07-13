import clsx from "clsx";
import { cva, type VariantProps } from "class-variance-authority";
import { Link } from "@/i18n/navigation";

const buttonStyles = cva(
  "group inline-grid w-fit items-center font-medium transition-colors",
  {
    variants: {
      variant: {
        primary: "border border-impact-yellow bg-impact-yellow py-3 pl-3 pr-4 text-black",
        dark: "border border-black bg-black py-3 pl-3 pr-4 text-white",
        white: "border border-white bg-white py-3 pl-3 pr-4 text-black",
        outline: "border border-border bg-white py-3 pl-3 pr-4 text-black",
        "primary-flush": "bg-transparent text-black",
        "dark-flush": "bg-black text-white",
        "outline-white": "border border-white bg-transparent py-3 pl-3 pr-4 text-white",
      },
    },
    defaultVariants: { variant: "primary" },
  }
);

const HOVER_TRANSITION = "duration-300 ease-[cubic-bezier(0.65,0,0.35,1)]";

const iconBoxColors: Record<NonNullable<VariantProps<typeof buttonStyles>["variant"]>, string> = {
  primary: "bg-black text-white",
  dark: "bg-white text-black",
  white: "bg-black text-white",
  outline: "bg-black text-white",
  "primary-flush": "bg-impact-yellow text-black",
  "dark-flush": "bg-white text-black",
  "outline-white": "bg-white text-black",
};

// Matches the text color of the icon box for each variant, so the label can
// transition to that color on hover.
const hoverTextColors: Record<NonNullable<VariantProps<typeof buttonStyles>["variant"]>, string> = {
  primary: "group-hover:text-white",
  dark: "group-hover:text-black",
  white: "group-hover:text-white",
  outline: "group-hover:text-white",
  "primary-flush": "group-hover:text-black",
  "dark-flush": "group-hover:text-black",
  "outline-white": "group-hover:text-black",
};

type ButtonProps = VariantProps<typeof buttonStyles> & {
  children: React.ReactNode;
  icon?: React.ReactNode;
  href?: string;
  className?: string;
  onClick?: () => void;
};

export function Button({ children, icon, href, variant, className, onClick }: ButtonProps) {
  const resolvedVariant = variant ?? "primary";

  const content = (
    <>
      {icon && (
        <span
          className={clsx(
            "[grid-area:1/1] flex h-[30px] w-[30px] items-center justify-start justify-self-start pl-[7px] transition-[width]",
            HOVER_TRANSITION,
            "group-hover:w-full",
            iconBoxColors[resolvedVariant],
          )}
        >
          <span
            className={clsx(
              "flex transition-[translate]",
              HOVER_TRANSITION,
              "group-hover:translate-x-1.5 [&>svg]:h-4 [&>svg]:w-4",
            )}
          >
            {icon}
          </span>
        </span>
      )}
      <span
        className={clsx(
          "[grid-area:1/1] z-10",
          icon ? "pl-[42px]" : "px-6",
          "transition-[color,translate]",
          HOVER_TRANSITION,
          "group-hover:-translate-x-1.5",
          hoverTextColors[resolvedVariant],
        )}
      >
        {children}
      </span>
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
