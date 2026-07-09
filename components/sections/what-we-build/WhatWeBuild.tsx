import type { Locale } from "@/i18n/routing";
import { WhatWeBuildOverlay } from "./WhatWeBuildOverlay";
import { WhatWeBuildCarousel } from "./WhatWeBuildCarousel";

export function WhatWeBuild({ locale }: { locale: Locale }) {
  return (
    <>
      <WhatWeBuildOverlay locale={locale} />
      <WhatWeBuildCarousel locale={locale} />
    </>
  );
}
