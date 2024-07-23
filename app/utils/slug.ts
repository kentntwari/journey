import slugify from "slugify";
import { nanoid } from "nanoid";

export function generateSlug(title: string) {
  const slug =
    slugify(title, {
      lower: true,
      strict: true,
    }) +
    "-" +
    nanoid(12);

  return slug;
}
