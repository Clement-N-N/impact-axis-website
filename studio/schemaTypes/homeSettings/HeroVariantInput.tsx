import { set } from "sanity";
import type { StringInputProps } from "sanity";
import { Box, Card, Grid, Text } from "@sanity/ui";

import promoCardThumb from "./thumbnails/promo-card.svg";
import overlayWelcomeThumb from "./thumbnails/overlay-welcome.svg";
import collageDarkThumb from "./thumbnails/collage-dark.svg";
import collageDescriptionThumb from "./thumbnails/collage-description.svg";
import fullbleedOverlayThumb from "./thumbnails/fullbleed-overlay.svg";

interface HeroVariantOption {
  value: string;
  title: string;
  thumbnail: string;
}

const HERO_VARIANT_OPTIONS: HeroVariantOption[] = [
  { value: "promo-card", title: "Promo Card", thumbnail: promoCardThumb },
  { value: "overlay-welcome", title: "Overlay Welcome", thumbnail: overlayWelcomeThumb },
  { value: "collage-dark", title: "Collage Dark", thumbnail: collageDarkThumb },
  { value: "collage-description", title: "Collage Description", thumbnail: collageDescriptionThumb },
  { value: "fullbleed-overlay", title: "Fullbleed Overlay", thumbnail: fullbleedOverlayThumb },
];

export function HeroVariantInput(props: StringInputProps) {
  const { value, onChange, elementProps, readOnly } = props;

  return (
    <Grid
      columns={[2, 2, 3]}
      gap={3}
      role="radiogroup"
      aria-label="Hero variant"
      ref={elementProps.ref}
      onFocus={elementProps.onFocus}
      onBlur={elementProps.onBlur}
    >
      {HERO_VARIANT_OPTIONS.map((option) => {
        const selected = value === option.value;
        return (
          <Card
            key={option.value}
            as="button"
            type="button"
            radius={2}
            padding={2}
            tone={selected ? "primary" : "default"}
            shadow={selected ? 1 : 0}
            border
            role="radio"
            aria-checked={selected}
            disabled={readOnly}
            onClick={() => onChange(set(option.value))}
            style={{ cursor: readOnly ? "not-allowed" : "pointer", textAlign: "left" }}
          >
            <Box marginBottom={2}>
              <img
                src={option.thumbnail}
                alt=""
                width={160}
                height={90}
                style={{ display: "block", width: "100%", height: "auto", borderRadius: 4 }}
              />
            </Box>
            <Text size={1} weight={selected ? "bold" : "regular"}>
              {option.title}
            </Text>
          </Card>
        );
      })}
    </Grid>
  );
}
