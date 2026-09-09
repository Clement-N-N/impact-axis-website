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
      className="flex items-center gap-2 border border-border px-3 py-1.5 !text-sm text-black cursor-pointer hover:bg-black/5 active:scale-95 transition-all"
    >
      {icon}
      {label}
    </button>
  );
}

export function ShareButtons({ title, locale }: { title: LocalizedText; locale: Locale }) {
  const [copied, setCopied] = useState(false);

  function getShareUrl() {
    return typeof window !== "undefined" ? window.location.href : "";
  }

  function openShare(platform: "facebook" | "x" | "linkedin") {
    const url = getShareUrl();
    const shareTitle = getLocalizedText(title, locale);
    let shareIntent = "";

    switch (platform) {
      case "facebook":
        shareIntent = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case "x":
        shareIntent = `https://x.com/intent/post?url=${encodeURIComponent(url)}&text=${encodeURIComponent(shareTitle)}`;
        break;
      case "linkedin":
        shareIntent = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
    }

    if (shareIntent && typeof window !== "undefined") {
      window.open(shareIntent, "_blank", "noopener,noreferrer");
    }
  }

  async function handleCopy() {
    const url = getShareUrl();
    if (!url) return;

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = url;
        textArea.style.position = "fixed";
        textArea.style.opacity = "0";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
      <PillButton
        icon={<FacebookLogoIcon weight="fill" className="h-5 w-5 text-[#1877F2]" />}
        label={getLocalizedText(labels.facebook, locale)}
        onClick={() => openShare("facebook")}
      />
      <PillButton
        icon={<XLogoIcon weight="fill" className="h-5 w-5" />}
        label={getLocalizedText(labels.x, locale)}
        onClick={() => openShare("x")}
      />
      <PillButton
        icon={<LinkedinLogoIcon weight="fill" className="h-5 w-5 text-[#0A66C2]" />}
        label={getLocalizedText(labels.linkedin, locale)}
        onClick={() => openShare("linkedin")}
      />
      <PillButton
        icon={<CopySimpleIcon weight="bold" className="h-5 w-5" />}
        label={copied ? getLocalizedText(labels.copied, locale) : getLocalizedText(labels.copy, locale)}
        onClick={handleCopy}
      />
    </div>
  );
}
