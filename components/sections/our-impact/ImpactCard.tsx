import Image from "next/image";
import { getLocalizedText } from "@/components/sections/home-hero/types";
import type { Locale } from "@/i18n/routing";
import type { ImpactMetric } from "./types";

export function ImpactCard({ metric, locale }: { metric: ImpactMetric; locale: Locale }) {
  return (
    <div className="flex flex-col gap-6" style={{ backgroundImage: metric.background }}>
      <div className="flex min-h-32 flex-col p-6">
        <span className="text-[clamp(1.75rem,3vw,2.5rem)] font-medium text-black">{metric.number}</span>
        <span className="text-[clamp(1rem,1.25vw,1.125rem)] text-black">
          {getLocalizedText(metric.label, locale)}
        </span>
      </div>
      <div className="relative h-[200px] w-full overflow-hidden">
        <Image src={metric.image} alt="" fill className="object-cover h-full" />
      </div>
    </div>
  );
}
