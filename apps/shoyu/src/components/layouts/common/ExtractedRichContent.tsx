import React, { useMemo } from 'react';
import {
  ExtractedNodes,
  MediaElement,
  mediaOrientationToSlateAlignment,
  SlateRendererOptions,
  SlateRendererSpacingOptions,
} from 'bento-common/types/slate';
import {
  AlignmentEnum,
  FillEnum,
  MediaOrientation,
  VerticalAlignmentEnum,
} from 'bento-common/types';
import { isEdgeToEdge } from 'bento-common/utils/image';

import SlateContentRenderer from '../../../system/RichTextEditor/SlateContentRenderer';

type Props = {
  extractedNodes: ExtractedNodes;
  width?: string;
  allowMarginless?: boolean;
  mediaOrientation?: MediaOrientation | null;
  verticalMediaAlignment?: VerticalAlignmentEnum;
  horizontalMediaAlignment?: AlignmentEnum;
  mediaFontSize?: number;
  mediaTextColor?: string;
  spacing?: SlateRendererSpacingOptions;
};

export default function ExtractedRichContent({
  extractedNodes,
  width,
  allowMarginless,
  verticalMediaAlignment,
  horizontalMediaAlignment,
  mediaOrientation,
  mediaFontSize,
  mediaTextColor,
  spacing = { yPadding: 16 },
}: React.PropsWithChildren<Props>) {
  const { updatedExtractedNodes, extractedNodesCount } = useMemo(() => {
    let extractedNodesCount = 0;
    return {
      updatedExtractedNodes: extractedNodes
        ? // when a fixed height is set all media should be edge-to-edge
          Object.fromEntries(
            Object.entries(extractedNodes as MediaElement).map(([k, nodes]) => {
              extractedNodesCount += nodes.length;
              return [
                k,
                nodes.map((n: MediaElement) => ({
                  ...n,
                  // force image width if a fixed width is set
                  fill:
                    width && (!allowMarginless || !isEdgeToEdge(n.fill))
                      ? FillEnum.full
                      : n.fill,
                })),
              ];
            })
          )
        : {},
      extractedNodesCount,
    };
  }, [extractedNodes, width, allowMarginless]);

  const slateOptions = useMemo<SlateRendererOptions>(() => {
    const isMediaCarousel = extractedNodesCount > 1;
    return {
      carousel: true,
      allowMarginlessImages: allowMarginless,
      alignment: {
        media:
          // Media set to the right should be centered.
          mediaOrientation === MediaOrientation.Left && !isMediaCarousel
            ? mediaOrientationToSlateAlignment[mediaOrientation]
            : undefined,
      },
      verticalMediaAlignment,
      horizontalMediaAlignment,
    };
  }, [
    updatedExtractedNodes,
    allowMarginless,
    mediaOrientation,
    extractedNodesCount,
    verticalMediaAlignment,
    horizontalMediaAlignment,
  ]);

  return (
    <>
      {Object.entries(updatedExtractedNodes).map(
        ([type, nodes]) =>
          nodes.length > 0 && (
            <SlateContentRenderer
              spacing={spacing}
              body={nodes}
              options={slateOptions}
              key={type}
              className="w-full h-full"
              style={{
                color: mediaTextColor,
                fontSize: mediaFontSize,
              }}
            />
          )
      )}
    </>
  );
}
