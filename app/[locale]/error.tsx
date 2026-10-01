"use client";

import { useEffect } from "react";
import { ArrowClockwiseIcon, WarningIcon } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("error");

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 py-32 text-center">
      <span className="bg-impact-yellow/20 text-impact-blue flex h-16 w-16 items-center justify-center rounded-full">
        <WarningIcon weight="bold" className="h-8 w-8" />
      </span>

      <div className="flex flex-col gap-3">
        <p className="text-impact-yellow text-sm font-semibold tracking-wide uppercase">
          {t("eyebrow")}
        </p>
        <h1 className="text-4xl font-semibold text-black">{t("title")}</h1>
        <p className="text-impact-gray max-w-md">{t("description")}</p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4">
        <Button
          onClick={reset}
          variant="primary"
          icon={<ArrowClockwiseIcon weight="bold" className="h-4 w-4" />}
        >
          {t("retry")}
        </Button>
        <Button href="/" variant="outline">
          {t("home")}
        </Button>
      </div>
    </div>
  );
}
