import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

import { onRequest } from "../functions/pdf/[[path]].ts";

const encoder = new TextEncoder();

function createBucket(objects = new Map()) {
  return {
    async head(key) {
      const object = objects.get(key);
      if (!object) return null;
      return {
        size: object.bytes.byteLength,
        httpEtag: object.etag,
        writeHttpMetadata(headers) {
          headers.set("content-type", object.contentType);
        },
      };
    },
    async get(key, options) {
      const object = objects.get(key);
      if (!object) return null;

      const bytes = options?.range
        ? object.bytes.subarray(
            options.range.offset,
            options.range.offset + options.range.length
          )
        : object.bytes;

      return {
        size: object.bytes.byteLength,
        httpEtag: object.etag,
        body: new ReadableStream({
          start(controller) {
            controller.enqueue(bytes);
            controller.close();
          },
        }),
        writeHttpMetadata(headers) {
          headers.set("content-type", object.contentType);
        },
      };
    },
  };
}

test("returns 404 when the R2 object does not exist", async () => {
  const response = await onRequest({
    request: new Request("https://teach.matnoble.top/pdf/discrete/missing.pdf"),
    env: { DOWNLOADS_BUCKET: createBucket() },
    params: { path: ["discrete", "missing.pdf"] },
  });

  assert.equal(response.status, 404);
});

test("streams an R2 object with metadata and cache headers", async () => {
  const bytes = encoder.encode("%PDF-1.4 test payload");
  const objects = new Map([
    [
      "discrete/2026-2027-1/test.pdf",
      { bytes, etag: '"etag-123"', contentType: "application/pdf" },
    ],
  ]);

  const response = await onRequest({
    request: new Request("https://teach.matnoble.top/pdf/discrete/2026-2027-1/test.pdf"),
    env: { DOWNLOADS_BUCKET: createBucket(objects) },
    params: { path: ["discrete", "2026-2027-1", "test.pdf"] },
  });

  assert.equal(response.status, 200);
  assert.equal(response.headers.get("content-type"), "application/pdf");
  assert.equal(response.headers.get("etag"), '"etag-123"');
  assert.equal(response.headers.get("cache-control"), "public, max-age=3600");
  assert.equal(await response.text(), "%PDF-1.4 test payload");
});

test("HEAD returns object headers without a body", async () => {
  const bytes = encoder.encode("%PDF-1.4 test payload");
  const objects = new Map([
    [
      "discrete/2026-2027-1/test.pdf",
      { bytes, etag: '"etag-123"', contentType: "application/pdf" },
    ],
  ]);

  const response = await onRequest({
    request: new Request("https://teach.matnoble.top/pdf/discrete/2026-2027-1/test.pdf", { method: "HEAD" }),
    env: { DOWNLOADS_BUCKET: createBucket(objects) },
    params: { path: ["discrete", "2026-2027-1", "test.pdf"] },
  });

  assert.equal(response.status, 200);
  assert.equal(response.headers.get("content-type"), "application/pdf");
  assert.equal(response.headers.get("etag"), '"etag-123"');
  assert.equal(response.headers.get("content-length"), String(bytes.byteLength));
  assert.equal(response.body, null);
});

test("download pages use the same-origin R2 proxy", async () => {
  const files = [
    "docs/courses/discrete-math-2026-fall.md",
    "docs/.vitepress/theme/components/ManimVideo.vue",
  ];

  for (const file of files) {
    const source = await readFile(new URL(`../${file}`, import.meta.url), "utf8");
    assert.match(source, /\/(pdf|v|r2-assets)\/?/, file);
    assert.doesNotMatch(source, /CDN_BASE\s*=\s*['"]\/assets\//, file);
    assert.doesNotMatch(source, /\/assets-test\//, file);
    assert.doesNotMatch(source, /CDN_BASE\s*=\s*['"]\/downloads\//, file);
    assert.doesNotMatch(source, /https:\/\/assets\.matnoble\.top\//, file);
  }
});
