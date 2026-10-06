// @ts-check

/**
 * Trigger a browser download of a Blob.
 *
 * The object URL is revoked on the next tick rather than synchronously: some
 * browsers (Safari, older Firefox) start the download asynchronously after
 * click() and fail if the URL is already gone.
 *
 * @param {string} filename
 * @param {Blob} blob
 */
export function downloadBlob(filename, blob) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 0);
}
