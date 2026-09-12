/**
 * Eight tonal gradients built from the real jewel-tone palette seen in the
 * studio's actual Instagram content (emerald and gold, magenta, mint,
 * ivory, red, rose gold, violet, lilac), standing in for media that hasn't
 * been added yet. No external images or stock footage are used anywhere
 * in this project — once a real photo or film exists, setting `src` on
 * that item's MediaAsset replaces this automatically.
 */
export const placeholderTones = [
  "linear-gradient(145deg, #0B4A3A 0%, #1F6E4F 45%, #B8975A 100%)", // emerald + gold
  "linear-gradient(140deg, #3A0F24 0%, #A61257 50%, #E0447F 100%)", // magenta
  "linear-gradient(155deg, #C9E8DD 0%, #8FC9B4 50%, #5D9C88 100%)", // mint
  "linear-gradient(140deg, #FBF6EF 0%, #F0DCE0 55%, #D9B8BE 100%)", // ivory / blush
  "linear-gradient(150deg, #2A0808 0%, #7A1414 50%, #B8342A 100%)", // red
  "linear-gradient(145deg, #F4E3D3 0%, #E0A9A0 55%, #B9776E 100%)", // rose gold
  "linear-gradient(150deg, #2E1440 0%, #6B3A96 50%, #A374C7 100%)", // violet
  "linear-gradient(150deg, #D8C7E8 0%, #B79BCB 50%, #8A6BA8 100%)", // lilac
];

export function placeholderTone(index: number) {
  return placeholderTones[(index - 1 + placeholderTones.length) % placeholderTones.length];
}
