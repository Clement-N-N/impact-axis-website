import clsx from "clsx";
import { cva } from "class-variance-authority";

const tabStyles = cva(
  "rounded-full px-4 py-2 text-sm font-medium transition-colors",
  {
    variants: {
      active: {
        true: "bg-impact-yellow text-black",
        false: "border border-border bg-white text-black hover:border-black",
      },
    },
    defaultVariants: { active: false },
  },
);

export function EventFilterTab({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count?: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={clsx(tabStyles({ active }))}
    >
      {label}
      {typeof count === "number" && <sup className="ml-1">{count}</sup>}
    </button>
  );
}
