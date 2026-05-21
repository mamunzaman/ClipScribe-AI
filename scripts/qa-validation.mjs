/**
 * Quick QA script for file validation (no deps).
 * Run: node scripts/qa-validation.mjs
 */

const ACCEPTED_EXTENSIONS = [".mp4", ".mov", ".mp3", ".wav"];
const MAX_FILE_SIZE_BYTES = 500 * 1024 * 1024;

function getExtension(filename) {
  const dot = filename.lastIndexOf(".");
  return dot >= 0 ? filename.slice(dot).toLowerCase() : "";
}

function validateMediaFile(file) {
  const ext = getExtension(file.name);
  if (!ACCEPTED_EXTENSIONS.includes(ext)) {
    return { valid: false, error: `Unsupported format. Use MP4, MOV, MP3, or WAV.` };
  }
  const mimeOk =
    !file.type ||
    file.type.startsWith("video/") ||
    file.type.startsWith("audio/");
  if (!mimeOk && file.type) {
    return { valid: false, error: `Unsupported file type (${file.type}).` };
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return { valid: false, error: `File too large. Maximum size is 500 MB.` };
  }
  if (file.size === 0) {
    return { valid: false, error: "File is empty." };
  }
  return { valid: true };
}

const mock = (name, type, size) => ({ name, type, size });

const cases = [
  [mock("clip.mp3", "audio/mpeg", 1024), true],
  [mock("clip.mp4", "video/mp4", 2048), true],
  [mock("clip.MP3", "audio/mpeg", 512), true],
  [mock("doc.pdf", "application/pdf", 100), false],
  [mock("huge.mp3", "audio/mpeg", MAX_FILE_SIZE_BYTES + 1), false],
  [mock("empty.wav", "audio/wav", 0), false],
  [mock("clip.mov", "video/quicktime", 1000), true],
];

let passed = 0;
for (const [file, expectValid] of cases) {
  const r = validateMediaFile(file);
  const ok = r.valid === expectValid;
  if (ok) passed++;
  else console.error("FAIL", file.name, r, "expected valid=", expectValid);
}
console.log(`Validation QA: ${passed}/${cases.length} passed`);
process.exit(passed === cases.length ? 0 : 1);
