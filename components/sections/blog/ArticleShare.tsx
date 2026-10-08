"use client";

import { useState } from "react";
import clsx from "clsx";
import { CheckIcon, FacebookLogoIcon, LinkIcon, LinkedinLogoIcon, WhatsappLogoIcon, XLogoIcon } from "@phosphor-icons/react";

/**
 * Round share buttons. Stacked and sticky beside the article on large
 * screens, in a row under the header elsewhere. WhatsApp is included because
 * it is how most readers in Cameroon share links.
 */
export function ArticleShare({
  title,
  label,
  copyLabel,
  copiedLabel,
  direction,
}: {
  title: string;
  label: string;
  copyLabel: string;
  copiedLabel: string;
  direction: "row" | "column";
}) {
  const [copied, setCopied] = useState(false);

  const open = (network: "whatsapp" | "linkedin" | "facebook" | "x") => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(title);
    const targets = {
      whatsapp: `https://wa.me/?text=${text}%20${url}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      x: `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
    };
    window.open(targets[network], "_blank", "noopener,noreferrer,width=640,height=560");
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard can be blocked (e.g. insecure context); nothing else to do.
    }
  };

  const btn =
    "text-impact-blue hover:bg-impact-blue grid size-11 place-items-center rounded-full border border-[#d9dcea] bg-white transition-colors hover:border-impact-blue hover:text-white focus-visible:outline-impact-blue focus-visible:outline-2 focus-visible:outline-offset-2";

  return (
    <div
      role="group"
      aria-label={label}
      className={clsx("flex gap-2.5", direction === "column" ? "sticky top-[calc(var(--header-height)+2rem)] flex-col" : "flex-row")}
    >
      <button type="button" className={btn} onClick={() => open("whatsapp")} aria-label="WhatsApp">
        <WhatsappLogoIcon weight="fill" className="size-5" />
      </button>
      <button type="button" className={btn} onClick={() => open("linkedin")} aria-label="LinkedIn">
        <LinkedinLogoIcon weight="fill" className="size-5" />
      </button>
      <button type="button" className={btn} onClick={() => open("facebook")} aria-label="Facebook">
        <FacebookLogoIcon weight="fill" className="size-5" />
      </button>
      <button type="button" className={btn} onClick={() => open("x")} aria-label="X">
        <XLogoIcon weight="fill" className="size-5" />
      </button>
      <button type="button" className={btn} onClick={copy} aria-label={copied ? copiedLabel : copyLabel}>
        {copied ? <CheckIcon weight="bold" className="size-5" /> : <LinkIcon weight="bold" className="size-5" />}
      </button>
      <span aria-live="polite" className="sr-only">
        {copied ? copiedLabel : ""}
      </span>
    </div>
  );
}
