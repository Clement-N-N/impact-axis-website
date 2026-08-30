import clsx from "clsx";
import { cva, type VariantProps } from "class-variance-authority";
import { Link } from "@/i18n/navigation";

const buttonStyles = cva(
  "group relative inline-grid items-center overflow-hidden font-medium transition-colors",
  {
    variants: {
      variant: {
        primary: "border border-impact-yellow bg-impact-yellow py-1.5 px-1.5 text-black",
        transparent: "py-1.5 px-1.5 text-black",
        dark: "border border-black bg-black py-1.5 px-1.5 text-white",
        white: "border border-white bg-white py-1.5 px-1.5 text-black",
        outline: "border border-border bg-white py-1.5 px-1.5 text-black",
        "primary-flush": "bg-transparent text-black",
        "dark-flush": "bg-black text-white",
        "outline-white": "border border-white bg-transparent py-1.5 px-1.5 text-white",
      },
      width: {
        fit: "w-fit",
        full: "w-full",
      },
    },
    defaultVariants: { variant: "primary", width: "fit" },
  }
);

const HOVER_TRANSITION = "duration-300 ease-[cubic-bezier(0.65,0,0.35,1)]";

type Variant = NonNullable<VariantProps<typeof buttonStyles>["variant"]>;

// `hoverText` must be a complete, literal "group-hover:text-*" string per
// variant (not built via string concatenation, e.g. `group-hover:${text}`) —
// Tailwind's compiler statically scans source text for whole class names and
// never executes this file, so a class assembled at runtime is invisible to
// it: no CSS rule gets generated, the class does nothing, and the label
// silently never recolors on hover.
const iconBoxColors: Record<Variant, { bg: string; text: string; hoverText: string; flush?: boolean }> = {
  primary: { bg: "bg-black", text: "text-white", hoverText: "group-hover:text-white" },
  transparent: { bg: "bg-black", text: "text-white", hoverText: "group-hover:text-white" },
  dark: { bg: "bg-white", text: "text-black", hoverText: "group-hover:text-black" },
  white: { bg: "bg-black", text: "text-white", hoverText: "group-hover:text-white" },
  outline: { bg: "bg-black", text: "text-white", hoverText: "group-hover:text-white" },
  "primary-flush": { bg: "bg-impact-yellow", text: "text-black", hoverText: "group-hover:text-black", flush: true },
  "dark-flush": { bg: "bg-white", text: "text-black", hoverText: "group-hover:text-black", flush: true },
  "outline-white": { bg: "bg-white", text: "text-black", hoverText: "group-hover:text-black" },
};

type ButtonProps = VariantProps<typeof buttonStyles> & {
  children: React.ReactNode;
  icon?: React.ReactNode;
  href?: string;
  className?: string;
  onClick?: () => void;
};

export function Button({ children, icon, href, variant, width, className, onClick }: ButtonProps) {
  const resolvedVariant = variant ?? "primary";
  const resolvedWidth = width ?? "fit";

  // "full" buttons center their content, so the icon box can sit anywhere
  // depending on label length. It can no longer be a separate layer growing
  // to the button's width (that only lines up with the label when left-
  // aligned) — instead it grows from its own center, oversized and clipped
  // by the button's overflow-hidden, so the fill always originates from
  // wherever the box actually is.
  const content =
    resolvedWidth === "full" ? (
      <span className="relative z-10 flex w-full items-center justify-center gap-3 px-6">
        {icon ? (
          <span className="relative flex h-[30px] w-[30px] shrink-0 items-center justify-center">
            {/* Grows to 200vw/200vh, always overshooting the button's padding
                box, so it already reaches the true edge (clipped by the
                root's overflow-hidden at the padding edge, leaving any
                border visible) — no further fix needed here. */}
            <span
              className={clsx(
                "absolute left-1/2 top-1/2 h-[30px] w-[30px] -translate-x-1/2 -translate-y-1/2 transition-[width,height]",
                HOVER_TRANSITION,
                "group-hover:h-[200vh] group-hover:w-[200vw]",
                iconBoxColors[resolvedVariant].bg,
              )}
            />
            <span
              className={clsx(
                "relative flex transition-[translate,color] [&>svg]:h-4 [&>svg]:w-4",
                HOVER_TRANSITION,
                "group-hover:translate-x-1",
                iconBoxColors[resolvedVariant].text,
                iconBoxColors[resolvedVariant].hoverText,
              )}
            >
              {icon}
            </span>
          </span>
        ) : (
          // No icon to anchor the reveal to, so it grows from the button's
          // own center instead — same technique, different origin.
          <span
            className={clsx(
              "pointer-events-none absolute left-1/2 top-1/2 h-0 w-0 -translate-x-1/2 -translate-y-1/2 transition-[width,height]",
              HOVER_TRANSITION,
              "group-hover:h-[200vh] group-hover:w-[200vw]",
              iconBoxColors[resolvedVariant].bg,
            )}
          />
        )}
        <span
          className={clsx(
            "relative transition-[color,translate]",
            HOVER_TRANSITION,
            "group-hover:-translate-x-1",
            iconBoxColors[resolvedVariant].hoverText,
          )}
        >
          {children}
        </span>
      </span>
    ) : (
      <>
        {/* One element holds both the fill background and the icon glyph, so
            they share a single coordinate system and can never drift apart.
            No [grid-area] here on purpose: an absolutely-positioned grid item
            with no explicit grid placement uses the grid container's padding
            box as its containing block, so growing to left-0/w-full/h-full
            reaches the button's own padding edge — right up to the border —
            for every variant, regardless of its own padding. At rest it sits
            at the same inset as the label (left-1.5, matching the button's
            own py-1.5/px-1.5) so icon and label share one resting frame;
            flush variants have no padding to match, so they rest at the true
            edge already. Rendered unconditionally (not just when there's an
            icon) so every button gets a hover reveal; without an icon it
            starts at 0x0 and has nothing inside it. */}
        <span
          className={clsx(
            "absolute top-1/2 flex -translate-y-1/2 items-center justify-start pl-[7px] transition-[left,width,height]",
            HOVER_TRANSITION,
            iconBoxColors[resolvedVariant].flush ? "left-0" : "left-1.5",
            icon ? "h-[30px] w-[30px]" : "h-0 w-0",
            "group-hover:left-0 group-hover:h-full group-hover:w-full",
            iconBoxColors[resolvedVariant].bg,
          )}
        >
          {icon && (
            <span
              className={clsx(
                "flex transition-[translate] [&>svg]:h-4 [&>svg]:w-4",
                HOVER_TRANSITION,
                "group-hover:translate-x-1.5",
                iconBoxColors[resolvedVariant].text,
              )}
            >
              {icon}
            </span>
          )}
        </span>
        <span
          className={clsx(
            "[grid-area:1/1] z-10 flex items-center",
            icon ? "min-h-[30px] pl-[42px]" : "px-6",
            "transition-[color,translate]",
            HOVER_TRANSITION,
            "group-hover:-translate-x-1.5",
            iconBoxColors[resolvedVariant].hoverText,
          )}
        >
          {children}
        </span>
      </>
    );

  if (href) {
    return (
      <Link href={href} className={clsx(buttonStyles({ variant, width }), className)}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={clsx(buttonStyles({ variant, width }), className)}>
      {content}
    </button>
  );
}
