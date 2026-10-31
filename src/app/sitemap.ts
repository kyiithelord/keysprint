import type { MetadataRoute } from "next";
import { guides } from "@/lib/guides";

const origin = "https://typencil.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["/", "/lessons", "/game", "/daily", "/guides", "/about", ...guides.map(guide => `/guides/${guide.slug}`)];
  return paths.map(path => ({ url: `${origin}${path}` }));
}
