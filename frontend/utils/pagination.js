function paginate(items, page, limit) {
    page = parseInt(page) || 1;   // ensure page is a number
    limit = limit || 12;

    if (!Array.isArray(items)) {
        return {
            paginatedItems: [],   // fixed typo
            currentPage: page,
            totalPages: 0
        };
    }

    const totalItems = items.length;
    const totalPages = Math.ceil(totalItems / limit);
    const start = (page - 1) * limit;
    const end = start + limit;

    const paginatedItems = items.slice(start, end);

    return {
        paginatedItems: paginatedItems,
        currentPage: page,
        totalPages: totalPages
    };
}

module.exports = { paginate };
