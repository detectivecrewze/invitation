export const MAX_AUDIO_UPLOAD_BYTES = 25 * 1024 * 1024;

export function isMp3File(file: Pick<File, "name" | "type">): boolean {
  return file.type.toLowerCase() === "audio/mpeg" || file.name.toLowerCase().endsWith(".mp3");
}

export function audioDisplayName(value: string): string {
  const withoutQuery = value.split(/[?#]/, 1)[0] ?? "";
  const lastSegment = withoutQuery.split("/").pop() ?? "";
  let decoded = lastSegment;

  try {
    decoded = decodeURIComponent(lastSegment);
  } catch {
    // Keep the original segment when it is not valid URL encoding.
  }

  const cleaned = decoded
    .replace(/\.mp3$/i, "")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return cleaned || "Lagu pilihan kamu";
}
