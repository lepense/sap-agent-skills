import { parse } from "yaml";

export function parseFrontmatter(text) {
  const m = /^---\n([\s\S]*?)\n---\n?([\s\S]*)$/.exec(text);
  if (!m) return { data: null, body: text };
  return { data: parse(m[1]) ?? {}, body: m[2] };
}
