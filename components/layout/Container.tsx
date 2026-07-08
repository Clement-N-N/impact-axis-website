import clsx from "clsx";

export const CONTAINER_PADDING_CLASSES = "px-6 md:px-12 lg:px-16 xl:px-container";

export function Container({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={clsx("w-full", CONTAINER_PADDING_CLASSES, className)}>
      {children}
    </div>
  );
}
