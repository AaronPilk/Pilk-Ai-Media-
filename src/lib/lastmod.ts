import { execFileSync } from "node:child_process";

const buildTime = new Date();
const cache = new Map<string, Date>();

/**
 * Last commit date touching any of `paths`, so sitemap lastmod moves only when
 * a page's own source changes, not on every build. Falls back to the build time
 * when git is unavailable or the files are not committed yet (a new page).
 *
 * In a shallow clone, files untouched within the fetched depth report the
 * boundary commit's date; deploy from a full clone for exact dates.
 */
export function lastModified(paths: string[]): Date {
  const key = paths.join("\n");
  const hit = cache.get(key);
  if (hit) return hit;

  let date = buildTime;
  try {
    const git = (args: string[]) =>
      execFileSync("git", args, {
        encoding: "utf8",
        stdio: ["ignore", "pipe", "ignore"],
      }).trim();
    // Uncommitted edits are newer than any commit: date them by the build.
    const dirty = git(["status", "--porcelain", "--", ...paths]);
    const committed = dirty
      ? ""
      : git(["log", "-1", "--format=%cI", "--", ...paths]);
    if (committed) date = new Date(committed);
  } catch {
    // No git (for example a source tarball build): the build time is honest enough.
  }
  cache.set(key, date);
  return date;
}
