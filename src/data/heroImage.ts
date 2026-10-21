import type { GalleryImage } from './types';

export function getHeroImageDelivery(image: GalleryImage) {
  const original = image.fullUrl || image.url;
  const base = { src: original, previewSrc: image.url, fallbackSources: [image.url] };
  if (!image.width || !image.height || image.width <= 0 || image.height <= 0) return base;

  try {
    const url = new URL(original);
    const match = url.pathname.match(/^\/wikipedia\/commons\/([a-f0-9])\/([a-f0-9]{2})\/([^/]+\.jpe?g)$/i);
    if (url.protocol !== 'https:' || url.hostname !== 'upload.wikimedia.org' || !match) return base;
    const filename = encodeURIComponent(decodeURIComponent(match[3]));
    const candidates = [1280, 1920, 3840].filter(width => width <= image.width!).map(width => ({
      width,
      url: `${url.origin}/wikipedia/commons/thumb/${match[1]}/${match[2]}/${filename}/${width}px-${filename}`,
    }));
    if (image.width < 3840 && !candidates.some(candidate => candidate.width === image.width)) {
      candidates.push({ width: image.width, url: original.replace(/,/g, '%2C') });
    }
    const primary = candidates.find(candidate => candidate.width >= 1920) ?? candidates[candidates.length - 1];
    if (!primary) return base;
    const ratio = image.width / image.height;
    return {
      src: primary.url,
      srcSet: candidates.map(candidate => `${candidate.url} ${candidate.width}w`).join(', '),
      // Cover cropping needs enough pixels for the hero's height as well as its width.
      sizes: `max(100vw, ${Math.ceil(ratio * 70)}vh, ${Math.ceil(ratio * 500)}px)`,
      previewSrc: image.url,
      fallbackSources: [original, image.url],
    };
  } catch {
    return base;
  }
}
