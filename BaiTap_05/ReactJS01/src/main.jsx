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
import ShopPage from './pages/shop.jsx';
import ProductDetailPage from './pages/productDetail.jsx';
import ProtectedRoute from './components/route/protectedRoute.jsx';

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            { index: true, element: <HomePage /> },
            { path: "shop", element: <ShopPage /> },
            { path: "product/:id", element: <ProductDetailPage /> },
            { path: "tai-khoan", element: <ProtectedRoute><AccountPage /></ProtectedRoute> }
        ]
    },
    { path: "register", element: <RegisterPage /> },
    { path: "login", element: <LoginPage /> },
    { path: "forgot-password", element: <ForgotPasswordPage /> }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
    <AuthWrapper>
        <RouterProvider router={router} />
    </AuthWrapper>,
)