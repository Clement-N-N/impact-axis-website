"use client";

import { useState } from "react";
import { CopySimpleIcon, FacebookLogoIcon, LinkedinLogoIcon, XLogoIcon } from "@phosphor-icons/react/dist/ssr";
import { getLocalizedText, type LocalizedText } from "@/components/sections/home-hero/types";
import type { Locale } from "@/i18n/routing";

const labels = {
  facebook: { en: "Share", fr: "Partager" } satisfies LocalizedText,
  x: { en: "Post", fr: "Publier" } satisfies LocalizedText,
  linkedin: { en: "Share", fr: "Partager" } satisfies LocalizedText,
  copy: { en: "Copy", fr: "Copier" } satisfies LocalizedText,
  copied: { en: "Copied", fr: "Copié" } satisfies LocalizedText,
};

function PillButton({ onClick, icon, label }: { onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm text-black"
    >
      {icon}
      {label}
    </button>
  );
}

export function ShareButtons({ title, locale }: { title: LocalizedText; locale: Locale }) {
  const [copied, setCopied] = useState(false);

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareTitle = getLocalizedText(title, locale);

  function openShare(url: string) {
    window.open(url, "_blank", "noopener,noreferrer");
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <PillButton
        icon={<FacebookLogoIcon weight="fill" className="h-4 w-4 text-[#1877F2]" />}
        label={getLocalizedText(labels.facebook, locale)}
        onClick={() =>
          openShare(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`)
        }
      />
      <PillButton
        icon={<XLogoIcon weight="fill" className="h-4 w-4" />}
        label={getLocalizedText(labels.x, locale)}
        onClick={() =>
          openShare(
            `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`,
          )
        }
      />
      <PillButton
        icon={<LinkedinLogoIcon weight="fill" className="h-4 w-4 text-[#0A66C2]" />}
        label={getLocalizedText(labels.linkedin, locale)}
        onClick={() =>
          openShare(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`)
        }
      />
      <PillButton
        icon={<CopySimpleIcon weight="bold" className="h-4 w-4" />}
        label={copied ? getLocalizedText(labels.copied, locale) : getLocalizedText(labels.copy, locale)}
        onClick={handleCopy}
      />
    </div>
  );
}
