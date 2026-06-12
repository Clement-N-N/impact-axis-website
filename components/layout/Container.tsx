import clsx from "clsx";

export function Container({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        "w-full px-6 md:px-12 lg:px-16 xl:px-container",
        className
      )}
    >
      {children}
    </div>
  );
}
