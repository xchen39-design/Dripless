const { checkBrand } = require("./brandChecker");

function isValidResult(result) {
    if (!result) return false;
    if (!result.title || typeof result.title !== "string") return false;
    if (!result.thumbnail || typeof result.thumbnail !== "string") return false;
    if (!result.price || typeof result.price !== "string") return false;

    const lowerTitle = result.title.toLowerCase();
    const badWords = ["sponsored", "ad"];

    for (const word of badWords) {
        if (lowerTitle.includes(word)) return false;
    }

    return true;
}

function getBrandStatus(brandMatch) {
    if (!brandMatch) {
        return {
            shouldFilter: false,
            sustainableBadge: false,
        };
    }

    const category = brandMatch.category || "";

    if (
        category.includes("fast_fashion") ||
        category.includes("low_tier_fast_fashion")
    ) {
        return {
            shouldFilter: true,
            sustainableBadge: false,
        };
    }

    if (category.includes("high_environment")) {
        return {
            shouldFilter: false,
            sustainableBadge: true,
        };
    }

    return {
        shouldFilter: false,
        sustainableBadge: false,
    };
}

function filterAndTagProducts(results) {
    if (!Array.isArray(results)) return [];

    const cleaned = [];

    for (const result of results) {
        if (!isValidResult(result)) continue;

        const brandMatch = checkBrand(result.title);
        const brandStatus = getBrandStatus(brandMatch);

        if (brandStatus.shouldFilter) continue;

        cleaned.push({
            ...result,
            sustainableBadge: brandStatus.sustainableBadge,
            matchedBrand: brandMatch ? brandMatch.brand : null,
        });
    }

    return cleaned;
}

module.exports = {
    isValidResult,
    getBrandStatus,
    filterAndTagProducts,
};