const express = require('express');
const { createUser, handleLogin, getUser, getAccount, handleForgotPassword } = require('../controllers/userController');
const { getProducts, getProductById, getTopSellingProducts, getTopViewedProducts } = require('../controllers/productController');
const { addToCart, getCart, updateCart, removeFromCart, clearCart, validateCart } = require('../controllers/cartController');
const { checkout, getOrderHistory, getOrderDetail, getTimeline, cancelOrder, triggerAutoConfirm } = require('../controllers/orderController');
const auth = require('../middleware/auth');
const delay = require('../middleware/delay');

const routerAPI = express.Router();

routerAPI.get("/", (req, res) => {
    return res.status(200).json("Hello world api");
});

routerAPI.get("/products", getProducts);
routerAPI.get("/products/top-selling", getTopSellingProducts);
routerAPI.get("/products/top-viewed", getTopViewedProducts);
routerAPI.get("/products/:id", getProductById);

routerAPI.post("/register", createUser);
routerAPI.post("/login", handleLogin);
routerAPI.post("/forgot-password", handleForgotPassword);

routerAPI.use(auth);

routerAPI.get("/user", getUser);
routerAPI.get("/account", delay, getAccount);

// Cart Routes
routerAPI.post("/cart/add", addToCart);
routerAPI.get("/cart", getCart);
routerAPI.put("/cart/update", updateCart);
routerAPI.delete("/cart/remove", removeFromCart);
routerAPI.delete("/cart/clear", clearCart);
routerAPI.get("/cart/validate", validateCart);

// Order Routes
routerAPI.post("/order/checkout", checkout);
routerAPI.get("/order/history", getOrderHistory);
routerAPI.get("/order/:orderId", getOrderDetail);
routerAPI.get("/order/:orderId/timeline", getTimeline);
routerAPI.post("/order/:orderId/cancel", cancelOrder);
routerAPI.post("/order/:orderId/confirm", triggerAutoConfirm);

module.exports = routerAPI;