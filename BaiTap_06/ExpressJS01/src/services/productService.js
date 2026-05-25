const Product = require('../models/product');
const productSeed = require('../data/productSeed');

const parseBooleanQuery = (value) => {
    if (value === undefined || value === null || value === '') {
        return null;
    }

    if (value === true || value === 'true') {
        return true;
    }

    if (value === false || value === 'false') {
        return false;
    }

    return null;
};

const parseNumberQuery = (value) => {
    if (value === undefined || value === null || value === '') {
        return null;
    }

    const parsedValue = Number(value);
    return Number.isNaN(parsedValue) ? null : parsedValue;
};

const buildProductFilter = ({ keyword, category, minPrice, maxPrice, isPromotion, stockStatus }) => {
    const filter = {};

    if (keyword) {
        filter.name = { $regex: keyword, $options: 'i' };
    }

    if (category && category !== 'all') {
        filter.category = category;
    }

    const min = parseNumberQuery(minPrice);
    const max = parseNumberQuery(maxPrice);
    if (min !== null || max !== null) {
        filter.price = {};
        if (min !== null) {
            filter.price.$gte = min;
        }
        if (max !== null) {
            filter.price.$lte = max;
        }
    }

    const promotionValue = parseBooleanQuery(isPromotion);
    if (promotionValue !== null) {
        filter.isPromotion = promotionValue;
    }

    if (stockStatus === 'in-stock') {
        filter.stock = { $gt: 0 };
    }

    if (stockStatus === 'out-of-stock') {
        filter.stock = { $lte: 0 };
    }

    return filter;
};

const buildSortOption = (sort) => {
    if (sort === 'bestseller') {
        return { sold: -1, createdAt: -1 };
    }

    return { createdAt: -1 };
};

const getProductsService = async (query = {}) => {
    try {
        const {
            keyword = '',
            category = 'all',
            sort = 'newest',
            minPrice = '',
            maxPrice = '',
            isPromotion = '',
            stockStatus = '',
            page = '1',
            limit = '12'
        } = query;

        const filter = buildProductFilter({
            keyword: keyword.trim(),
            category: category.trim(),
            minPrice,
            maxPrice,
            isPromotion,
            stockStatus: stockStatus.trim()
        });
        const sortOption = buildSortOption(sort.trim());

        // Parse pagination parameters
        const pageNum = Math.max(1, parseInt(page) || 1);
        const limitNum = Math.max(1, Math.min(100, parseInt(limit) || 12));
        const skip = (pageNum - 1) * limitNum;

        // Execute queries in parallel for better performance
        const [products, total] = await Promise.all([
            Product.find(filter).sort(sortOption).skip(skip).limit(limitNum),
            Product.countDocuments(filter)
        ]);

        return {
            data: products,
            pagination: {
                page: pageNum,
                limit: limitNum,
                total,
                pages: Math.ceil(total / limitNum)
            }
        };
    } catch (error) {
        console.log('>>> getProductsService error:', error);
        return null;
    }
};

const getProductByIdService = async (productId) => {
    try {
        return await Product.findById(productId);
    } catch (error) {
        console.log('>>> getProductByIdService error:', error);
        return null;
    }
};

const getTopSellingProductsService = async (limit = 10) => {
    try {
        const limitNum = Math.max(1, Math.min(100, parseInt(limit) || 10));
        return await Product.find({ stock: { $gt: 0 } })
            .sort({ sold: -1 })
            .limit(limitNum);
    } catch (error) {
        console.log('>>> getTopSellingProductsService error:', error);
        return null;
    }
};

const getTopViewedProductsService = async (limit = 10) => {
    try {
        const limitNum = Math.max(1, Math.min(100, parseInt(limit) || 10));
        return await Product.find({ stock: { $gt: 0 } })
            .sort({ views: -1 })
            .limit(limitNum);
    } catch (error) {
        console.log('>>> getTopViewedProductsService error:', error);
        return null;
    }
};

const incrementProductViewService = async (productId) => {
    try {
        return await Product.findByIdAndUpdate(
            productId,
            { $inc: { views: 1 } },
            { new: true }
        );
    } catch (error) {
        console.log('>>> incrementProductViewService error:', error);
        return null;
    }
};

const seedProductsIfEmptyService = async () => {
    try {
        const totalProducts = await Product.countDocuments();
        if (totalProducts > 0) {
            return { seeded: false, totalProducts };
        }

        await Product.insertMany(productSeed);
        return { seeded: true, totalProducts: productSeed.length };
    } catch (error) {
        console.log('>>> seedProductsIfEmptyService error:', error);
        return { seeded: false, totalProducts: 0 };
    }
};

module.exports = {
    getProductsService,
    getProductByIdService,
    getTopSellingProductsService,
    getTopViewedProductsService,
    incrementProductViewService,
    seedProductsIfEmptyService
};

