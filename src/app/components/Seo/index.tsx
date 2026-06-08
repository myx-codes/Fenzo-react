import { useEffect } from "react";

type SeoProps = {
  title: string;
  description: string;
  noIndex?: boolean;
};

const SITE_URL = "https://fenzo.uz";
const DEFAULT_IMAGE = "/icons/logoIcon.png";

export function Seo({ title, description, noIndex = false }: SeoProps) {
  useEffect(() => {
    document.title = title;

    updateMetaTag('meta[name="description"]', "content", description);
    updateMetaTag('meta[property="og:title"]', "content", title);
    updateMetaTag('meta[property="og:description"]', "content", description);
    updateMetaTag('meta[property="og:type"]', "content", "website");
    updateMetaTag('meta[property="og:url"]', "content", window.location.href);
    updateMetaTag('meta[property="og:image"]', "content", `${window.location.origin}${DEFAULT_IMAGE}`);
    updateMetaTag('meta[name="twitter:card"]', "content", "summary_large_image");
    updateMetaTag('meta[name="twitter:title"]', "content", title);
    updateMetaTag('meta[name="twitter:description"]', "content", description);
    updateMetaTag('link[rel="canonical"]', "href", `${SITE_URL}${window.location.pathname}`);
    updateRobots(noIndex);
  }, [description, noIndex, title]);

  return null;
}

function updateMetaTag(selector: string, attr: string, value: string) {
  let element = document.head.querySelector<HTMLMetaElement | HTMLLinkElement>(selector);

  if (!element) {
    element = createElementForSelector(selector);
    document.head.appendChild(element);
  }

  element.setAttribute(attr, value);
}

function createElementForSelector(selector: string) {
  if (selector.startsWith("link")) {
    return document.createElement("link");
  }

  return document.createElement("meta");
}

function updateRobots(noIndex: boolean) {
  updateMetaTag('meta[name="robots"]', "content", noIndex ? "noindex, nofollow" : "index, follow");
}
