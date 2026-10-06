import assert from 'node:assert/strict';
import test from 'node:test';
import { is4K, nextPhotoIndex, cleanCaption } from './sync-country-images.mjs';

test('new photo captions use source titles instead of upload campaign templates', () => {
  assert.equal(cleanCaption('This is an image with the theme " Farm to Plate " from:', 'Burundi Rutana.jpg'), 'Burundi Rutana');
  assert.equal(cleanCaption('Esta fotografía fue tomada en el municipio colombiano con código 68307.', 'Hidrosogamoso, Represa.JPG'), 'Hidrosogamoso, Represa');
  assert.equal(cleanCaption('Esta fotografía fue tomada en un área protegida de Colombia con el código N/A del RUNAP .', 'Building in Punta Gallinas 2.jpg'), 'Building in Punta Gallinas 2');
  assert.equal(cleanCaption('A garden in Belarus.', 'Garden.jpg'), 'A garden in Belarus.');
});

const full = { width: 3840, height: 2160 };
const panorama = { width: 6000, height: 1800 };
const narrow = { width: 3600, height: 2400 };

test('4K selection requires both original dimensions without upscaling', () => {
  assert.equal(is4K(full), true);
  assert.equal(is4K(panorama), false);
  assert.equal(is4K(narrow), false);
});

test('upgrade replaces only deficient slots without dropping existing photographs', () => {
  const gallery = [full, panorama, full, narrow, full, full];
  const before = [...gallery];
  assert.equal(nextPhotoIndex(gallery, true), 1);
  assert.deepEqual(gallery, before);
  gallery[1] = full;
  assert.equal(nextPhotoIndex(gallery, true), 3);
  gallery[3] = full;
  assert.equal(nextPhotoIndex(gallery, true), -1);
  assert.equal(gallery.length, 6);
});

test('ordinary sync retains complete lower-resolution galleries', () => {
  assert.equal(nextPhotoIndex(Array(6).fill(panorama)), -1);
  assert.equal(nextPhotoIndex([full, narrow]), 2);
  assert.equal(nextPhotoIndex([full, narrow], true), 1);
  assert.equal(nextPhotoIndex([], true), 0);
});
