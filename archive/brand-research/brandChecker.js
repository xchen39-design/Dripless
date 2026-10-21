const brands = require("./brands.json");

function normalizeText(text) {
    return String(text || "")
        .toLowerCase()
        .replace(/&/g, " and ")
        .replace(/[^a-z0-9\s]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

function checkBrand(productTitle) {
    const normalizedTitle = normalizeText(productTitle);

    if (!normalizedTitle) return null;

    for (const entry of brands) {
        const brandName = entry.brand || "";
        const normalizedBrand = normalizeText(brandName);

        if (!normalizedBrand) continue;

        if (normalizedTitle.includes(normalizedBrand)) {
            return entry;
        }
    }

    return null;
}

module.exports = { checkBrand };