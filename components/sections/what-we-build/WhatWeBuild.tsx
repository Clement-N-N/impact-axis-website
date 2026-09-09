import type { Locale } from "@/i18n/routing";
import type { WhatWeBuildContent } from "./types";
import { WhatWeBuildOverlay } from "./WhatWeBuildOverlay";
import { WhatWeBuildCarousel } from "./WhatWeBuildCarousel";

export function WhatWeBuild({
  locale,
  data,
}: {
  locale: Locale;
  data?: WhatWeBuildContent;
}) {
  return (
    <>
      <WhatWeBuildOverlay locale={locale} data={data?.overlay} />
      <WhatWeBuildCarousel locale={locale} slides={data?.slides} />
    </>
  );
}
