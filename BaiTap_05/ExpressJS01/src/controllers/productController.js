const {
    getProductsService,
    getProductByIdService,
    getTopSellingProductsService,
    getTopViewedProductsService,
    incrementProductViewService
} = require('../services/productService');

const getProducts = async (req, res) => {
    const data = await getProductsService(req.query);
    if (!data) {
        return res.status(500).json({ message: 'Không thể tải danh sách sản phẩm' });
    }
    return res.status(200).json(data);
};

const getProductById = async (req, res) => {
    const data = await getProductByIdService(req.params.id);
    if (!data) {
        return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    }
    // Increment view count (non-blocking)
    incrementProductViewService(req.params.id).catch(error => {
        console.log('>>> Error incrementing views:', error);
    });
    return res.status(200).json(data);
};

const getTopSellingProducts = async (req, res) => {
    const limit = req.query.limit || 10;
    const data = await getTopSellingProductsService(limit);
    if (!data) {
        return res.status(500).json({ message: 'Không thể tải danh sách sản phẩm bán chạy' });
    }
    return res.status(200).json(data);
};

const getTopViewedProducts = async (req, res) => {
    const limit = req.query.limit || 10;
    const data = await getTopViewedProductsService(limit);
    if (!data) {
        return res.status(500).json({ message: 'Không thể tải danh sách sản phẩm được xem nhiều' });
    }
    return res.status(200).json(data);
};

module.exports = {
    getProducts,
    getProductById,
    getTopSellingProducts,
    getTopViewedProducts
};

