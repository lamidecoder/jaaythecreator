import type { MediaAsset } from "./projects";

export type GalleryImage = MediaAsset & {
  id: string;
  /** Controls how much room the frame takes in the editorial mosaic. */
  size: "full" | "large" | "medium" | "small";
};

/**
 * A free-standing set of photographs for the gallery page, independent of
 * any one project. Add, remove, or reorder freely, `size` decides how much
 * space each image takes in the mosaic, not its position in the list.
 */
export const galleryImages: GalleryImage[] = [
  { id: "g1", type: "image", aspect: "3:4", alt: "Bride's hands holding a bouquet of dried flowers", placeholderTone: 2, size: "medium" },
  { id: "g2", type: "image", aspect: "16:9", alt: "Guests seated for a countryside wedding ceremony", placeholderTone: 5, size: "full" },
  { id: "g3", type: "image", aspect: "4:3", alt: "Close crop of a wedding ring exchange", placeholderTone: 7, size: "small" },
  { id: "g4", type: "image", aspect: "9:16", alt: "A groom adjusting his cufflinks before the ceremony", placeholderTone: 1, size: "large" },
  { id: "g5", type: "image", aspect: "4:3", alt: "Confetti thrown over a couple leaving their ceremony", placeholderTone: 4, size: "medium" },
  { id: "g6", type: "image", aspect: "3:4", alt: "A flower girl mid-step down the aisle", placeholderTone: 8, size: "small" },
  { id: "g7", type: "image", aspect: "16:9", alt: "A candlelit reception table setting", placeholderTone: 3, size: "large" },
  { id: "g8", type: "image", aspect: "4:3", alt: "A father and daughter sharing a quiet moment before the ceremony", placeholderTone: 6, size: "medium" },
  { id: "g9", type: "image", aspect: "9:16", alt: "A bride laughing mid-dance at her reception", placeholderTone: 2, size: "large" },
  { id: "g10", type: "image", aspect: "4:3", alt: "Detail of place cards and a table number", placeholderTone: 7, size: "small" },
  { id: "g11", type: "image", aspect: "16:9", alt: "A couple's silhouette during their evening send off", placeholderTone: 1, size: "full" },
  { id: "g12", type: "image", aspect: "3:4", alt: "A close crop of a couple's hands during the vows", placeholderTone: 5, size: "medium" },
];
