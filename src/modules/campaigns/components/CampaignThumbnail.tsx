"use client";

import {
  ThumbnailFallback,
  ThumbnailImage,
  ThumbnailWrapper,
} from "./CampaignThumbnail.styles";

type CampaignThumbnailProps = {
  name: string;
  imageUrl: string | null;
  size?: "sm" | "lg";
};

export function CampaignThumbnail({
  name,
  imageUrl,
  size = "sm",
}: CampaignThumbnailProps) {
  return (
    <ThumbnailWrapper $size={size}>
      {imageUrl ? (
        <ThumbnailImage src={imageUrl} alt={`${name} cover`} />
      ) : (
        <ThumbnailFallback>{name.charAt(0).toUpperCase()}</ThumbnailFallback>
      )}
    </ThumbnailWrapper>
  );
}
