const fs = require("fs");

const data = require("./golfnity-all-pages.json");

const selected = [
  {
    oldSlug: "teetime",
    targetType: "category",
    targetSlug: "dat-tee-time",
    targetName: "Đặt tee time",
  },
  {
    oldSlug: "thue-xe-du-lich",
    targetType: "post",
    targetCategorySlug: "thue-xe-dua-don",
    targetName: "Thuê xe du lịch",
  },
];

function findPage(oldSlug) {
  return data.find((p) => {
    const slug = p.url
      .replace("https://golfnity.vn/", "")
      .replace(/\/$/, "");
    return slug === oldSlug;
  });
}

function cleanText(text = "") {
  return text
    .replace(/<iframe[\s\S]*?<\/iframe>/g, "")
    .replace(/var doc[\s\S]*?Skip to content/g, "")
    .replace(/Dịch vụ như ý[\s\S]*?Thiết bị/g, "")
    .replace(/tin tức về golf[\s\S]*$/i, "")
    .replace(/Thành tích và dự án Golf[\s\S]*$/i, "")
    .replace(/Toggle Navigation/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const result = selected.map((item) => {
  const page = findPage(item.oldSlug);

  if (!page) {
    return { ...item, found: false };
  }

  const image = page.images?.find(
    (img) =>
      img.src &&
      !img.src.includes("golfnity-logo") &&
      !img.src.includes("Payment")
  );

  return {
    ...item,
    found: true,
    source_url: page.url,
    title: page.h1 || page.title || item.targetName,
    slug: item.targetSlug || item.oldSlug,
    meta_title: page.title || "",
    meta_description: page.meta_description || "",
    description: page.meta_description || "",
    image: image?.src || "",
    image_alt: image?.alt || "",
    content_text: cleanText(page.content_text || ""),
  };
});

fs.writeFileSync(
  "./cms-import-selected.json",
  JSON.stringify(result, null, 2)
);

console.log("Done: cms-import-selected.json");
console.log(result.map((x) => `${x.targetName}: ${x.found}`).join("\n"));