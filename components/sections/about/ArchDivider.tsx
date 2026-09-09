"use client";

export function ArchDivider() {
  return (
    <div className="relative h-14 w-full overflow-hidden bg-[#101a3a]">
      <div className="flex h-full w-full items-center justify-between opacity-30">
        <div
          className="h-full w-full"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, #1d4ed8 0, #1d4ed8 14px, #101a3a 14px, #101a3a 28px)",
          }}
        />
      </div>
    </div>
  );
}
