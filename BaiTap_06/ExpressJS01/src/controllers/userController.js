
const { createUserService, loginService, getUserService, forgotPasswordService } = require("../services/userService");

const createUser = async (req, res) => {
    const { name, email, password } = req.body;
    const data = await createUserService(name, email, password);
    if (data && data._id) {
        return res.status(200).json({
            EC: 0,
            data: { _id: data._id, name: data.name, email: data.email, role: data.role },
            EM: "Đăng ký thành công"
        });
    }
    return res.status(200).json({ EC: 1, EM: data ? "Email đã được sử dụng" : "Lỗi đăng ký" });
}

const handleLogin = async (req, res) => {
    const { email, password } = req.body;
    const data = await loginService(email, password);
    return res.status(200).json(data);
}

const getUser = async (req, res) => {
    const data = await getUserService();
    return res.status(200).json(data);
}

const getAccount = async (req, res) => {
    return res.status(200).json({
        _id: req.user?._id,
        email: req.user?.email,
        name: req.user?.name
    });
}

const handleForgotPassword = async (req, res) => {
    const { email, newPassword } = req.body;
    const data = await forgotPasswordService(email, newPassword);
    return res.status(200).json(data);
}

module.exports = { createUser, handleLogin, getUser, getAccount, handleForgotPassword };