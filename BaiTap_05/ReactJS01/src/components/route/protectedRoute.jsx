import { Navigate, Outlet } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/auth.context';

const ProtectedRoute = ({ children }) => {
    const { auth, appLoading } = useContext(AuthContext);

    if (appLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 shadow-lg backdrop-blur">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-indigo-500" />
                    <span className="text-sm font-medium text-slate-200">Đang xác thực phiên đăng nhập...</span>
                </div>
            </div>
        );
    }

    if (!auth?.isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children ?? <Outlet />;
};

export default ProtectedRoute;

