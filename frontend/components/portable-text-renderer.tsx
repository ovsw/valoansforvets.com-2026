import { PortableText, type PortableTextProps } from "@portabletext/react";
import Image from "next/image";
import { simpleRichTextComponents } from "@/components/simple-rich-text";

const components: PortableTextProps["components"] = {
  ...simpleRichTextComponents,
  types: {
    image: ({ value }) => {
      const asset = value.asset;
      const dimensions = asset?.metadata?.dimensions;
      if (!asset?.url || !dimensions) return null;
      return (
        <Image
          className="mx-auto h-auto max-w-full rounded-lg"
          alt={value.alt || ""}
          src={asset.url}
          width={dimensions.width}
          height={dimensions.height}
          placeholder={asset.metadata.lqip ? "blur" : undefined}
          blurDataURL={asset.metadata.lqip || undefined}
          sizes="(min-width: 1024px) 50vw, 100vw"
        />
      );
    },
  },
};

// Section blocks own their source spacing; prose must not add inline margins.
export default function PortableTextRenderer({
  value,
}: {
  value: PortableTextProps["value"];
}) {
  return <PortableText components={components} value={value} />;
}
