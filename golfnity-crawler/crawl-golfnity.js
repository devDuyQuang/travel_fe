const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");

const url = "https://golfnity.vn/";

async function main() {
  const { data: html } = await axios.get(url, {
    headers: {
      "User-Agent": "Mozilla/5.0",
    },
  });

  const $ = cheerio.load(html);

  const result = {
    url,
    title: $("title").text().trim(),
    meta_description: $('meta[name="description"]').attr("content") || null,
    headings: [],
    links: [],
    images: [],
  };

  $("h1, h2, h3").each((_, el) => {
    result.headings.push({
      tag: el.tagName,
      text: $(el).text().trim(),
    });
  });

  $("a").each((_, el) => {
    const text = $(el).text().trim();
    const href = $(el).attr("href");

    if (text && href) {
      result.links.push({ text, href });
    }
  });

  $("img").each((_, el) => {
    const src = $(el).attr("src");
    const alt = $(el).attr("alt") || "";

    if (src) {
      result.images.push({ src, alt });
    }
  });

  fs.writeFileSync(
    "golfnity-home.json",
    JSON.stringify(result, null, 2),
    "utf8"
  );

  console.log("Done! Đã xuất file golfnity-home.json");
}

main().catch(console.error);