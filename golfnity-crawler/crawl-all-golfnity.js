const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");

const START_URL = "https://golfnity.vn/";
const DOMAIN = "https://golfnity.vn";

const visited = new Set();
const queue = [START_URL];
const results = [];

function normalizeUrl(href) {
  if (!href) return null;
  if (href.startsWith("#")) return null;
  if (href.startsWith("tel:")) return null;
  if (href.startsWith("mailto:")) return null;

  try {
    const url = new URL(href, DOMAIN);
    url.hash = "";

    if (!url.href.startsWith(DOMAIN)) return null;

    return url.href.endsWith("/") ? url.href : url.href + "/";
  } catch {
    return null;
  }
}

async function crawlPage(url) {
  const { data: html } = await axios.get(url, {
    headers: {
      "User-Agent": "Mozilla/5.0",
    },
    timeout: 30000,
  });

  const $ = cheerio.load(html);

  const pageData = {
    url,
    title: $("title").text().trim(),
    meta_description: $('meta[name="description"]').attr("content") || null,
    h1: $("h1").first().text().trim(),
    headings: [],
    links: [],
    images: [],
    content_text: $("body").text().replace(/\s+/g, " ").trim().slice(0, 5000),
  };

  $("h1, h2, h3").each((_, el) => {
    const text = $(el).text().trim();
    if (text) {
      pageData.headings.push({
        tag: el.tagName,
        text,
      });
    }
  });

  $("img").each((_, el) => {
    const src =
      $(el).attr("src") ||
      $(el).attr("data-src") ||
      $(el).attr("data-lazy-src");

    const alt = $(el).attr("alt") || "";

    if (src && !src.startsWith("data:image")) {
      pageData.images.push({ src, alt });
    }
  });

  $("a").each((_, el) => {
    const text = $(el).text().trim();
    const href = normalizeUrl($(el).attr("href"));

    if (href) {
      pageData.links.push({ text, href });

      if (!visited.has(href) && !queue.includes(href)) {
        queue.push(href);
      }
    }
  });

  return pageData;
}

async function main() {
  while (queue.length > 0) {
    const url = queue.shift();

    if (visited.has(url)) continue;

    console.log("Crawling:", url);

    try {
      visited.add(url);

      const data = await crawlPage(url);
      results.push(data);

      // Nghỉ nhẹ để không spam server
      await new Promise((resolve) => setTimeout(resolve, 500));
    } catch (error) {
      console.log("Failed:", url, error.message);
    }
  }

  fs.writeFileSync(
    "golfnity-all-pages.json",
    JSON.stringify(results, null, 2),
    "utf8"
  );

  console.log(`Done! Crawled ${results.length} pages`);
  console.log("Output: golfnity-all-pages.json");
}

main();