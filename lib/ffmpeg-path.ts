import { constants } from "fs";
import { access, chmod } from "fs/promises";
import ffmpegStatic from "ffmpeg-static";

/**
 * Resolves FFmpeg binary: bundled npm package first, then system PATH.
 */
export async function resolveFfmpegPath(): Promise<string> {
  const bundled =
    typeof ffmpegStatic === "string" && ffmpegStatic.length > 0
      ? ffmpegStatic
      : null;

  if (bundled) {
    try {
      await access(bundled, constants.F_OK);
      if (process.platform !== "win32") {
        await chmod(bundled, 0o755).catch(() => {});
      }
      return bundled;
    } catch {
      /* use system fallback */
    }
  }

  return "ffmpeg";
}
