const { getProductsService, getProductByIdService } = require('../services/productService');

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
    return res.status(200).json(data);
};

module.exports = { getProducts, getProductById };

