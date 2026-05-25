import { Outlet } from "react-router-dom";
import Header from "./components/layout/header";
import axios from "./util/axios.customize";
import { useContext, useEffect } from "react";
import { AuthContext } from "./components/context/auth.context";

function App() {
    const { auth, setAuth, appLoading, setAppLoading } = useContext(AuthContext);

    useEffect(() => {
        const fetchAccount = async () => {
            try {
                setAppLoading(true);
                const res = await axios.get(`/v1/api/account`);
                if (res && !res.message) {
                    setAuth({
                        isAuthenticated: true,
                        user: { email: res.email, name: res.name }
                    });
                } else {
                    localStorage.removeItem("access_token");
                    setAuth({
                        isAuthenticated: false,
                        user: { email: "", name: "" }
                    });
                }
            } catch (error) {
                localStorage.removeItem("access_token");
                setAuth({
                    isAuthenticated: false,
                    user: { email: "", name: "" }
                });
            } finally {
                setAppLoading(false);
            }
        };
        fetchAccount();
    }, [setAuth, setAppLoading])

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800">
            {appLoading ? (
                <div className="flex min-h-screen items-center justify-center">
                    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-blue-600" />
                        <span className="text-sm font-medium text-slate-700">Đang tải dữ liệu tài khoản...</span>
                    </div>
                </div>
            ) : (
                <>
                    <Header />
                    <Outlet />
                </>
            )}
        </div>
    )
}
export default App;