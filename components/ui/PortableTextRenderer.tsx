import { PortableText, type PortableTextComponents, type PortableTextBlock } from "@portabletext/react";

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="mb-4 last:mb-0">{children}</p>,
    h3: ({ children }) => <h3 className="mb-3 text-xl font-medium">{children}</h3>,
    h4: ({ children }) => <h4 className="mb-2 text-lg font-medium">{children}</h4>,
    blockquote: ({ children }) => (
      <blockquote className="mb-4 border-l-2 pl-4 italic">{children}</blockquote>
    ),
  },
};

export function PortableTextRenderer({ value }: { value: PortableTextBlock[] }) {
  return <PortableText value={value} components={components} />;
}
