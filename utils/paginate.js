const paginate = async (model, query={}, options) => {
    const { page = 1, limit = 10, populate = '', sort = '' } = options

    const results = await model.find(query)
        .populate(populate)
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit)
        .lean()
        .exec()

    const totalItems = await model.countDocuments(query).exec()

    return {
        data: results,
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: page
    };
};

module.exports = paginate
