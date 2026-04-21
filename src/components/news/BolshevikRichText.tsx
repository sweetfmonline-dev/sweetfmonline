"use client";

import { documentToReactComponents, Options } from "@contentful/rich-text-react-renderer";
import { BLOCKS, INLINES, Document } from "@contentful/rich-text-types";
import Image from "next/image";

// Magazine-style rich text renderer for Bolshevik Report
// Blockquotes render as dramatic pull-quotes, headings as section dividers
const options: Options = {
  renderNode: {
    [BLOCKS.PARAGRAPH]: (node, children) => (
      <p className="mb-6 text-lg lg:text-xl leading-[1.75] text-[#1a1a1a]">
        {children}
      </p>
    ),
    [BLOCKS.HEADING_1]: (node, children) => (
      <h2 className="font-serif text-3xl lg:text-4xl font-bold text-[#1a1a1a] mt-12 mb-5 leading-tight">
        {children}
      </h2>
    ),
    [BLOCKS.HEADING_2]: (node, children) => (
      <h2 className="font-serif text-2xl lg:text-3xl font-bold text-[#1a1a1a] mt-10 mb-4 leading-tight">
        {children}
      </h2>
    ),
    [BLOCKS.HEADING_3]: (node, children) => (
      <h3 className="font-serif text-xl lg:text-2xl font-bold text-[#1a1a1a] mt-8 mb-3">
        {children}
      </h3>
    ),
    [BLOCKS.HEADING_4]: (node, children) => (
      <h4 className="text-xs uppercase tracking-[0.25em] text-[#b00000] font-bold mt-10 mb-3">
        {children}
      </h4>
    ),
    [BLOCKS.UL_LIST]: (node, children) => (
      <ul className="list-disc pl-6 mb-6 space-y-2 text-lg leading-relaxed">
        {children}
      </ul>
    ),
    [BLOCKS.OL_LIST]: (node, children) => (
      <ol className="list-decimal pl-6 mb-6 space-y-2 text-lg leading-relaxed">
        {children}
      </ol>
    ),
    [BLOCKS.LIST_ITEM]: (node, children) => (
      <li className="leading-relaxed">{children}</li>
    ),
    // Pull-quote treatment — magazine style
    [BLOCKS.QUOTE]: (node, children) => (
      <blockquote className="my-10 lg:my-12 relative">
        <div className="absolute -top-6 left-0 text-[#b00000] font-serif text-7xl leading-none opacity-70 select-none">
          &ldquo;
        </div>
        <div className="border-l-4 border-[#b00000] pl-6 lg:pl-8 py-2">
          <div className="font-serif text-2xl lg:text-3xl italic text-[#1a1a1a] leading-snug [&>p]:mb-0 [&>p]:text-2xl lg:[&>p]:text-3xl [&>p]:italic">
            {children}
          </div>
        </div>
      </blockquote>
    ),
    [BLOCKS.HR]: () => (
      <hr className="my-12 border-0 h-px bg-gradient-to-r from-transparent via-[#1a1a1a]/30 to-transparent" />
    ),
    [BLOCKS.EMBEDDED_ASSET]: (node) => {
      const { title, file } = node.data?.target?.fields || {};
      if (!file?.url) return null;
      const url = file.url.startsWith("//") ? `https:${file.url}` : file.url;
      return (
        <figure className="my-10">
          <Image
            src={url}
            alt={title || ""}
            width={1200}
            height={675}
            className="w-full h-auto shadow-lg"
          />
          {title && (
            <figcaption className="text-xs uppercase tracking-wider text-[#1a1a1a]/50 mt-3 text-center">
              {title}
            </figcaption>
          )}
        </figure>
      );
    },
    [INLINES.HYPERLINK]: (node, children) => (
      <a
        href={node.data.uri}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[#b00000] underline decoration-[#b00000]/30 underline-offset-4 hover:decoration-[#b00000] transition-colors"
      >
        {children}
      </a>
    ),
  },
};

interface BolshevikRichTextProps {
  content: Document;
}

export function BolshevikRichText({ content }: BolshevikRichTextProps) {
  if (!content || !content.nodeType) return null;
  return (
    <div className="bolshevik-article">
      {documentToReactComponents(content, options)}
    </div>
  );
}
