import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/content";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  // /thumb/* are chrome-less capture pages, not content.
  return { rules: [{ userAgent: "*", allow: "/", disallow: ["/thumb/"] }], sitemap: `${SITE_URL}/sitemap.xml` };
}
