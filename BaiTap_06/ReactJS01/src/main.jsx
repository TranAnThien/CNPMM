import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/global.css';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RegisterPage from './pages/register.jsx';
import HomePage from './pages/home.jsx';
import AccountPage from './pages/account.jsx';
import LoginPage from './pages/login.jsx';
import ForgotPasswordPage from './pages/forgotPassword.jsx';
import { AuthWrapper } from './components/context/auth.context.jsx';
import { CartWrapper } from './components/context/cart.context.jsx';
import { ModalProvider } from './components/common/ModalContext.jsx';
import { ToastProvider } from './components/common/ToastContext.jsx';
import ShopPage from './pages/shop.jsx';
import ProductDetailPage from './pages/productDetail.jsx';
import ProtectedRoute from './components/route/protectedRoute.jsx';
import CartPage from './pages/cart.jsx';
import CheckoutPage from './pages/checkout.jsx';
import OrderHistoryPage from './pages/orderHistory.jsx';
import OrderDetailPage from './pages/orderDetail.jsx';

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            { index: true, element: <HomePage /> },
            { path: "shop", element: <ShopPage /> },
            { path: "product/:id", element: <ProductDetailPage /> },
            { path: "cart", element: <ProtectedRoute><CartPage /></ProtectedRoute> },
            { path: "checkout", element: <ProtectedRoute><CheckoutPage /></ProtectedRoute> },
            { path: "order/history", element: <ProtectedRoute><OrderHistoryPage /></ProtectedRoute> },
            { path: "order/:orderId", element: <ProtectedRoute><OrderDetailPage /></ProtectedRoute> },
            { path: "tai-khoan", element: <ProtectedRoute><AccountPage /></ProtectedRoute> }
        ]
    },
    { path: "register", element: <RegisterPage /> },
    { path: "login", element: <LoginPage /> },
    { path: "forgot-password", element: <ForgotPasswordPage /> }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
    <AuthWrapper>
        <CartWrapper>
            <ModalProvider>
                <ToastProvider>
                    <RouterProvider router={router} />
                </ToastProvider>
            </ModalProvider>
        </CartWrapper>
    </AuthWrapper>,
)