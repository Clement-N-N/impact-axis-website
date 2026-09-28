import { ArrowRightIcon, CompassIcon } from "@phosphor-icons/react/dist/ssr";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui";

export default async function NotFound() {
  const t = await getTranslations("notFound");

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 py-32 text-center">
      <span className="bg-impact-yellow/20 text-impact-blue flex h-16 w-16 items-center justify-center rounded-full">
        <CompassIcon weight="bold" className="h-8 w-8" />
      </span>

      <div className="flex flex-col gap-3">
        <p className="text-impact-yellow text-sm font-semibold tracking-wide uppercase">
          {t("eyebrow")}
        </p>
        <h1 className="text-4xl font-semibold text-black">{t("title")}</h1>
        <p className="text-impact-gray max-w-md">{t("description")}</p>
      </div>

      <Button href="/" variant="primary" icon={<ArrowRightIcon weight="bold" className="h-4 w-4" />}>
        {t("cta")}
      </Button>
    </div>
  );
}
