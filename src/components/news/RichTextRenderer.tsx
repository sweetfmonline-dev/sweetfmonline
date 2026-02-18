"use client";

import { documentToReactComponents, Options } from "@contentful/rich-text-react-renderer";
import { BLOCKS, INLINES, Document } from "@contentful/rich-text-types";
import Image from "next/image";

const options: Options = {
  renderNode: {
    [BLOCKS.PARAGRAPH]: (node, children) => (
      <p className="mb-4 leading-relaxed">{children}</p>
    ),
    [BLOCKS.HEADING_1]: (node, children) => (
      <h1 className="text-3xl font-bold mt-8 mb-4">{children}</h1>
    ),
    [BLOCKS.HEADING_2]: (node, children) => (
      <h2 className="text-2xl font-bold mt-6 mb-3">{children}</h2>
    ),
    [BLOCKS.HEADING_3]: (node, children) => (
      <h3 className="text-xl font-bold mt-5 mb-2">{children}</h3>
    ),
    [BLOCKS.HEADING_4]: (node, children) => (
      <h4 className="text-lg font-bold mt-4 mb-2">{children}</h4>
    ),
    [BLOCKS.UL_LIST]: (node, children) => (
      <ul className="list-disc pl-6 mb-4 space-y-1">{children}</ul>
    ),
    [BLOCKS.OL_LIST]: (node, children) => (
      <ol className="list-decimal pl-6 mb-4 space-y-1">{children}</ol>
    ),
    [BLOCKS.LIST_ITEM]: (node, children) => (
      <li className="leading-relaxed">{children}</li>
    ),
    [BLOCKS.QUOTE]: (node, children) => (
      <blockquote className="border-l-4 border-sweet-red pl-4 italic text-gray-600 my-4">
        {children}
      </blockquote>
    ),
    [BLOCKS.HR]: () => <hr className="my-8 border-gray-200" />,
    [BLOCKS.EMBEDDED_ASSET]: (node) => {
      const { title, file } = node.data?.target?.fields || {};
      if (!file?.url) return null;
      const url = file.url.startsWith("//") ? `https:${file.url}` : file.url;
      return (
        <figure className="my-6">
          <Image
            src={url}
            alt={title || ""}
            width={800}
            height={450}
            className="rounded-lg w-full h-auto"
          />
          {title && (
            <figcaption className="text-sm text-gray-500 mt-2 text-center">
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
        className="text-sweet-red hover:underline"
      >
        {children}
      </a>
    ),
  },
};

interface RichTextRendererProps {
  content: Document;
}

export function RichTextRenderer({ content }: RichTextRendererProps) {
  if (!content || !content.nodeType) return null;
  return (
    <div className="rich-text-content">
      {documentToReactComponents(content, options)}
    </div>
  );
}
